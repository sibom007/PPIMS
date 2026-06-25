"use client";
import { Bell, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { getCustomDicebearAvatar } from "../lib";

interface SidebarBottomProps {
  user?: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  isLoading?: boolean;
}

export function SidebarBottom({ user, isLoading = false }: SidebarBottomProps) {
  const { isMobile } = useSidebar();

  // Loading skeleton layout to prevent visual shifting
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-3 p-2 w-full">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-3 w-3/4 rounded" />
              <Skeleton className="h-2 w-1/2 rounded" />
            </div>
            <Skeleton className="h-4 w-4 rounded shrink-0" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // Fallbacks for empty profiles
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "not-logged-in@example.com";
  const userRole = user?.role || "STUDENT";

  // Use user's profile picture or drop back to your custom Dicebear initials string
  const userImage = user?.image || getCustomDicebearAvatar(userName);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="rounded-lg">??</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-xs">{userName}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {userEmail}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="rounded-lg">??</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-xs">
                      {userName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 uppercase"
                    >
                      {userRole.replace("_", " ")}
                    </Badge>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={async () => await authClient.signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
