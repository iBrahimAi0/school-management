"use client";

import * as React from "react";
import {
  BookOpen,
  CalendarCheck,
  CalendarCheck2,
  ClipboardList,
  FileBadge,
  GraduationCap,
  LayoutDashboard,
  Presentation,
  ShieldCheck,
  User,
  UserRoundGroup,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUserContext } from "@/context/UserProvider";

export function RoleSidebar({
  role,
  ...props
}: {
  role: "student" | "teacher" | "parent" | "admin";
} & React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserContext();

  const roleConfig = {
    student: {
      portalName: "Student Portal",
      label: "Student Navigation",
      navMain: [
        {
          title: "Dashboard",
          url: "/student/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "My Profile",
          url: "/student/profile",
          icon: User,
        },
        {
          title: "My Courses",
          url: "/student/dashboard",
          icon: BookOpen,
        },
        {
          title: "Grades & Exams",
          url: "/student/dashboard",
          icon: GraduationCap,
        },
        {
          title: "Attendance",
          url: "/student/dashboard",
          icon: CalendarCheck,
        },
      ],
    },
    teacher: {
      portalName: "Teacher Portal",
      label: "Teacher Navigation",
      navMain: [
        {
          title: "Dashboard",
          url: "/teacher/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "My Classes",
          url: "/teacher/classes",
          icon: BookOpen,
        },
        {
          title: "My Courses",
          url: "/teacher/courses",
          icon: Presentation,
        },
        {
          title: "Students",
          url: "/teacher/students",
          icon: UserRoundGroup,
        },
        {
          title: "Attendance",
          url: "/teacher/attendance",
          icon: CalendarCheck2,
        },
        {
          title: "Exams & Grades",
          url: "/teacher/grades",
          icon: FileBadge,
        },
      ],
    },
    parent: {
      portalName: "Parent Portal",
      label: "Parent Navigation",
      navMain: [
        {
          title: "Dashboard",
          url: "/parent/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Assigned Classes",
          url: "/parent/dashboard",
          icon: BookOpen,
        },
        {
          title: "Students",
          url: "/parent/dashboard",
          icon: Users,
        },
        {
          title: "Attendance",
          url: "/parent/dashboard",
          icon: CalendarCheck,
        },
        {
          title: "Exams & Grading",
          url: "/parent/dashboard",
          icon: ClipboardList,
        },
      ],
    },
    admin: {
      portalName: "Admin Portal",
      label: "Administration",
      navMain: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Teachers",
          url: "/admin/manage-teachers",
          icon: GraduationCap,
        },
        {
          title: "Students",
          url: "/admin/manage-students",
          icon: Users,
        },
        {
          title: "Classes & Courses",
          url: "#",
          icon: BookOpen,
          items: [
            {
              title: "Classes",
              url: "/admin/manage-classes",
            },
            {
              title: "Class Types",
              url: "/admin/manage-class-types",
            },
            {
              title: "Courses",
              url: "/admin/manage-courses",
            },
            {
              title: "Class by Year",
              url: "/admin/manage-class-by-year",
            },
          ],
        },
        {
          title: "Exams & Records",
          url: "#",
          icon: ClipboardList,
          items: [
            {
              title: "Exams",
              url: "/admin/manage-exams",
            },
            {
              title: "Exam Records",
              url: "/admin/manage-exam-records",
            },
            {
              title: "Attendance Sessions",
              url: "/admin/manage-attendance-sessions",
            },
            {
              title: "Attendance Records",
              url: "/admin/manage-attendance-records",
            },
          ],
        },
        {
          title: "User Directory",
          url: "/admin/manage-parents",
          icon: ShieldCheck,
        },
      ],
    },
  };

  const currentConfig = roleConfig[role] || roleConfig.student;

  const displayName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    (role ? role.toUpperCase() : "User");

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="top-16 !h-[calc(100svh-4rem)]">
      <SidebarHeader className="border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-xs">
            {role ? role[0].toUpperCase() : "U"}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold">
              {currentConfig.portalName}
            </span>
            <span className="truncate text-xs text-muted-foreground capitalize">
              {role} Account
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={currentConfig.navMain} label={currentConfig.label} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: displayName,
            email: user?.email ?? "",
            avatar: user?.avatar ?? "/avatars/shadcn.jpg",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
