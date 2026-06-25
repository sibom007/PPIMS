"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Phone,
  GraduationCap,
  Award,
  Briefcase,
  FileText,
  Calendar,
} from "lucide-react";
import { ApplicationProps } from "../types";

type Props = {
  application: ApplicationProps;
};

export const TeacherApplicationCard = ({ application }: Props) => {
  const dateFormatted = new Date(application.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  const statusStyles: Record<string, string> = {
    PENDING:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10",
    APPROVED:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10",
    REJECTED:
      "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
  };

  const currentStatusStyle =
    statusStyles[application.status.toUpperCase()] ||
    "bg-muted text-muted-foreground";

  return (
    <Card className="max-w-7xl  border-muted/60 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted/40 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            Teacher Application
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Submitted on {dateFormatted}</span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`w-fit px-3 py-1 text-xs font-semibold tracking-wide uppercase ${currentStatusStyle}`}
        >
          {application.status}
        </Badge>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* ========================================================= */}
        {/* 🏢 NEW: ENHANCED DEPARTMENT INFO SECTION                 */}
        {/* ========================================================= */}
        <div className="rounded-xl border border-muted bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Building2 className="h-5 w-5" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Target Department
            </h4>
          </div>
          <div className="space-y-1 pl-7">
            <p className="text-base font-semibold text-foreground">
              {application.department.name}
            </p>
            {application.department.description ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                {application.department.description}
              </p>
            ) : (
              <p className="text-xs italic text-muted-foreground/70">
                No department description provided.
              </p>
            )}
          </div>
        </div>

        {/* Professional Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Phone Number
              </p>
              <p className="font-medium text-foreground">{application.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Highest Qualification
              </p>
              <p className="font-medium text-foreground">
                {application.qualification}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Specialization Area
              </p>
              <p className="font-medium text-foreground">
                {application.specialization || "General / Not Specified"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Requested Designation
              </p>
              <p className="font-semibold text-primary">
                {application.designation.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Reviewer Notes Block */}
        {application.adminNotes && (
          <div
            className={`rounded-xl border p-4 flex gap-3 ${
              application.status.toUpperCase() === "REJECTED"
                ? "bg-destructive/5 border-destructive/10"
                : "bg-muted/40 border-muted/60"
            }`}
          >
            <FileText
              className={`h-5 w-5 mt-0.5 shrink-0 ${
                application.status.toUpperCase() === "REJECTED"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            />
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Reviewer Response Notes
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {application.adminNotes}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
