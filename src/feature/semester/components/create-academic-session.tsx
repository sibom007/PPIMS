"use client";
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
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CreateAcademicSessionInput,
  CreateAcademicSessionSchema,
} from "@/trpc/types/academic-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcademicSessionType } from "@/generated/prisma/enums";
import { MultiSelect } from "@/components/multi-select";
import { TSemesters } from "../types";

interface CreateAcademicSessionProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  semesters: TSemesters;
}

export function CreateAcademicSession({
  open,
  setOpen,
  semesters,
}: CreateAcademicSessionProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const CreateAcademicSession = useMutation(
    trpc.academic.createAcademicSession.mutationOptions({
      onSuccess: () => {
        toast.success("Academic Session created successfully");
        reset();
        setOpen(false);
        queryClient.invalidateQueries(
          trpc.academic.getAcademicSessions.queryFilter(),
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
  } = useForm<CreateAcademicSessionInput>({
    resolver: zodResolver(CreateAcademicSessionSchema),
    defaultValues: {
      name: "",
      description: "",
      year: 2001,
      type: "JAN_JUN",
      startDate: undefined,
      endDate: undefined,
      semesterIds: [],
    },
  });

  const mappedSemesterOptions = semesters.map((semester) => ({
    label: semester.name,
    value: semester.id,
  }));

  const onSubmit = async (values: CreateAcademicSessionInput) => {
    CreateAcademicSession.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Academic Session</DialogTitle>
          <DialogDescription>
            Add a new academic session. Click save when you are finished.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("Validation Errors:", errors);
          })}
          className="space-y-4 py-2"
        >
          {/* Name Field */}
          <Field>
            <FieldLabel>Session Name</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="e.g., Fall 2026"
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

          {/* Description Field */}
          <Field>
            <FieldLabel>Description (Optional)</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="Brief description of the session"
                    aria-invalid={!!errors.description}
                  />
                )}
              />
            </FieldContent>
            <FieldError>
              {errors.description && (
                <p className="text-xs font-medium text-destructive">
                  {errors.description.message}
                </p>
              )}
            </FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            {/* Year Field */}
            <Field>
              <FieldLabel>Year</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="year"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      placeholder="e.g., 2026"
                      aria-invalid={!!errors.year}
                    />
                  )}
                />
              </FieldContent>
              <FieldError>
                {errors.year && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.year.message}
                  </p>
                )}
              </FieldError>
            </Field>

            {/* Session Type Field */}
            <Field>
              <FieldLabel>Session Type</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(AcademicSessionType).map((item) => (
                          <SelectItem key={item} value={item}>
                            {item.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldContent>
              <FieldError>
                {errors.type && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.type.message}
                  </p>
                )}
              </FieldError>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date Field */}
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      aria-invalid={!!errors.startDate}
                    />
                  )}
                />
              </FieldContent>
              <FieldError>
                {errors.startDate && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.startDate.message}
                  </p>
                )}
              </FieldError>
            </Field>

            {/* End Date Field */}
            <Field>
              <FieldLabel>End Date</FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <Input
                      type="date"
                      value={
                        field.value
                          ? new Date(field.value).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined,
                        )
                      }
                      aria-invalid={!!errors.endDate}
                    />
                  )}
                />
              </FieldContent>
              <FieldError>
                {errors.endDate && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.endDate.message}
                  </p>
                )}
              </FieldError>
            </Field>
          </div>

          {/* Semesters MultiSelect Field */}
          <Field>
            <FieldLabel>Semesters</FieldLabel>
            <FieldContent>
              <Controller
                control={control}
                name="semesterIds"
                render={({ field }) => (
                  <MultiSelect
                    options={mappedSemesterOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Choose semesters..."
                  />
                )}
              />
            </FieldContent>
            <FieldError>
              {/* Fixed: Checking errors.semesterIds instead of errors.type */}
              {errors.semesterIds && (
                <p className="text-xs font-medium text-destructive">
                  {errors.semesterIds.message}
                </p>
              )}
            </FieldError>
          </Field>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting || CreateAcademicSession.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || CreateAcademicSession.isPending}
              disabled={isSubmitting || CreateAcademicSession.isPending}
            >
              {isSubmitting || CreateAcademicSession.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
