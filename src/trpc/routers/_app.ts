import { createTRPCRouter } from "../init";
import { departmentRouter } from "./department-router";
import { studentRouter } from "./student-router";
import { teacherRouter } from "./teacher-router";

export const appRouter = createTRPCRouter({
  teacher: teacherRouter,
  student:studentRouter,
  department: departmentRouter,
});

export type AppRouter = typeof appRouter;
