"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Users,
  CalendarCheck2,
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowDownIcon,
  ArrowUpIcon,
  Award,
  CheckCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { useUserContext } from "@/context/UserProvider";
import ParentApi from "@/api/Parent/ParentApi";
import { ParentPortalData } from "@/types/ParentTypes/ParentPortalType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function ParentDashboard() {
  const { user } = useUserContext();
  const [data, setData] = useState<ParentPortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "children" | "attendance" | "grades"
  >("children");

  useEffect(() => {
    if (!user?.id) return;

    const loadParentData = async () => {
      try {
        setLoading(true);
        const res = await ParentApi.getPortalData();
        setData(res.data);
      } catch (err) {
        console.error("Failed to load parent portal data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadParentData();
  }, [user?.id]);

  const parentName =
    user?.name ||
    `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
    "Parent";

  // KPIs
  const kpis = useMemo(() => {
    const childrenCount = data?.children?.length ?? 0;
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
    const avgGrade = gradedCount > 0 ? (noteSum / gradedCount).toFixed(1) : "—";

    return { childrenCount, attRate, avgGrade };
  }, [data]);

  // Children Columns
  const childHelper = createColumnHelper<
    DataTableFeatures,
    NonNullable<ParentPortalData["children"]>[number]
  >();
  const childColumns = childHelper.columns([
    childHelper.accessor("id", {
      header: "#ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    }),
    childHelper.accessor(
      (row) =>
        `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() ||
        `Child #${row.id}`,
      {
        id: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Child Name{" "}
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-1 h-3.5 w-3.5" />
            ) : (
              <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <span className="font-semibold text-foreground">
              {row.original.first_name} {row.original.last_name}
            </span>
            <span className="text-xs text-muted-foreground block">
              {row.original.email}
            </span>
          </div>
        ),
      },
    ),
    childHelper.accessor((row) => row.classe?.code ?? row.classe?.name ?? "—", {
      id: "classe",
      header: "Classroom",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.classe?.code ??
            row.original.classe?.name ??
            "Unassigned"}
        </Badge>
      ),
    }),
    childHelper.accessor(
      (row) => row.classe?.class_type?.name ?? "Standard Academic",
      {
        id: "level",
        header: "Grade Level",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.classe?.class_type?.name ?? "Standard Academic"}
          </span>
        ),
      },
    ),
    childHelper.display({
      id: "teacher",
      header: "Primary Teacher",
      cell: ({ row }) => {
        const teacher = row.original.classe?.teacher;
        if (!teacher)
          return (
            <span className="text-muted-foreground italic text-xs">
              Not Assigned
            </span>
          );
        return (
          <div className="text-sm">
            <span className="font-medium text-foreground">
              {teacher.first_name} {teacher.last_name}
            </span>
            {teacher.email && (
              <span className="text-xs text-muted-foreground block">
                {teacher.email}
              </span>
            )}
          </div>
        );
      },
    }),
    childHelper.display({
      id: "status",
      header: "Academic Standing",
      cell: () => (
        <Badge
          variant="outline"
          className="text-emerald-700 bg-emerald-500/10 border-emerald-500/30">
          Good Standing
        </Badge>
      ),
    }),
  ]);

  // Attendance Columns
  const attHelper = createColumnHelper<
    DataTableFeatures,
    NonNullable<ParentPortalData["attendanceRecords"]>[number]
  >();
  const attColumns = attHelper.columns([
    attHelper.accessor("id", {
      header: "#ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    }),
    attHelper.accessor(
      (row) =>
        row.student
          ? `${row.student.first_name} ${row.student.last_name}`
          : "Child",
      {
        id: "student",
        header: "Student / Child",
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.student?.first_name} {row.original.student?.last_name}
          </span>
        ),
      },
    ),
    attHelper.accessor((row) => row.attendance_session?.date ?? "—", {
      id: "date",
      header: "Session Date",
      cell: ({ row }) => (
        <span>{row.original.attendance_session?.date ?? "—"}</span>
      ),
    }),
    attHelper.accessor(
      (row) => row.attendance_session?.course?.name ?? "General",
      {
        id: "course",
        header: "Course Subject",
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

  // Grades Columns
  const gradeHelper = createColumnHelper<
    DataTableFeatures,
    NonNullable<ParentPortalData["examRecords"]>[number]
  >();
  const gradeColumns = gradeHelper.columns([
    gradeHelper.accessor("id", {
      header: "#ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.id}</span>
      ),
    }),
    gradeHelper.accessor(
      (row) =>
        row.student
          ? `${row.student.first_name} ${row.student.last_name}`
          : "Child",
      {
        id: "student",
        header: "Student / Child",
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.student?.first_name} {row.original.student?.last_name}
          </span>
        ),
      },
    ),
    gradeHelper.accessor((row) => row.exam?.name ?? "Assessment", {
      id: "exam",
      header: "Exam / Test",
      cell: ({ row }) => <span>{row.original.exam?.name ?? "Assessment"}</span>,
    }),
    gradeHelper.accessor((row) => row.exam?.course?.name ?? "General", {
      id: "course",
      header: "Course Subject",
      cell: ({ row }) => (
        <span>{row.original.exam?.course?.name ?? "General"}</span>
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
      header: "Teacher Remarks",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground italic max-w-xs truncate block">
          {row.original.comment || "No feedback recorded"}
        </span>
      ),
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Hi, {parentName}</h1>
        <p className="text-muted-foreground text-sm">
          Welcome to the School Parent Portal and child academic monitoring
          overview.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Registered Children
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : kpis.childrenCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered in institution
            </p>
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
            <div className="text-2xl font-bold text-emerald-600">
              {loading ? "—" : `${kpis.attRate}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Combined attendance standing
            </p>
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
            <div className="text-2xl font-bold">
              {loading ? "—" : `${kpis.avgGrade} / 20`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Academic performance
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Classes
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading
                ? "—"
                : (data?.children?.[0]?.classe?.code ?? "Assigned")}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Classroom section
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          asChild
          variant="outline"
          className="h-auto p-4 justify-between bg-card hover:bg-muted/50">
          <Link href="/parent/children">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">My Children</div>
                <div className="text-xs text-muted-foreground">
                  View child profile & classes
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
          <Link href="/parent/attendance">
            <div className="flex items-center gap-3">
              <CalendarCheck2 className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Attendance Records</div>
                <div className="text-xs text-muted-foreground">
                  Review absence history
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
          <Link href="/parent/grades">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <div className="text-left">
                <div className="font-semibold text-sm">Exams & Grading</div>
                <div className="text-xs text-muted-foreground">
                  View test marks & notes
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </Button>
      </div>

      {/* Main Tabbed Data View */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Parent Overview Ledger
            </h2>
            <p className="text-sm text-muted-foreground">
              Monitor your children's presence, tests, and academic standing in
              real-time.
            </p>
          </div>

          <ButtonGroup>
            <Button
              variant={activeTab === "children" ? "default" : "outline"}
              onClick={() => setActiveTab("children")}>
              Children ({data?.children?.length ?? 0})
            </Button>
            <Button
              variant={activeTab === "attendance" ? "default" : "outline"}
              onClick={() => setActiveTab("attendance")}>
              Attendance Records ({data?.attendanceRecords?.length ?? 0})
            </Button>
            <Button
              variant={activeTab === "grades" ? "default" : "outline"}
              onClick={() => setActiveTab("grades")}>
              Grades ({data?.examRecords?.length ?? 0})
            </Button>
          </ButtonGroup>
        </div>

        {loading ? (
          <div className="flex h-56 items-center justify-center">
            <SpinnerSize />
          </div>
        ) : activeTab === "children" ? (
          data?.children?.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No children registered</CardTitle>
                <CardDescription>
                  There are no student accounts linked to this parent profile
                  yet.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <DataTable columns={childColumns} data={data?.children ?? []} />
          )
        ) : activeTab === "attendance" ? (
          data?.attendanceRecords?.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <CardTitle>No attendance records logged</CardTitle>
                <CardDescription>
                  No attendance records have been registered for your children.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <DataTable
              columns={attColumns}
              data={data?.attendanceRecords ?? []}
            />
          )
        ) : data?.examRecords?.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>No exam grades recorded</CardTitle>
              <CardDescription>
                No examination marks have been published for your children yet.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <DataTable columns={gradeColumns} data={data?.examRecords ?? []} />
        )}
      </div>
    </div>
  );
}
