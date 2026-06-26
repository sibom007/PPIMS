import z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  teacherProcedure,
} from "../init";
import {
  CreateStudentApplicationSchema,
  UpdateStudentApplicationStatusSchema,
} from "../types/student-types";
import { db } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import { RequestStatus } from "@/generated/prisma/enums";

export const studentRouter = createTRPCRouter({
  getStudentApplications: teacherProcedure
    .input(
      z.object({
        status: z.nativeEnum(RequestStatus).optional(),
      }),
    )
    .query(async ({ input }) => {
      return await db.studentApplication.findMany({
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
    const application = await db.studentApplication.findUnique({
      where: {
        userId: ctx.user.id,
      },
      include: {
        department: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    return application;
  }),

  applyForStudent: protectedProcedure
    .input(CreateStudentApplicationSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user already applied for a student profile
      const existingApplication = await db.studentApplication.findUnique({
        where: { userId: ctx.user.id },
      });

      if (existingApplication) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already submitted a student application.",
        });
      }

      // Create student application linked to logged in user
      return await db.studentApplication.create({
        data: {
          userId: ctx.user.id,
          ...input,
        },
      });
    }),

  reviewApplication: teacherProcedure
    .input(UpdateStudentApplicationStatusSchema)
    .mutation(async ({ input }) => {
      // Find the target student application first
      const application = await db.studentApplication.findUnique({
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
        return await db.studentApplication.update({
          where: { id: input.id },
          data: {
            status: "REJECTED",
            adminNotes: input.adminNotes,
          },
        });
      }

      // Handle Approval - Verify student profile doesn't exist yet
      const existingStudent = await db.student.findUnique({
        where: { userId: application.userId },
      });

      if (existingStudent) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "This applicant already has an active Student profile in the system.",
        });
      }

      // Execute all atomic database writes together safely inside a transaction
      const [updatedApp, updatedUser, createdStudent] = await db.$transaction([
        db.studentApplication.update({
          where: { id: input.id },
          data: {
            status: "APPROVED",
            adminNotes: input.adminNotes,
          },
        }),

        db.user.update({
          where: { id: application.userId },
          data: { role: "STUDENT" },
        }),

        db.student.create({
          data: {
            userId: application.userId,
            departmentId: application.departmentId,
            roll: application.roll,
            registration: application.registration,
            phone: application.phone,
            gender: application.gender,
          },
        }),
      ]);

      return {
        success: true,
        studentId: createdStudent.id,
      };
    }),

  retryApplication: protectedProcedure.mutation(async ({ ctx }) => {
    // 1. Fetch the user's existing application
    const existingApplication = await db.studentApplication.findUnique({
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
    await db.studentApplication.delete({
      where: { userId: ctx.user.id },
    });

    return {
      success: true,
      message: "Application cleared successfully. You may now apply again.",
    };
  }),
});
