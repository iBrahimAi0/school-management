"use client";

import { useUserContext } from "@/context/UserProvider";
import {
  Users,
  CalendarCheck2,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ParentDashboard() {
  const { user } = useUserContext();

  const parentName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Parent";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hi, {parentName} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome to the School Parent Portal and student progress overview.
        </p>
      </div>

      {/* Stats Cards with Shadcn Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Children
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground mt-1">Registered in institution</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Attendance
            </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">95%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent attendance standing</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Latest Grade Average
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.5 / 20</div>
            <p className="text-xs text-muted-foreground mt-1">Academic performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Academic Overview Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Child Academic Status</CardTitle>
          <CardDescription>
            Overview of current semester classes and attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Class 10-A</p>
                <p className="text-xs text-muted-foreground">Teacher: Faculty Staff</p>
              </div>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-500/10 border-emerald-500/30">
                Active &bull; Good Standing
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
