"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { TRPCReactProvider } from "@/trpc/client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </ThemeProvider>
  );
};
