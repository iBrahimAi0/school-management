"use client";

import { useUserContext } from "@/context/UserProvider";
import {
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Users,
  UserRoundGroup,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboard() {
  const { user } = useUserContext();

  const adminName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Administrator";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hi, {adminName} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Welcome to the School Administration Control Panel.
        </p>
      </div>

      {/* Admin Stats Grid with Shadcn Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered across all classes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Teachers
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-1">
              Full-time faculty
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Classes & Sections
            </CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active class sections
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              Curriculum subjects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Administrative Links with Shadcn Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Quick Administrative Actions</CardTitle>
          <CardDescription>
            Frequently accessed administrative management portals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/admin/manage-teachers" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Teachers Directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/manage-students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Students Directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/manage-parents" className="flex items-center gap-2">
                <UserRoundGroup className="h-4 w-4" />
                <span>Parents Directory</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/manage-classes" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Manage Classes</span>
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/manage-courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Manage Courses</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
