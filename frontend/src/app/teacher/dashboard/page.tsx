"use client";

import { useUserContext } from "@/context/UserProvider";
import { BookOpen, Users, CalendarCheck, GraduationCap } from "lucide-react";

export default function TeacherDashboard() {
  const { user } = useUserContext();

  const teacherName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Teacher";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, {teacherName} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome back to your Teacher Portal and course overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Assigned Classes
            </h3>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold mt-2">4</p>
          <p className="text-xs text-muted-foreground mt-1">
            Active this semester
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Total Students
            </h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-blue-600">128</p>
          <p className="text-xs text-muted-foreground mt-1">Across 4 classes</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Upcoming Exams
            </h3>
            <GraduationCap className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-purple-600">2</p>
          <p className="text-xs text-muted-foreground mt-1">
            Scheduled next month
          </p>
        </div>
      </div>

      {/* Class Schedule Table */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-primary" />
          <span>My Classes & Teaching Schedule</span>
        </h3>
        <div className="divide-y divide-border">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Class 10-A • Mathematics</p>
              <p className="text-xs text-muted-foreground">
                Room 101 • 32 Students
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-muted">
              Monday 08:30 - 10:00 AM
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Class 11-B • Advanced Algebra</p>
              <p className="text-xs text-muted-foreground">
                Room 205 • 28 Students
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-muted">
              Tuesday 10:30 - 12:00 PM
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Class 12-A • Calculus</p>
              <p className="text-xs text-muted-foreground">
                Room 304 • 34 Students
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-muted">
              Thursday 01:00 - 02:30 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
