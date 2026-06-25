import z from "zod";

export const departmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(40),
  code: z.string().min(2, "Code must be at least 2 characters").max(40),
});

export const departmentSchemaById = z.object({ id: z.string().cuid() });

export const updateDepartmentSchema = z.object({
  id: z.string().cuid(),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(40)
    .optional(),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(40)
    .optional(),
  description: z.string().max(100).optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const deleteDepartmentSchema = z.object({
  id: z.string().cuid(),
});
