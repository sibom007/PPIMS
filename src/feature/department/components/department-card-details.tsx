import React from "react";
import {
  Calendar,
  Layers,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Users,
  BookOpen,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { formattedDate } from "@/lib/utils";
import { DepartmentWithCounts } from "../types";

interface DetailsProps {
  department: DepartmentWithCounts | null;
  isOpen: boolean;
  onClose: () => void;
  
}

export const DepartmentCardDetails: React.FC<DetailsProps> = ({
  department,
  isOpen,
  onClose,
}) => {
  if (!department) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92%] max-w-md max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-lg p-0 gap-0">
        <div className="relative h-48 w-full bg-muted">
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
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs font-bold uppercase tracking-widest bg-primary px-2 py-0.5 rounded">
              {department.code}
            </span>
            <h2 className="text-xl font-bold mt-1.5 leading-tight">
              {department.name}
            </h2>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" /> Dept ID: {department.id}
            </span>
            <Badge
              variant={department.isActive ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {department.isActive ? (
                <>
                  <ShieldCheck className="h-3 w-3" /> Operating
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3 w-3" /> Suspended
                </>
              )}
            </Badge>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              About
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {department.description}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Metrics Summary
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-md">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium">
                    Total Enrolled Students
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {department._count.students}
                </span>
              </div>
              <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-md">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Faculty Members</span>
                </div>
                <span className="text-sm font-bold">
                  {department._count.teachers}
                </span>
              </div>
              <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-md">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">
                    Curriculum Subjects
                  </span>
                </div>
                <span className="text-sm font-bold">
                  {department._count.subjects}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Created:{" "}
              {formattedDate(department.createdAt)}
            </span>
            <span>Updated: {formattedDate(department.updatedAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
