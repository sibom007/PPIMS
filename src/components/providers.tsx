"use client";
import React from "react";
import { ThemeProvider } from "./theme-provider";
import { TRPCReactProvider } from "@/trpc/client";
import { TooltipProvider } from "./ui/tooltip";
import { Toaster } from "./ui/sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TRPCReactProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </TRPCReactProvider>
    </ThemeProvider>
  );
};
