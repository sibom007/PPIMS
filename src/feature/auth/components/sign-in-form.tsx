"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SignInFormValues, signInSchema } from "../types";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const res = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (res.data?.user.id) {
        toast.success("user login successfull");
        reset();
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--color-primary),transparent_40%)]/[15]" />

      <div className="container mx-auto min-h-screen px-4 py-8">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
          <div className="grid w-full overflow-hidden rounded-3xl border bg-background/80 backdrop-blur-xl lg:grid-cols-2">
            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden items-center justify-center bg-muted/40 p-10 lg:flex"
            >
              <Image
                src="/sign-in.svg"
                alt="Sign Up Illustration"
                width={600}
                height={600}
                className="h-auto w-full max-w-lg"
                priority
              />
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-center p-5 sm:p-8 md:p-10"
            >
              <div className="w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8 space-y-2"
                >
                  <div className="inline-flex rounded-full border px-3 py-1 text-xs font-medium">
                    Login Account
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight">
                    start the platform
                  </h1>

                  
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Email</FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            type="email"
                            placeholder="john@example.com"
                            
                          />
                        </FieldContent>
                        <FieldError>{errors.email?.message}</FieldError>
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel>Password</FieldLabel>
                        <FieldContent>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            
                          />
                        </FieldContent>
                        <FieldError>{errors.password?.message}</FieldError>
                      </Field>
                    )}
                  />

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  do not have an account?{" "}
                  <Link href={"/sign-up"}>
                  <span className="cursor-pointer font-medium text-foreground hover:underline">
                    Sign-up
                  </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
