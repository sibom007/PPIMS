import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";

type GetDepartmentsOutput = inferProcedureOutput<
  AppRouter["department"]["getForSelect"]
>;
type GetApplicationOutput = inferProcedureOutput<
  AppRouter["teacher"]["getApplication"]
>;
type GetTeacherApplicationsOutput = inferProcedureOutput<
  AppRouter["teacher"]["getTeacherApplications"]
>;
export type DepartmentForSelect = GetDepartmentsOutput;
export type ApplicationProps = NonNullable<GetApplicationOutput>;
export type TTeacherApplicationsOutput = GetTeacherApplicationsOutput[number];
