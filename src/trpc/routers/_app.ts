import { createTRPCRouter } from "../init";
import { teacherRouter } from "./teacher-router";
import { studentRouter } from "./student-router";

import { academicRouter } from "./academic-router";
import { departmentRouter } from "./department-router";
import { semesterRouter } from "./semester-router";

export const appRouter = createTRPCRouter({
  student: studentRouter,
  teacher: teacherRouter,
  semester: semesterRouter,
  academic: academicRouter,
  department: departmentRouter,
});

export type AppRouter = typeof appRouter;
