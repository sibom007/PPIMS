import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";

type GetDepartmentsOutput = inferProcedureOutput<
  AppRouter["department"]["getForSelect"]
>;
type GetApplicationOutput = inferProcedureOutput<
  AppRouter["teacher"]["getApplication"]
>;
export type DepartmentForSelect = GetDepartmentsOutput;
export type ApplicationProps = NonNullable<GetApplicationOutput>;
