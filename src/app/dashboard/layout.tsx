import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/feature/dashboard/components/app-sidebar";
import { DashboardHeader } from "@/feature/dashboard/components/dashboardHeader";
function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default layout;
