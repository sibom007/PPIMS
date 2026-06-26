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
import { Gender } from "@/generated/prisma/enums";

import { z } from "zod";
import { DepartmentForSelect } from "@/feature/teacher-application/types";

// Component Schema Definition matching your requirements
export const CreateStudentApplicationSchema = z.object({
  phone: z.string().min(1, "Phone number is required"),
  gender: z.nativeEnum(Gender),
  roll: z.string().min(1, "Roll number is required"),
  registration: z.string().min(1, "Registration number is required"),
  departmentId: z.string().min(1, "Department is required"),
});

type CreateStudentApplicationInput = z.infer<
  typeof CreateStudentApplicationSchema
>;

export const StudentApplicationForm = ({
  department,
}: {
  department: DepartmentForSelect;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createApplication = useMutation(
    trpc.student.applyForStudent.mutationOptions({
      onSuccess: () => {
        toast.success("Student application submitted successfully.");
        reset();
        queryClient.invalidateQueries(
          trpc.student.getApplication.queryFilter(),
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
  } = useForm<CreateStudentApplicationInput>({
    resolver: zodResolver(CreateStudentApplicationSchema),
    defaultValues: {
      departmentId: "",
      phone: "",
      roll: "",
      registration: "",
      gender: Gender.MALE, // Fallback default setup based on your prisma model definitions
    },
  });

  const onSubmit = (values: CreateStudentApplicationInput) => {
    createApplication.mutate(values);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Student Application</h2>
        <p className="text-muted-foreground">
          Fill out the form below to submit your profile registration
          parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Department Selection */}
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

        {/* Roll Number Field */}
        <Field>
          <FieldLabel>Roll Number</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="roll"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your institutional roll number"
                />
              )}
            />
          </FieldContent>
          <FieldError>{errors.roll?.message}</FieldError>
        </Field>

        {/* Registration Number Field */}
        <Field>
          <FieldLabel>Registration Number</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="registration"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter registration tracking number"
                />
              )}
            />
          </FieldContent>
          <FieldError>{errors.registration?.message}</FieldError>
        </Field>

        {/* Phone Contact Field */}
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

        {/* Gender Selection Field */}
        <Field>
          <FieldLabel>Gender Identification</FieldLabel>
          <FieldContent>
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.values(Gender).map((genderOption) => (
                      <SelectItem key={genderOption} value={genderOption}>
                        <span className="capitalize">
                          {genderOption.toLowerCase()}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldContent>
          <FieldError>{errors.gender?.message}</FieldError>
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
