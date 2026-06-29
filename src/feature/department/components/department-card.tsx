import React, { useState } from "react";
import { EyeIcon, Layers, PencilIcon, Trash2Icon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { DepartmentWithCounts } from "../types";
import { DeleteConfirmation } from "@/components/delete-confirmation";
import { EditDepartment } from "./edit-department";
import { currentUser } from "@/lib/auth";

interface CardProps {
  department: DepartmentWithCounts;
  onViewDetails: (dept: DepartmentWithCounts) => void;
  onDelete: (id: string) => void;
  CurrentUser: currentUser;
}

export const DepartmentCard: React.FC<CardProps> = ({
  department,
  onViewDetails,
  onDelete,
  CurrentUser,
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <Card className="overflow-hidden p-0 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-md border-muted-foreground/10">
      <div>
        {/* Department Image */}
        <div className="relative h-44 w-full bg-muted">
          <Image
            src={
              department.image ??
              "https://plus.unsplash.com/premium_vector-1697729522191-31808e6ba437?q=80&w=1126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={department.name}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
          <Badge
            variant={department.isActive ? "default" : "secondary"}
            className="absolute top-3 right-3 text-xs font-medium"
          >
            {department.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Header content */}
        <CardHeader className="space-y-1 p-4 pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            <Layers className="h-3.5 w-3.5 text-primary" />
            {department.code}
          </div>
          <CardTitle className="text-xl font-bold line-clamp-1">
            {department.name}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2 mt-1">
            {department.description || "No description provided."}
          </CardDescription>
        </CardHeader>
      </div>

      <CardFooter className="flex items-center gap-2 pt-2 mb-2">
        {/* View Button - Main Action */}
        <Button
          size="sm"
          className="flex-1 gap-1.5 "
          onClick={() => onViewDetails(department)}
          icon={<EyeIcon className="h-4 w-4" />}
        >
          <span className="">View</span>
        </Button>
        {(CurrentUser?.role === "ADMIN" ||
          CurrentUser?.role === "SUPER_ADMIN") && (
          <>
            <Button
              variant="secondary"
              onClick={() => setIsEditOpen(true)}
              title="Edit Department"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => setIsDeleteOpen(true)}
              title="Delete Department"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </>
        )}
      </CardFooter>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => onDelete(department.id)}
        title={`Delete ${department.name}?`}
        description={`Are you sure you want to delete the ${department.code} department? This will sever all ties to connected courses and registration rolls.`}
      />

      <EditDepartment
        open={isEditOpen}
        setOpen={setIsEditOpen}
        department={department}
      />
    </Card>
  );
};
