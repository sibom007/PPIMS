import { db } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import {
  adminProcedure,
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "../init";
import {
  deleteDepartmentSchema,
  departmentSchema,
  departmentSchemaById,
  updateDepartmentSchema,
} from "../types/department-types";

export const departmentRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    return await db.department.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { students: true, teachers: true, subjects: true },
        },
      },
    });
  }),
  getForSelect: protectedProcedure.query(async () => {
    return await db.department.findMany({
      where: {
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
  }),

  getById: baseProcedure
    .input(departmentSchemaById)
    .query(async ({ input }) => {
      const department = await db.department.findUnique({
        where: { id: input.id },
      });

      // Validate existence and that it hasn't been soft-deleted
      if (!department || !department.isActive) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Department not found or is currently inactive.",
        });
      }

      return department;
    }),

  create: adminProcedure.input(departmentSchema).mutation(async ({ input }) => {
    // Check for unique conflicts manually for clean error responses
    const exists = await db.department.findFirst({
      where: { OR: [{ name: input.name }, { code: input.code }] },
    });

    if (exists) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "A department with this name or code already exists.",
      });
    }

    const res= await db.department.create({
      data: input,
    });

    return { message: "Department Create successfully ", data: res, code: 201 };
  }),

  update: adminProcedure
    .input(updateDepartmentSchema)
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      const department = await db.department.findUnique({
        where: { id },
      });

      if (!department) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Department not found",
        });
      }

      return db.department.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(deleteDepartmentSchema)
    .mutation(async ({ input }) => {
      // 1. Fetch the department including counts of related items
      const department = await db.department.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              students: true,
              subjects: true,
            },
          },
        },
      });

      if (!department) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Department not found",
        });
      }

      const hasRelations =
        department._count.students > 0 || department._count.subjects > 0;

      // 2. Conditional Deletion Logic
      if (hasRelations) {
        // Soft delete since dependencies exist
        await db.department.update({
          where: { id: input.id },
          data: { isActive: false },
        });
        return {
          message:
            "Department contains active data. Soft-deleted successfully.",
        };
      } else {
        // Hard delete since it's completely empty
        await db.department.delete({
          where: { id: input.id },
        });
        return { message: "Department hard-deleted permanently." };
      }
    }),
});
