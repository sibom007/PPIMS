"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

import { StudentApplicationCard } from "./student-application-card";
import { StudentApplicationForm } from "./student-application-form";

export const StudentApplicationList = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.student.getApplication.queryOptions());
  const { data: department } = useSuspenseQuery(
    trpc.department.getForSelect.queryOptions(),
  );

  if (data === null) {
    return <StudentApplicationForm department={department} />;
  }

  return <StudentApplicationCard application={data} />;
};
