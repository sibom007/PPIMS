import { createTRPCRouter } from "../init";
import { departmentRouter } from "./department-router";
import { teacherRouter } from "./teacher-router";

export const appRouter = createTRPCRouter({
  teacher: teacherRouter,
  department: departmentRouter,
});

export type AppRouter = typeof appRouter;
