"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Calendar, Users } from "lucide-react";
import { ApplicationRowActions } from "@/feature/teacher-application/components/application-row-actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { RequestStatus } from "@/generated/prisma/enums";

export const AdminReviewList = () => {
  const trpc = useTRPC();
  const [status, setStatus] = useState<RequestStatus>("PENDING");

  const { data: applications } = useSuspenseQuery(
    trpc.teacher.getTeacherApplications.queryOptions({ status }),
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10",
      APPROVED:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10",
      REJECTED:
        "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10",
    };
    return styles[status.toUpperCase()] || "bg-muted text-muted-foreground";
  };
  return (
    <Card className="border-muted/60 shadow-sm ">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted/40 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Manage Teacher Application
            </CardTitle>
          </div>
          <CardDescription>
            Review incoming teacher applications, check qualifications, and
            update permissions.
          </CardDescription>
        </div>
        <div className="w-45 space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Filter Status
          </label>

          <Select
            value={status}
            onValueChange={(value) => setStatus(value as RequestStatus)}
          >
            <SelectTrigger className="w-full bg-background border-muted/60 shadow-sm capitalize">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>

            <SelectContent className="border-muted/60 shadow-md">
              <SelectItem
                value="PENDING"
                className="focus:bg-amber-500/10 focus:text-amber-600 dark:focus:text-amber-400"
              >
                Pending
              </SelectItem>
              <SelectItem
                value="APPROVED"
                className="focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400"
              >
                Approved
              </SelectItem>
              <SelectItem
                value="REJECTED"
                className="focus:bg-destructive/10 focus:text-destructive"
              >
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="rounded-xl border border-muted/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Applicant</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Applied Date</TableHead>
                <TableHead className="text-right font-semibold pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-32 text-center text-muted-foreground italic"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                applications?.map((app) => (
                  <TableRow
                    key={app.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground ">
                          {app.user.name || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {app.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {app.department.name}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${getStatusBadge(app.status)}`}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(app.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <ApplicationRowActions application={app} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
