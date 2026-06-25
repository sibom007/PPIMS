import { AppRouter } from "@/trpc/routers/_app";
import {
  departmentSchema,
  updateDepartmentSchema,
} from "@/trpc/types/department-types";
import { inferProcedureOutput } from "@trpc/server";
import z from "zod";

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
export type DepartmentEditFormValues = z.infer<typeof updateDepartmentSchema>;

type GetAllDepartmentsOutput = inferProcedureOutput<
  AppRouter["department"]["getAll"]
>;
export type DepartmentWithCounts = GetAllDepartmentsOutput[number];
