"use client";

import { useUserContext } from "@/context/UserProvider";
import { BookOpen, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function StudentDashboard() {
  const { user } = useUserContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, {user?.name ?? "Student"} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome back to your school management overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Enrolled Courses
            </h3>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold mt-2">6</p>
          <p className="text-xs text-muted-foreground mt-1">Current Semester</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Attendance Rate
            </h3>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-emerald-600">96%</p>
          <p className="text-xs text-muted-foreground mt-1">
            Above requirement
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Pending Tasks
            </h3>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-amber-600">3</p>
          <p className="text-xs text-muted-foreground mt-1">Due this week</p>
        </div>
      </div>

      {/* Quick Schedule / Courses */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Upcoming Classes Today</span>
        </h3>
        <div className="divide-y divide-border">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Mathematics 101</p>
              <p className="text-xs text-muted-foreground">
                Room 204 • Prof. Davis
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-muted">
              09:00 - 10:30 AM
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Physics Lab</p>
              <p className="text-xs text-muted-foreground">
                Science Hall B • Prof. Adams
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-muted">
              11:00 - 12:30 PM
            </span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">Computer Science</p>
              <p className="text-xs text-muted-foreground">
                Lab 3 • Prof. Clark
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-muted">
              02:00 - 03:30 PM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
