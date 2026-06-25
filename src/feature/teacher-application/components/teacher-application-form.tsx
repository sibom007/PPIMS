"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import {
  CreateApplicationInput,
  CreateApplicationSchema,
} from "@/trpc/types/teacher-types";
import { TeacherDesignation } from "@/generated/prisma/enums";
import { DepartmentForSelect } from "../types";

export const TeacherApplicationForm = ({
  department,
}: {
  department: DepartmentForSelect;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createApplication = useMutation(
    trpc.teacher.applyForTeacher.mutationOptions({
      onSuccess: () => {
        toast.success("Application submitted successfully.");
        reset();
        queryClient.invalidateQueries(
          trpc.teacher.getApplication.queryFilter(),
        );
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
  } = useForm<CreateApplicationInput>({
    resolver: zodResolver(CreateApplicationSchema),
    defaultValues: {
      departmentId: "",
      phone: "",
      qualification: "",
      specialization: "",
      designation: TeacherDesignation.LECTURER,
    },
  });

  const onSubmit = (values: CreateApplicationInput) => {
    createApplication.mutate(values);
  };

  return (
    <div className="mx-auto max-w-7xl ">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Teacher Application</h2>
        <p className="text-muted-foreground">
          Fill out the form below to submit your application.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Department */}
        <Field>
          <FieldLabel>Department</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="departmentId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>

                  <SelectContent>
                    {/* Map your departments here */}

                    {department.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          <FieldError>{errors.departmentId?.message}</FieldError>
        </Field>

        {/* Phone */}
        <Field>
          <FieldLabel>Phone Number</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Input {...field} placeholder="01XXXXXXXXX" />
              )}
            />
          </FieldContent>
          <FieldError>{errors.phone?.message}</FieldError>
        </Field>

        {/* Qualification */}
        <Field>
          <FieldLabel>Qualification</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="qualification"
              render={({ field }) => (
                <Input {...field} placeholder="M.Sc in Computer Science" />
              )}
            />
          </FieldContent>
          <FieldError>{errors.qualification?.message}</FieldError>
        </Field>

        {/* Specialization */}
        <Field>
          <FieldLabel>Specialization</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="specialization"
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Artificial Intelligence"
                />
              )}
            />
          </FieldContent>
          <FieldError>{errors.specialization?.message}</FieldError>
        </Field>

        {/* Designation */}
        <Field>
          <FieldLabel>Designation</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="designation"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(TeacherDesignation).map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          <FieldError>{errors.designation?.message}</FieldError>
        </Field>

        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting || createApplication.isPending}
          disabled={isSubmitting || createApplication.isPending}
        >
          Submit Application
        </Button>
      </form>
    </div>
  );
};
