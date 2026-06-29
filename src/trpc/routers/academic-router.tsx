import { db } from "@/lib/prisma";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../init";
import {
  CreateAcademicSessionSchema,
  UpdateAcademicSessionSchema,
  UpdateAcademicSessionStatusSchema,
} from "../types/academic-types";
import z from "zod";

export const academicRouter = createTRPCRouter({
  createAcademicSession: adminProcedure
    .input(CreateAcademicSessionSchema)
    .mutation(async ({ input }) => {
      return db.academicSession.create({
        data: {
          name: input.name,
          year: input.year,
          type: input.type,
          startDate: input.startDate,
          endDate: input.endDate,
          description: input.description,

          semesters: {
            create: input.semesterIds.map((semesterId) => ({
              semesterId,
            })),
          },
        },
        include: {
          semesters: {
            include: {
              semester: true,
            },
          },
        },
      });
    }),

  getAcademicSessions: protectedProcedure.query(async () => {
    return db.academicSession.findMany({
      orderBy: {
        year: "desc",
      },
      include: {
        semesters: {
          include: {
            semester: true,
          },
        },
      },
    });
  }),

  getAcademicSession: protectedProcedure
    .input(z.string().cuid())
    .query(async ({ input }) => {
      return db.academicSession.findUnique({
        where: {
          id: input,
        },
        include: {
          semesters: {
            include: {
              semester: true,
            },
          },
        },
      });
    }),

  updateAcademicSession: adminProcedure
    .input(UpdateAcademicSessionSchema)
    .mutation(async ({ input }) => {
      const { id, semesterIds, ...data } = input;

      return db.$transaction(async (tx) => {
        await tx.academicSessionSemester.deleteMany({
          where: {
            academicSessionId: id,
          },
        });

        return tx.academicSession.update({
          where: {
            id,
          },
          data: {
            ...data,

            semesters: {
              create: semesterIds.map((semesterId) => ({
                semesterId,
              })),
            },
          },
          include: {
            semesters: {
              include: {
                semester: true,
              },
            },
          },
        });
      });
    }),

  updateAcademicSessionStatus: adminProcedure
    .input(UpdateAcademicSessionStatusSchema)
    .mutation(async ({ input }) => {
      return db.academicSession.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),

  deleteAcademicSession: adminProcedure
    .input(z.string().cuid())
    .mutation(async ({ input }) => {
      await db.academicSession.delete({
        where: {
          id: input,
        },
      });

      return {
        success: true,
      };
    }),
});
