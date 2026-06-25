"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";
import { sidebarData } from "./links";
import { authClient } from "@/lib/auth-client";
import { SidebarMain } from "./sidebar-main";
import { Role } from "@/generated/prisma/enums";
import { SidebarSecondary } from "./sidebar-secondary";
import { SidebarBottom } from "./sidebar-bottom";
import { User } from "@/generated/prisma/client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isPending } = authClient.useSession();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between border-b border-sidebar-border p-2">
        <SidebarMenu className="flex-1">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-3">
                {/* Logo Wrapper */}
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground shrink-0">
                  <Image
                    src="/logo.svg"
                    alt="PPIM Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                {/* App Meta Title */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-sidebar-foreground">
                    PPIM
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain
          items={sidebarData.main}
          userRole={data?.user.role as Role}
        />
        <SidebarSecondary items={sidebarData.suggestion} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarBottom user={data?.user as User} isLoading={isPending} />
      </SidebarFooter>
    </Sidebar>
  );
}
