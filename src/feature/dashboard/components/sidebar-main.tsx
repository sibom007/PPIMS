"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Role } from "@/generated/prisma/enums";
import { NavItem } from "./links";

interface NavMainProps {
  items: NavItem[];
  userRole: Role | undefined;
}

export function SidebarMain({ items, userRole }: NavMainProps) {
  // Synchronous check ensures array helpers (.filter, .map) evaluate permissions immediately
  const hasAccess = (allowedRoles?: Role[]) => {
    // If there are no role requirements, anyone (even public guests) can see it
    if (!allowedRoles) return true;

    // If there are requirements but the user isn't logged in, block them completely
    if (!userRole) return false;

    // Otherwise, check if the logged-in user matches the authorized group
    return allowedRoles.includes(userRole);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // 1. Skip rendering completely if user doesn't have permission for the top item
          if (!hasAccess(item.roles)) return null;

          // 2. Filter sub-items synchronously
          const allowedSubItems =
            item.items?.filter((subItem) => hasAccess(subItem.roles)) || [];

          // Store the icon in a capitalized variable name to ensure safe JSX parsing
          const Icon = item.icon;

          return (
            <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link href={item.url}>
                    {Icon && <Icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>

                {allowedSubItems.length ? (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {allowedSubItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
