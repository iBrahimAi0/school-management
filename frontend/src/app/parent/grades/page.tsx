"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowDownIcon,
  ArrowUpIcon,
  Award,
  CheckCircle,
  FileText,
  GraduationCap,
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
import ExamApi from "@/api/Exam/ExamApi";
import { ParentPortalData } from "@/types/ParentTypes/ParentPortalType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";
import { toast } from "sonner";

export default function ParentGradesPage() {
  const [examRecords, setExamRecords] = useState<ParentPortalData["examRecords"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setLoading(true);
        const res = await ParentApi.getPortalData();
        setExamRecords(res.data?.examRecords ?? []);
      } catch (err) {
        console.error("Failed to load grades:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGrades();
  }, []);

  const stats = useMemo(() => {
    let sum = 0;
    let graded = 0;
    let max = -1;
    let passCount = 0;

    examRecords.forEach((r) => {
      if (r.note !== undefined && r.note !== null) {
        const val = Number(r.note);
        sum += val;
        graded++;
        if (val > max) max = val;
        if (val >= 10) passCount++;
      }
    });

    const avg = graded > 0 ? (sum / graded).toFixed(1) : null;
    return { graded, avg, max: max >= 0 ? max : null, passCount };
  }, [examRecords]);

  const handleViewPaper = async (examId?: number | string) => {
    if (!examId) return;
    try {
      await ExamApi.viewExamFile(examId);
    } catch (e) {
      toast.error("Unable to load exam paper");
    }
  };

  const columnHelper = createColumnHelper<DataTableFeatures, ParentPortalData["examRecords"][number]>();

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
    columnHelper.accessor((row) => row.exam?.name ?? "Exam", {
      id: "exam",
      header: "Assessment",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-foreground">{row.original.exam?.name ?? "Assessment"}</span>
          <span className="text-xs text-muted-foreground block capitalize">{row.original.exam?.type ?? "Standard"}</span>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.exam?.course?.name ?? "General", {
      id: "course",
      header: "Course Subject",
      cell: ({ row }) => <span>{row.original.exam?.course?.name ?? "General"}</span>,
    }),
    columnHelper.accessor("note", {
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Grade Score {column.getIsSorted() === "asc" ? <ArrowUpIcon className="ml-1 h-3.5 w-3.5" /> : <ArrowDownIcon className="ml-1 h-3.5 w-3.5" />}
        </Button>
      ),
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
    columnHelper.accessor("comment", {
      header: "Teacher Remarks",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground italic max-w-xs truncate block">
          {row.original.comment || "No feedback recorded"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Exam Paper</div>,
      cell: ({ row }) => {
        const examId = row.original.exam?.id;
        return (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => handleViewPaper(examId)}
            >
              <FileText className="h-3.5 w-3.5" />
              View Paper
            </Button>
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight">Children Academic Grades</h1>
          <p className="text-sm text-muted-foreground">
            Published assessment scores, exam marks, and teacher comments across all children.
          </p>
        </div>

        {/* Counter Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Evaluations: {stats.graded}
          </Badge>
          {stats.avg !== null && (
            <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 px-3 py-1 text-xs dark:text-blue-400">
              Avg: {stats.avg} / 20
            </Badge>
          )}
          {stats.max !== null && (
            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs dark:text-emerald-400">
              Top: {stats.max} / 20
            </Badge>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : examRecords.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No examination records found</CardTitle>
            <CardDescription>
              No test evaluations or grades have been posted for your children yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={examRecords} />
      )}
    </div>
  );
}
