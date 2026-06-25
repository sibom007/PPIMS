import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import SuperJSON from "superjson";

export const createTRPCContext = cache(async () => {
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!sessionData) {
    return {
      user: null,
    };
  }

  return {
    user: {
      ...sessionData.user,
      role: sessionData.user.role,
    },
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action.",
    });
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const studentProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "STUDENT") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Access denied. Student role required.",
    });
  }

  return next();
});

export const teacherProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "TEACHER") throw new TRPCError({ code: "FORBIDDEN" });
  return next();
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "ADMIN" && ctx.user.role !== "SUPER_ADMIN") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next();
});
