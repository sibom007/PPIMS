"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { CurrentUserType } from "@/lib/auth";
import { HeaderCap } from "@/components/header-cap";
import { CreateAcademicSession } from "./create-academic-session";
import { TSemesters } from "../types";

export const SemesterHeader = ({
  semesters,
  currentUser,
}: {
  semesters: TSemesters;
  currentUser: CurrentUserType;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 ">
      <HeaderCap
        title="Semester Lists"
        disp="Monitor allocations, current courses, and active semesters."
      />
      {/* Action Button */}

      {(currentUser?.role === "ADMIN" ||
        currentUser?.role === "SUPER_ADMIN") && (
        <Button
          icon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setModalOpen(true)}
          className="shrink-0 gap-2 self-start sm:self-auto"
        >
          Create New
        </Button>
      )}

      <CreateAcademicSession
        semesters={semesters}
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </header>
  );
};
