import { AppRouter } from "@/trpc/routers/_app";
import { inferProcedureOutput } from "@trpc/server";

type GetsemesterOutput = inferProcedureOutput<
  AppRouter["semester"]["getSemesters"]
>;
export type TSemesters = GetsemesterOutput;
