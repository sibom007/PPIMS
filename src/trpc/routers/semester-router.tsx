import { db } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "../init";

export const semesterRouter = createTRPCRouter({
  getSemesters: protectedProcedure.query(async () => {
    return db.semester.findMany({
      orderBy: {
        number: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    });
  }),
});
