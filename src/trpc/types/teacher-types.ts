import { RequestStatus, TeacherDesignation } from "@/generated/prisma/enums";
import { z } from "zod";
// Import your Prisma enums if you want exact matching,
// or define them directly in Zod as native enums:

// ==========================================
// 🆕 CREATE SCHEMA (User Submission)
// ==========================================
export const CreateApplicationSchema = z.object({
  departmentId: z
    .string("Department ID is required")
    .cuid("Invalid department ID format"),

  phone: z
    .string("Phone number is required")
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number cannot exceed 15 characters"),

  qualification: z
    .string("Qualification details are required")
    .min(3, "Qualification must be at least 3 characters long"),

  specialization: z.string().optional().nullable(),

  designation: z.nativeEnum(TeacherDesignation, {
    error: "Invalid teacher designation value",
  }),
});

// ==========================================
// 🔄 UPDATE SCHEMA (Admin Action)
// ==========================================
export const UpdateApplicationStatusSchema = z.object({
  id: z.string().cuid("Invalid application ID"),

  status: z.nativeEnum(RequestStatus, {
    error: "Status must be APPROVED or REJECTED",
  }),

  adminNotes: z
    .string()
    .min(2, "Note bast be needed")
    .max(500, "Notes cannot exceed 500 characters"),
});

// ==========================================
// ❌ DELETE SCHEMA (Id Check)
// ==========================================
export const DeleteApplicationSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid application ID"),
  }),
});

// Export TypeScript types inferred from the schemas
export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<
  typeof UpdateApplicationStatusSchema
>;
