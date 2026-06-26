import { z } from "zod";
import { RequestStatus, Gender } from "@/generated/prisma/enums";

export const CreateStudentApplicationSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  gender: z.nativeEnum(Gender),
  roll: z.string().min(1, "Roll number is required"),
  registration: z.string().min(1, "Registration number is required"),
  departmentId: z.string().min(1, "Department is required"),
});

export const UpdateStudentApplicationStatusSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(RequestStatus),
  adminNotes: z.string().optional(),
});

export type CreateStudentApplicationInput = z.infer<
  typeof CreateStudentApplicationSchema
>;
export type UpdateStudentApplicationStatusInput = z.infer<
  typeof UpdateStudentApplicationStatusSchema
>;
