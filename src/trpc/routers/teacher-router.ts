import { db } from "@/lib/prisma";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../init";
import {
  CreateApplicationSchema,
  UpdateApplicationStatusSchema,
} from "../types/teacher-types";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

export const teacherRouter = createTRPCRouter({
  getApplication: protectedProcedure.query(async ({ ctx }) => {
    const application = await db.teacherApplication.findUnique({
      where: {
        userId: ctx.user.id,
      },
      include: {
        department: {
          select: {
            name: true,
            code: true,
            description: true,
          },
        },
      },
    });

    return application;
  }),
  applyForTeacher: protectedProcedure
    .input(CreateApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user already applied
      const existingApplication = await db.teacherApplication.findUnique({
        where: { userId: ctx.user.id },
      });

      if (existingApplication) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already submitted a teacher application.",
        });
      }

      // Create application linked to logged in user
      return await db.teacherApplication.create({
        data: {
          userId: ctx.user.id,
          ...input,
        },
      });
    }),

  reviewApplication: adminProcedure
    .input(UpdateApplicationStatusSchema)
    .mutation(async ({ input }) => {
      const application = await db.teacherApplication.findUnique({
        where: { id: input.id },
      });

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      // Handle Rejection
      if (input.status === "REJECTED") {
        return await db.teacherApplication.update({
          where: { id: input.id },
          data: {
            status: "REJECTED",
            adminNotes: input.adminNotes,
          },
        });
      }

      const employeeId = uuidv4();

      // Run updates inside a safe Database Transaction
      const [newTeacher] = await db.$transaction([
        // Mark application as approved
        db.teacherApplication.update({
          where: { id: input.id },
          data: {
            status: "APPROVED",
            adminNotes: input.adminNotes,
          },
        }),
        // Update User system role
        db.user.update({
          where: { id: application.userId },
          data: { role: "TEACHER" },
        }),
        // Spawn the core Teacher record
        db.teacher.create({
          data: {
            userId: application.userId,
            departmentId: application.departmentId,
            phone: application.phone,
            qualification: application.qualification,
            specialization: application.specialization,
            designation: application.designation,
            employeeId: employeeId,
            joiningDate: new Date(),
            employmentStatus: "ACTIVE",
          },
        }),
      ]);

      return { success: true, teacherId: newTeacher.id };
    }),
});
