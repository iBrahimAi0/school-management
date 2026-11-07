"use client";

import { useUserContext } from "@/context/UserProvider";
import { BookOpen, Calendar, CheckCircle2, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const { user } = useUserContext();

  const studentName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Student";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hi, {studentName} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome back to your student dashboard and learning portal.
        </p>
      </div>

      {/* Stats Cards with Shadcn Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground mt-1">Current Academic Term</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Rate
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">96%</div>
            <p className="text-xs text-muted-foreground mt-1">Above requirement</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Assessments
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">3</div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Class Schedule Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Today's Class Schedule</span>
          </CardTitle>
          <CardDescription>
            Your scheduled lectures and classes for today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Mathematics 101</p>
                <p className="text-xs text-muted-foreground">Room 204 &bull; Prof. Davis</p>
              </div>
              <Badge variant="secondary">09:00 - 10:30 AM</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Physics Lab</p>
                <p className="text-xs text-muted-foreground">Science Hall B &bull; Prof. Adams</p>
              </div>
              <Badge variant="secondary">11:00 - 12:30 PM</Badge>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Computer Science</p>
                <p className="text-xs text-muted-foreground">Lab 3 &bull; Prof. Clark</p>
              </div>
              <Badge variant="secondary">02:00 - 03:30 PM</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
