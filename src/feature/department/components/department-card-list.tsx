"use client";
import React, { useState } from "react";
import { DepartmentCard } from "./department-card";
import { DepartmentCardDetails } from "./department-card-details";
import { DepartmentHeader } from "./department-header";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Empty } from "@/components/empty";
import { DepartmentWithCounts } from "../types";

export const DepartmentCardList: React.FC = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery(trpc.department.getAll.queryOptions());
  const deleteDepartment = useMutation(
    trpc.department.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.department.getAll.queryFilter());
      },
    }),
  );

  const [selectedDept, setSelectedDept] = useState<DepartmentWithCounts | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleOpenDetails = (dept: DepartmentWithCounts) => {
    setSelectedDept(dept);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    // Let animation finish before resetting state data
    setTimeout(() => setSelectedDept(null), 150);
  };

  const handleDeleteSubmit = async (id: string) => {
    deleteDepartment.mutate({ id });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4  sm:py-2 ">
      {/* Top Section: Header Info on Left, Action Button on Right */}
      <DepartmentHeader />
      <Separator />

      {!data.length && <Empty />}
      {/* Grid Container - 1 Column default (mobile first) -> changes to 2 and 3 on larger widths */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-4">
        {data.map((dept) => (
          <DepartmentCard
            key={dept.id}
            department={dept}
            onViewDetails={handleOpenDetails}
            onDelete={handleDeleteSubmit}
          />
        ))}
      </div>

      {/* Modal Dialog for detailed structural metadata */}
      <DepartmentCardDetails
        department={selectedDept}
        isOpen={isDetailOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
};
