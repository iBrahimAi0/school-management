"use client";

import * as React from "react";
import {
  BookOpen,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  BookCheck,
  User,
  UserGroup,
  Users,
  BookOpenCheck,
  CalendarClock,
  School,
  IdCardLanyard,
  FingerprintPattern,
  BookPlus,
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
          title: "Assigned Classes",
          url: "/teacher/dashboard",
          icon: BookOpen,
        },
        {
          title: "Students",
          url: "/teacher/dashboard",
          icon: Users,
        },
        {
          title: "Attendance",
          url: "/teacher/dashboard",
          icon: CalendarCheck,
        },
        {
          title: "Exams & Grading",
          url: "/teacher/dashboard",
          icon: ClipboardList,
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
        /* {
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
        }, */
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
          title: "Parents",
          url: "/admin/manage-parents",
          icon: Users,
        },
        {
          title: "Students",
          url: "/admin/manage-students",
          icon: GraduationCap,
        },
        {
          title: "Teachers",
          url: "/admin/manage-teachers",
          icon: IdCardLanyard,
        },
        {
          title: "Classes",
          url: "/admin/manage-classes",
          icon: School,
        },
        {
          title: "Class Types",
          url: "/admin/manage-class-types",
          icon: UserGroup,
        },
        {
          title: "Courses",
          url: "/admin/manage-courses",
          icon: BookOpenCheck,
        },
        {
          title: "Class by Year",
          url: "/admin/manage-class-by-year ",
          icon: CalendarClock,
        },
        {
          title: "Exams",
          url: "/admin/manage-exams",
          icon: BookCheck,
        },
        {
          title: "Exam Records",
          url: "/admin/manage-exam-records",
          icon: BookPlus,
        },
        {
          title: "Attendance",
          url: "/admin/manage-attendance",
          icon: FingerprintPattern,
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
            {role[0].toUpperCase()}
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
