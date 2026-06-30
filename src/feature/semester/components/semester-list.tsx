"use client";
import { SemesterHeader } from "./semester-header";
import { Separator } from "@/components/ui/separator";
import { CurrentUserType } from "@/lib/auth";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const SemesterList = ({
  currentUser,
}: {
  currentUser: CurrentUserType;
}) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.semester.getSemesters.queryOptions());

  return (
    <>
      <SemesterHeader semesters={data} currentUser={currentUser} />
      <Separator />
      
    </>
  );
};
