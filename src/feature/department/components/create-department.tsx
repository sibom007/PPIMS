"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { DepartmentFormValues } from "../types";
import { departmentSchema } from "@/trpc/types/department-types";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateDepartmentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CreateDepartment({ open, setOpen }: CreateDepartmentProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createDepartment = useMutation(
    trpc.department.create.mutationOptions({
      onSuccess: () => {
        toast.success("department create successfully");
        reset();
        setOpen(false);

        queryClient.invalidateQueries(
          trpc.department.getAll.queryFilter(),
        );
        queryClient.invalidateQueries(trpc.department.getAll.queryFilter());
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "Electrical",
      code: "ELE",
    },
  });

  const onSubmit = async (values: DepartmentFormValues) => {
    try {
      createDepartment.mutate(values);
    } catch (error) {
      console.error("Submission layout error:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) reset();
      }}
    >
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Add a new institutional node. Click save when you are finished.
          </DialogDescription>
        </DialogHeader>

        {/* 3. Direct HTML Form Element running standard handleSubmit tracking */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Custom Form Field Element Wrapper for Name Input */}
          <Field>
            <FieldLabel>Department Name</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., Computer Science Technology"
                    aria-invalid={!!errors.name}
                  />
                )}
              />
            </FieldContent>
            <FieldError>
              {errors.name && (
                <p className="text-xs font-medium text-destructive">
                  {errors.name.message}
                </p>
              )}
            </FieldError>
          </Field>

          {/* Custom Form Field Element Wrapper for Dropdown Code Select */}
          <Field>
            <FieldLabel>Department Code</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="code"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="EC , CI"
                    aria-invalid={!!errors.name}
                  />
                )}
              />
            </FieldContent>
            <FieldError>
              {errors.code && (
                <p className="text-xs font-medium text-destructive">
                  {errors.code.message}
                </p>
              )}
            </FieldError>
          </Field>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || createDepartment.isPending}
              disabled={isSubmitting || createDepartment.isPending}
            >
              {isSubmitting || createDepartment.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
