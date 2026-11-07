"use client";
import { useUserContext } from "@/context/UserProvider";
import {
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Users,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { user } = useUserContext();

  const adminName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Administrator";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Hi, {adminName} 👋
        </h2>
        <p className="text-muted-foreground text-sm">
          Welcome to the School Administration Control Panel.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Total Students
            </h3>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-blue-600">450</p>
          <p className="text-xs text-muted-foreground mt-1">
            Enrolled across all grades
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Total Teachers
            </h3>
            <GraduationCap className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-purple-600">32</p>
          <p className="text-xs text-muted-foreground mt-1">
            Full-time faculty
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Classes & Sections
            </h3>
            <Layers className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-emerald-600">18</p>
          <p className="text-xs text-muted-foreground mt-1">
            Active class sections
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Courses
            </h3>
            <BookOpen className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold mt-2 text-amber-600">24</p>
          <p className="text-xs text-muted-foreground mt-1">
            Curriculum subjects
          </p>
        </div>
      </div>

      {/* Quick Administrative Links */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">
          Quick Administrative Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link
              href="/admin/manage-parents"
              className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>User Directory</span>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/student/dashboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Preview Student View</span>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/teacher/dashboard" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span>Preview Teacher View</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
