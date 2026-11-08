"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  BookOpen,
  Users,
  CalendarCheck2,
  GraduationCap,
  Presentation,
  ArrowRight,
  ArrowDownIcon,
  ArrowUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { useUserContext } from "@/context/UserProvider";
import ClasseApi from "@/api/Classe/ClasseApi";
import CourseApi from "@/api/Course/CourseApi";
import { StudentApi } from "@/api/Student/StudentApi";
import ExamApi from "@/api/Exam/ExamApi";
import { TeacherClassesType } from "@/types/TeacherTypes/TeacherClassesType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function TeacherDashboard() {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    classes: 0,
    courses: 0,
    students: 0,
    exams: 0,
  });
  const [classesList, setClassesList] = useState<TeacherClassesType[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [classesRes, coursesRes, studentsRes, examsRes] =
          await Promise.all([
            ClasseApi.getTeacherClasses(user.id),
            CourseApi.getTeacherCourses(user.id),
            StudentApi.getTeacherStudents(user.id),
            ExamApi.getTeacherExams(user.id),
          ]);

        const classes = classesRes.data?.teacherClasses ?? [];
        const courses = coursesRes.data?.teacherCourses ?? [];
        const students = studentsRes.data?.teacherStudents ?? [];
        const exams = examsRes.data?.teacherExams ?? [];

        setStats({
          classes: classes.length,
          courses: courses.length,
          students: students.length,
          exams: exams.length,
        });
        setClassesList(classes);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const columnHelper = createColumnHelper<
    DataTableFeatures,
    TeacherClassesType
  >();

  const columns = columnHelper.columns([
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          #ID
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.id}</span>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Class Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">{row.original.name}</span>
      ),
    }),
    columnHelper.accessor("code", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Class Code
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.code}
        </Badge>
      ),
    }),
    columnHelper.accessor(
      (row) => row.class_type?.name ?? "Standard Academic",
      {
        id: "class_type",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Academic Level
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground text-sm">
            {row.original.class_type?.name ?? "Standard Academic"}
          </span>
        ),
      },
    ),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const cls = row.original;
        return (
          <div className="flex items-center justify-end">
            <Button asChild variant="outline" size="sm" className="h-8">
              <Link
                href={`/teacher/classes/students?classeId=${cls.id}&classeName=${encodeURIComponent(
                  cls.name,
                )}`}>
                View Students
              </Link>
            </Button>
          </div>
        );
      },
    }),
  ]);

  const teacherName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Teacher";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hi, {teacherName}</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to your Teacher Portal. Here is an overview of your
          academic activities.
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.classes}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active class sections
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Teaching Courses
            </CardTitle>
            <Presentation className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.courses}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Assigned subjects
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.students}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Exams
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : stats.exams}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Course assessments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          asChild
          variant="outline"
          className="h-auto p-4 justify-between bg-card hover:bg-muted/50">
          <Link href="/teacher/classes">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">My Classes</div>
                <div className="text-xs text-muted-foreground">
                  View rosters
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-4 justify-between bg-card hover:bg-muted/50">
          <Link href="/teacher/courses">
            <div className="flex items-center gap-3">
              <Presentation className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">My Courses</div>
                <div className="text-xs text-muted-foreground">
                  Course materials
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-4 justify-between bg-card hover:bg-muted/50">
          <Link href="/teacher/attendance">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Attendance</div>
                <div className="text-xs text-muted-foreground">
                  Record attendance
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>

        <Button
          asChild
          variant="outline"
          className="h-auto p-4 justify-between bg-card hover:bg-muted/50">
          <Link href="/teacher/grades">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Exams & Grades</div>
                <div className="text-xs text-muted-foreground">
                  Grade students
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>

      {/* Assigned Classes Overview with DataTable */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Assigned Classes Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Complete list of classrooms assigned to your account.
          </p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <SpinnerSize />
          </div>
        ) : classesList.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No classes currently assigned</CardTitle>
              <CardDescription>
                You have not been assigned to any classrooms for this academic
                year yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <DataTable columns={columns} data={classesList} />
        )}
      </div>
    </div>
  );
}
