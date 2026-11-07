"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import ParentApi from "@/api/Parent/ParentApi";
import { ParentPortalData } from "@/types/ParentTypes/ParentPortalType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function ParentAttendancePage() {
  const [records, setRecords] = useState<ParentPortalData["attendanceRecords"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await ParentApi.getPortalData();
        setRecords(res.data?.attendanceRecords ?? []);
      } catch (err) {
        console.error("Failed to load attendance records:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    records.forEach((r) => {
      if (r.status === "present") present++;
      else if (r.status === "late") late++;
      else if (r.status === "absent") absent++;
    });
    const total = records.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 100;
    return { total, present, late, absent, rate };
  }, [records]);

  const columnHelper = createColumnHelper<DataTableFeatures, ParentPortalData["attendanceRecords"][number]>();

  const columns = columnHelper.columns([
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          #ID {column.getIsSorted() === "asc" ? <ArrowUpIcon className="ml-1 h-3.5 w-3.5" /> : <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />}
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    }),
    columnHelper.accessor(
      (row) => row.student ? `${row.student.first_name} ${row.student.last_name}` : "Child",
      {
        id: "student",
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Child Name {column.getIsSorted() === "asc" ? <ArrowUpIcon className="ml-1 h-3.5 w-3.5" /> : <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />}
          </Button>
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">
            {row.original.student?.first_name} {row.original.student?.last_name}
          </span>
        ),
      }
    ),
    columnHelper.accessor((row) => row.attendance_session?.date ?? "—", {
      id: "date",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date {column.getIsSorted() === "asc" ? <ArrowUpIcon className="ml-1 h-3.5 w-3.5" /> : <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />}
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.attendance_session?.date ?? "—"}</span>,
    }),
    columnHelper.accessor((row) => row.attendance_session?.course?.name ?? "General", {
      id: "course",
      header: "Course Subject",
      cell: ({ row }) => <span>{row.original.attendance_session?.course?.name ?? "General Lecture"}</span>,
    }),
    columnHelper.accessor((row) => row.attendance_session?.classe?.code ?? "—", {
      id: "classe",
      header: "Classroom",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.attendance_session?.classe?.code ?? "—"}
        </Badge>
      ),
    }),
    columnHelper.accessor("status", {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <Link href="/parent/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Children Attendance Records</h1>
          <p className="text-sm text-muted-foreground">
            Complete verification ledger of lecture attendance and recorded absences.
          </p>
        </div>

        {/* Counter Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Total: {stats.total}
          </Badge>
          <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs dark:text-emerald-400">
            Present: {stats.present}
          </Badge>
          <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30 px-3 py-1 text-xs dark:text-amber-400">
            Late: {stats.late}
          </Badge>
          <Badge variant="destructive" className="px-3 py-1 text-xs">
            Absent: {stats.absent}
          </Badge>
          <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
            Attendance Rate: {stats.rate}%
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : records.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No attendance records logged</CardTitle>
            <CardDescription>
              There are no attendance sessions logged for your children yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={records} />
      )}
    </div>
  );
}
