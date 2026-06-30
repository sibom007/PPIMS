import {
  AcademicSessionStatus,
  AcademicSessionType,
} from "@/generated/prisma/enums";
import z from "zod";

export const CreateAcademicSessionSchema = z.object({
  name: z.string().min(2).max(100),

  year: z.number().int().min(2000).max(2100),

  type: z.nativeEnum(AcademicSessionType),

  startDate: z.date(),

  endDate: z.date(),

  description: z.string().optional(),

  semesterIds: z
    .array(z.string().cuid())
    .min(1, "Select at least one semester"),
});

export const UpdateAcademicSessionSchema = CreateAcademicSessionSchema.extend({
  id: z.string().cuid(),
});

export const UpdateAcademicSessionStatusSchema = z.object({
  id: z.string().cuid(),

  status: z.nativeEnum(AcademicSessionStatus),
});

export type CreateAcademicSessionInput = z.infer<
  typeof CreateAcademicSessionSchema
>;
export type UpdateAcademicSessionInput = z.infer<
  typeof UpdateAcademicSessionSchema
>;
