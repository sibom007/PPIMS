"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateDepartment } from "./create-department";
import { useState } from "react";
import { currentUser } from "@/lib/auth";
import { HeaderCap } from "@/components/header-cap";

export const DepartmentHeader = ({
  CurrentUser,
}: {
  CurrentUser: currentUser;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 ">
      <HeaderCap
        title="Academic Departments"
        disp=" Monitor allocations, current courses, and active enrollment
        distributions."
      />
      {/* Action Button */}

      {(CurrentUser?.role === "ADMIN" || CurrentUser?.role === "SUPER_ADMIN") && (
        <Button
          icon={<PlusIcon className="h-4 w-4" />}
          onClick={() => setModalOpen(true)}
          className="shrink-0 gap-2 self-start sm:self-auto"
        >
          Create New
        </Button>
      )}

      <CreateDepartment open={modalOpen} setOpen={setModalOpen} />
    </header>
  );
};
