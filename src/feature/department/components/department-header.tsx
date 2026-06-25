"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateDepartment } from "./create-department";
import { useState } from "react";

export const DepartmentHeader = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 ">
      <div className=" text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Academic Departments
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Monitor allocations, current courses, and active enrollment
          distributions.
        </p>
      </div>
      {/* Action Button */}
      <Button
        icon={<PlusIcon className="h-4 w-4" />}
        onClick={() => setModalOpen(true)}
        className="shrink-0 gap-2 self-start sm:self-auto"
      >
        Create New
      </Button>

      <CreateDepartment open={modalOpen} setOpen={setModalOpen} />
    </header>
  );
};
