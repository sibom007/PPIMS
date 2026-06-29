import { db } from "@/lib/prisma";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../init";
import {
  CreateApplicationSchema,
  UpdateApplicationStatusSchema,
} from "../types/teacher-types";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { RequestStatus } from "@/generated/prisma/enums";
import { v4 as uuid } from "uuid";

export const teacherRouter = createTRPCRouter({
  getTeacherApplications: adminProcedure
    .input(
      z.object({
        status: z.nativeEnum(RequestStatus).optional(),
      }),
    )
    .query(async ({ input }) => {
      return await db.teacherApplication.findMany({
        where: {
          status: input.status,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          department: {
            select: {
              name: true,
              description: true,
            },
          },
        },
      });
    }),

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
      // Find the target application first
      const application = await db.teacherApplication.findUnique({
        where: { id: input.id },
      });

      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Application not found.",
        });
      }

      if (input.status === "REJECTED") {
        return await db.teacherApplication.update({
          where: { id: input.id },
          data: {
            status: "REJECTED",
            adminNotes: input.adminNotes,
          },
        });
      }

      const existingTeacher = await db.teacher.findUnique({
        where: { userId: application.userId },
      });

      if (existingTeacher) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "This applicant already has an active Teacher profile in the system.",
        });
      }

      const generatedEmployeeId = `EMP-${new Date().getFullYear()}-${uuid().slice(0, 8).toUpperCase()}`;

      // Execute all atomic database writes together safely
      const [updatedApp, updatedUser, createdTeacher] = await db.$transaction([
        db.teacherApplication.update({
          where: { id: input.id },
          data: {
            status: "APPROVED",
            adminNotes: input.adminNotes,
          },
        }),

        db.user.update({
          where: { id: application.userId },
          data: { role: "TEACHER" },
        }),

        db.teacher.create({
          data: {
            userId: application.userId,
            departmentId: application.departmentId,
            phone: application.phone,
            qualification: application.qualification,
            specialization: application.specialization,
            designation: application.designation,
            gender: application.gender,
            employeeId: generatedEmployeeId,
            joiningDate: new Date(),
            employmentStatus: "ACTIVE",
          },
        }),
      ]);

      return {
        success: true,
        teacherId: createdTeacher.id,
        employeeId: generatedEmployeeId,
      };
    }),

  retryApplication: protectedProcedure.mutation(async ({ ctx }) => {
    // 1. Fetch the user's existing application
    const existingApplication = await db.teacherApplication.findUnique({
      where: { userId: ctx.user.id },
    });

    // 2. If no application exists, nothing to clear
    if (!existingApplication) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No active application found to reset.",
      });
    }

    // 3. Security Guardrail: Only allow retries if it was rejected
    if (existingApplication.status !== "REJECTED") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You can only retry applications that have been rejected.",
      });
    }

    // 4. Delete the application cleanly from the database
    await db.teacherApplication.delete({
      where: { userId: ctx.user.id },
    });

    return {
      success: true,
      message: "Application cleared successfully. You may now apply again.",
    };
  }),
});
