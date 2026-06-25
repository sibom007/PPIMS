import { Role } from "@/generated/prisma/enums";

import {
  SquareTerminal,
  Bot,
  BookOpen,
  Settings2,
  LifeBuoy,
  Send,
  Building2,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  roles?: Role[];
  items?: {
    title: string;
    url: string;
    roles?: Role[];
  }[];
}

interface SidebarConfig {
  main: NavItem[];
  suggestion: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
}

export const sidebarData: SidebarConfig = {
  main: [
    {
      title: "Academic",
      url: "#",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Departments",
          url: "/dashboard/departments",
        },
        {
          title: "Teacher-applations",
          url: "/dashboard/teacher-application",
          roles: ["USER"],
        },
      ],
    },
    {
      title: "Admins",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "Manage-teachers", url: "/dashboard/admin/manage-teachers" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      roles: ["TEACHER", "ADMIN", "SUPER_ADMIN"], // Students won't see this whole group
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      roles: ["ADMIN", "SUPER_ADMIN"],
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#", roles: ["SUPER_ADMIN"] }, // Nesting role safety
      ],
    },
  ],
  suggestion: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
};
