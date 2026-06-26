"use client";

import React, { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Eye,
  CheckCircle,
  XCircle,
  Building2,
  Phone,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TTeacherApplicationsOutput } from "../types";

type RowProps = {
  application: TTeacherApplicationsOutput;
};

export const ApplicationRowActions = ({ application }: RowProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Dialog & Form States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  // Review Application Mutation Handler
  const { mutate: reviewApplication, isPending } = useMutation(
    trpc.teacher.reviewApplication.mutationOptions({
      onSuccess: (_, variables) => {
        toast.success(
          `Application ${variables.status.toLowerCase()} successfully!`,
        );

        // Reset states
        queryClient.invalidateQueries(
          trpc.teacher.getTeacherApplications.queryFilter(),
        );
        setIsRejectOpen(false);
        setRejectNotes("");
      },
      onError: (err) => {
        toast.error(
          err.message || "An unexpected error occurred during submission.",
        );
      },
    }),
  );

  const handleApprove = () => {
    reviewApplication({
      id: application.id,
      status: "APPROVED",
      adminNotes: "okay",
    });
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectNotes.trim()) {
      toast.error(
        "Please add a note explaining why this application was rejected.",
      );
      return;
    }
    reviewApplication({
      id: application.id,
      status: "REJECTED",
      adminNotes: rejectNotes,
    });
  };

  // Safe string formatting for cleaner rendering markup
  const formattedDesignation = application.designation
    ? String(application.designation).replace(/_/g, " ")
    : "Not Specified";

  return (
    <div className="flex items-center justify-end gap-2">
      {/* View Trigger */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsViewOpen(true)}
        icon={<Eye className="h-3.5 w-3.5" />}
      >
        View
      </Button>

      {/* Conditional Action Triggers */}
      {application.status === "PENDING" && (
        <>
          <Button
            size="sm"
            disabled={isPending}
            onClick={handleApprove}
            icon={<CheckCircle className="h-3.5 w-3.5" />}
          >
            Approve
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={() => setIsRejectOpen(true)}
            icon={<XCircle className="h-3.5 w-3.5" />}
          >
            Reject
          </Button>
        </>
      )}

      {/* ========================================================= */}
      {/* 🔍 DIALOG MODAL: APPLICATION DEEP-DIVE INFORMATION       */}
      {/* ========================================================= */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="min-w-xl  sm:rounded-xl shadow-lg border-muted/60">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Application Deep-Dive
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Submitted profile parameters by{" "}
              <span className="font-semibold text-foreground">
                {application.user?.name || "Applicant"}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-3">
            {/* Target Department Block */}
            <div className="rounded-xl border border-muted bg-muted/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Building2 className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Target Department
                </h4>
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {application.department?.name}
                </p>
                {application.department?.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {application.department.description}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Field Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary mt-0.5">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {application.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary mt-0.5">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Highest Qualification
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {application.qualification}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary mt-0.5">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Specialization
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {application.specialization || "None Declared"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary mt-0.5">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Target Designation
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    {formattedDesignation}
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Application Notes Section */}
            {application.adminNotes && (
              <div className="rounded-xl border border-muted bg-muted/40 p-4 flex gap-3">
                <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Historical Audit Note
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {application.adminNotes}
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsViewOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* 📝 DIALOG MODAL: REJECTION INTERCEPT REASON NOTES FORM   */}
      {/* ========================================================= */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:rounded-xl shadow-lg border-muted/60">
          <form onSubmit={handleRejectSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-destructive">
                Reject Application
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Provide transparent feedback explaining the rationale for
                declining this request.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-2">
              <label
                htmlFor="notes"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground block"
              >
                Reasoning Notes <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="notes"
                placeholder="e.g., Minimum requirements not met for the requested academic tier level..."
                className="min-h-27.5  resize-none"
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                disabled={isPending}
                required
              />
            </div>

            <DialogFooter className="gap-2 ">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRejectOpen(false);
                  setRejectNotes("");
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
