"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  BookOpen,
  CalendarCheck2,
  GraduationCap,
  Users,
  ArrowRight,
  ArrowUpIcon,
  ArrowDownIcon,
  Award,
  CheckCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import { StudentApi } from "@/api/Student/StudentApi";
import { StudentPortalData } from "@/types/StudentTypes/StudentPortalType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function StudentDashboard() {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "grades" | "attendance" | "courses"
  >("grades");
  const [data, setData] = useState<StudentPortalData | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchPortalData = async () => {
      try {
        setLoading(true);
        const res = await StudentApi.getPortalData();
        setData(res.data);
      } catch (error) {
        console.error("Failed to load student portal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortalData();
  }, [user?.id]);

  const studentName =
    (data?.student?.first_name && data?.student?.last_name
      ? `${data.student.first_name} ${data.student.last_name}`
      : `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()) ||
    user?.name ||
    "Student";

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalCourses = data?.courses?.length ?? 0;
    const attRecords = data?.attendanceRecords ?? [];
    const presentCount = attRecords.filter(
      (r) => r.status === "present" || r.status === "late",
    ).length;
    const attRate =
      attRecords.length > 0
        ? Math.round((presentCount / attRecords.length) * 100)
        : 100;

    const examRecords = data?.examRecords ?? [];
    let noteSum = 0;
    let gradedCount = 0;
    examRecords.forEach((r) => {
      if (r.note !== undefined && r.note !== null) {
        noteSum += Number(r.note);
        gradedCount++;
      }
    });
    const avgNote = gradedCount > 0 ? (noteSum / gradedCount).toFixed(1) : "—";
    const className =
      data?.classe?.code ?? data?.classe?.name ?? "Class Section";

    return { totalCourses, attRate, avgNote, className };
  }, [data]);

  // Column helpers for Tables
  const gradeHelper = createColumnHelper<
    DataTableFeatures,
    NonNullable<StudentPortalData["examRecords"]>[number]
  >();
  const gradeColumns = gradeHelper.columns([
    gradeHelper.accessor("id", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          #ID{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-1 h-3.5 w-3.5" />
          ) : (
            <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    }),
    gradeHelper.accessor((row) => row.exam?.name ?? "Assessment", {
      id: "exam_name",
      header: "Exam / Assessment",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-foreground">
            {row.original.exam?.name ?? "Exam"}
          </span>
          <span className="text-xs text-muted-foreground block capitalize">
            {row.original.exam?.type ?? "Standard"}
          </span>
        </div>
      ),
    }),
    gradeHelper.accessor((row) => row.exam?.course?.name ?? "General", {
      id: "course",
      header: "Course",
      cell: ({ row }) => (
        <span className="text-sm font-medium">
          {row.original.exam?.course?.name ?? "—"}
        </span>
      ),
    }),
    gradeHelper.accessor("note", {
      header: "Score",
      cell: ({ row }) => {
        const note = Number(row.original.note);
        if (note >= 16) {
          return (
            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 gap-1 font-semibold dark:text-emerald-400">
              <Award className="h-3 w-3" />
              {note} / 20
            </Badge>
          );
        }
        if (note >= 10) {
          return (
            <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 gap-1 font-semibold dark:text-blue-400">
              <CheckCircle className="h-3 w-3" />
              {note} / 20
            </Badge>
          );
        }
        return <Badge variant="destructive">{note} / 20</Badge>;
      },
    }),
    gradeHelper.accessor("comment", {
      header: "Instructor Feedback",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground italic">
          {row.original.comment || "No feedback recorded"}
        </span>
      ),
    }),
  ]);

  const attHelper = createColumnHelper<
    DataTableFeatures,
    NonNullable<StudentPortalData["attendanceRecords"]>[number]
  >();
  const attColumns = attHelper.columns([
    attHelper.accessor("id", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          #ID{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-1 h-3.5 w-3.5" />
          ) : (
            <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    }),
    attHelper.accessor((row) => row.attendance_session?.date ?? "—", {
      id: "date",
      header: "Session Date",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.attendance_session?.date ?? "—"}
        </span>
      ),
    }),
    attHelper.accessor(
      (row) => row.attendance_session?.course?.name ?? "Course",
      {
        id: "course",
        header: "Course",
        cell: ({ row }) => (
          <span>
            {row.original.attendance_session?.course?.name ?? "General Lecture"}
          </span>
        ),
      },
    ),
    attHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "present") {
          return (
            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 gap-1 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Present
            </Badge>
          );
        }
        if (status === "late") {
          return (
            <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 gap-1 dark:text-amber-400">
              <Clock className="h-3 w-3" /> Late
            </Badge>
          );
        }
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" /> Absent
          </Badge>
        );
      },
    }),
  ]);

  const courseHelper = createColumnHelper<
    DataTableFeatures,
    NonNullable<StudentPortalData["courses"]>[number]
  >();
  const courseColumns = courseHelper.columns([
    courseHelper.accessor("id", {
      header: "#ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    }),
    courseHelper.accessor("name", {
      header: "Course Subject",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold">{row.original.name}</span>
          {row.original.description && (
            <span className="text-xs text-muted-foreground block line-clamp-1">
              {row.original.description}
            </span>
          )}
        </div>
      ),
    }),
    courseHelper.display({
      id: "instructors",
      header: "Assigned Instructor",
      cell: ({ row }) => {
        const teachers = row.original.teachers ?? [];
        if (teachers.length === 0) {
          return (
            <span className="text-muted-foreground italic text-xs">
              Faculty Staff
            </span>
          );
        }
        return (
          <div className="text-sm">
            {teachers.map((t) => (
              <span key={t.id} className="block font-medium">
                {t.first_name} {t.last_name}
              </span>
            ))}
          </div>
        );
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hi, {studentName}</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back to your Student Learning Dashboard and Academic Ledger.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : kpis.totalCourses}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current academic semester
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Attendance Standing
            </CardTitle>
            <CalendarCheck2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {loading ? "—" : `${kpis.attRate}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall session presence
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Grade
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : `${kpis.avgNote} / 20`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Weighted assessment score
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assigned Classroom
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : kpis.className}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data?.classe?.class_type?.name ?? "Academic Section"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          asChild
          variant="outline"
          className="h-auto p-4 justify-between bg-card hover:bg-muted/50">
          <Link href="/student/courses">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">My Courses</div>
                <div className="text-xs text-muted-foreground">
                  View subjects & teachers
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
          <Link href="/student/attendance">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Attendance Log</div>
                <div className="text-xs text-muted-foreground">
                  Check presence history
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
          <Link href="/student/grades">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Grades & Exams</div>
                <div className="text-xs text-muted-foreground">
                  Academic transcript
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
          <Link href="/student/profile">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">My Profile</div>
                <div className="text-xs text-muted-foreground">
                  Account details
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>

      {/* Main Tabbed Data Table View */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Academic Records Ledger
            </h2>
            <p className="text-sm text-muted-foreground">
              Review your grades, attendance records, and curriculum courses in
              real-time.
            </p>
          </div>

          <ButtonGroup>
            <Button
              variant={activeTab === "grades" ? "default" : "outline"}
              onClick={() => setActiveTab("grades")}>
              Exams & Grades ({data?.examRecords?.length ?? 0})
            </Button>
            <Button
              variant={activeTab === "attendance" ? "default" : "outline"}
              onClick={() => setActiveTab("attendance")}>
              Attendance ({data?.attendanceRecords?.length ?? 0})
            </Button>
            <Button
              variant={activeTab === "courses" ? "default" : "outline"}
              onClick={() => setActiveTab("courses")}>
              Courses ({data?.courses?.length ?? 0})
            </Button>
          </ButtonGroup>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <SpinnerSize />
          </div>
        ) : activeTab === "grades" ? (
          data?.examRecords?.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No grades recorded yet</CardTitle>
                <CardDescription>
                  Your instructors haven't posted any examination marks yet.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <DataTable columns={gradeColumns} data={data?.examRecords ?? []} />
          )
        ) : activeTab === "attendance" ? (
          data?.attendanceRecords?.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No attendance records logged</CardTitle>
                <CardDescription>
                  No attendance records have been registered for your account.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <DataTable
              columns={attColumns}
              data={data?.attendanceRecords ?? []}
            />
          )
        ) : data?.courses?.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No courses assigned</CardTitle>
              <CardDescription>
                There are no curriculum subjects assigned to your class yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <DataTable columns={courseColumns} data={data?.courses ?? []} />
        )}
      </div>
    </div>
  );
}
