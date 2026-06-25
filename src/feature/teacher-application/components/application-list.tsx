"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { TeacherApplicationForm } from "./teacher-application-form";
import { TeacherApplicationCard } from "./teacher-application-card";

export const ApplicationList = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.teacher.getApplication.queryOptions());
  const { data: department } = useSuspenseQuery(
    trpc.department.getForSelect.queryOptions(),
  );

  if (data === null) {
    return <TeacherApplicationForm department={department} />;
  }

  return <TeacherApplicationCard application={data} />;
};
