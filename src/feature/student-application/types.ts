import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";

type GetStudentApplicationOutput = inferProcedureOutput<
  AppRouter["student"]["getApplication"]
>;
type GetStudentApplicationsOutput = inferProcedureOutput<
  AppRouter["teacher"]["getTeacherApplications"]
>;

export type TStudentApplication = NonNullable<GetStudentApplicationOutput>;
export type TStudentApplicationsOutput = GetStudentApplicationsOutput[number];
