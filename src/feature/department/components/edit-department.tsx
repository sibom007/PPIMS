"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { updateDepartmentSchema } from "@/trpc/types/department-types";
import { Department } from "@/generated/prisma/client";
import { DepartmentEditFormValues } from "../types";
import { uploadImage } from "@/lib/image-uploader";

interface EditDepartmentProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  department: Department;
}

export function EditDepartment({
  open,
  setOpen,
  department,
}: EditDepartmentProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<File | null>(null);

  const updateDepartment = useMutation(
    trpc.department.update.mutationOptions({
      onSuccess: () => {
        toast.success("Department updated successfully");
        setOpen(false);

        queryClient.invalidateQueries(trpc.department.getAll.queryFilter());
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
  } = useForm<DepartmentEditFormValues>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      id: department.id,
      name: department.name,
      code: department.code,
      description: department.description ?? "",
      isActive: department.isActive,
    },
  });

  const onSubmit = async (values: DepartmentEditFormValues) => {
    if (!department) return;

    const url = image ? await uploadImage(image) : department.image;

    updateDepartment.mutateAsync({
      ...values,
      image: url,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value && department) {
          reset({
            name: department.name,
            code: department.code,
            description: department.description ?? "",
            image: department.image ?? "",
            isActive: department.isActive,
          });
        }
      }}
    >
      <DialogContent className="sm:max-w-137.5">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>Update department information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Name */}
          <Field>
            <FieldLabel>Name</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input {...field} placeholder="Department Name" />
                )}
              />
            </FieldContent>
            <FieldError>{errors.name?.message}</FieldError>
          </Field>

          {/* Code */}
          <Field>
            <FieldLabel>Code</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="code"
                render={({ field }) => <Input {...field} placeholder="CST" />}
              />
            </FieldContent>
            <FieldError>{errors.code?.message}</FieldError>
          </Field>

          {/* Description */}
          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Department description..."
                    rows={4}
                  />
                )}
              />
            </FieldContent>
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          {/* Image */}
          <Field>
            <FieldLabel>Image URL</FieldLabel>
            <FieldContent>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                  }
                }}
              />
            </FieldContent>
            <FieldError>{errors.image?.message}</FieldError>
          </Field>

          {/* Active */}
          <Field>
            <FieldContent>
              <div className="flex justify-between items-center rounded-lg border p-4">
                <div>
                  <FieldLabel>Active Department</FieldLabel>
                  <p className="text-sm text-muted-foreground">
                    Disable to hide this department.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isActive"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </FieldContent>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isLoading={isSubmitting || updateDepartment.isPending}
              disabled={isSubmitting || updateDepartment.isPending}
            >
              {updateDepartment.isPending ? "Updating..." : "Update Department"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
