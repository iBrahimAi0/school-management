"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  FileTextIcon,
  GraduationCap,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import ExamApi from "@/api/Exam/ExamApi";
import { ExamType } from "@/types/AdminTypes/ExamValuesType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";
import { TeacherExamForm } from "./TeacherExamForm";
import { toast } from "sonner";

export function TeacherExams() {
  const { user } = useUserContext();
  const [exams, setExams] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchExams = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await ExamApi.getTeacherExams(user.id);
      setExams(res.data?.teacherExams ?? res.data?.exams ?? []);
    } catch (error) {
      console.error("Failed to fetch teacher exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [user?.id]);

  const handleViewFile = async (examId?: string | number) => {
    if (!examId) return;
    try {
      await ExamApi.viewExamFile(examId);
    } catch (err) {
      console.error("Failed to view exam file:", err);
      toast.error("Could not load exam document");
    }
  };

  const columnHelper = createColumnHelper<DataTableFeatures, ExamType>();

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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          #ID
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.id}</span>,
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.name}</span>
          <Badge variant={row.original.type === "efm" ? "destructive" : "secondary"} className="text-xs">
            {row.original.type?.toUpperCase() ?? "EXAM"}
          </Badge>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.course?.name ?? "No Course", {
      id: "course",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => <span>{row.original.course?.name ?? "—"}</span>,
    }),
    columnHelper.accessor((row) => row.classe?.code ?? row.classe?.name ?? "No Class", {
      id: "classe",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Classe
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.classe?.code ?? row.original.classe?.name ?? "—"}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "document",
      header: "Document",
      cell: ({ row }) => {
        const exam = row.original;
        if (!exam.file_path) {
          return <span className="text-xs italic text-muted-foreground">No file</span>;
        }
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewFile(exam.id)}
            className="inline-flex h-auto p-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline hover:bg-transparent"
          >
            <FileTextIcon className="h-4 w-4" />
            <span className="max-w-[140px] truncate">{exam.original_name || "View PDF"}</span>
            <ExternalLinkIcon className="h-3 w-3 opacity-70" />
          </Button>
        );
      },
    }),
    columnHelper.accessor("updated_at", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated at
          {column.getIsSorted() === "asc" ? (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const val = row.original.updated_at;
        if (!val) return "—";
        const date = new Date(val);
        return isNaN(date.getTime())
          ? val
          : date.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const exam = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button asChild size="sm">
              <Link
                href={`/teacher/grades/students?examId=${exam.id}&examName=${encodeURIComponent(
                  exam.name
                )}&classeId=${exam.classe?.id ?? ""}&courseId=${exam.course?.id ?? ""}&courseName=${encodeURIComponent(
                  exam.course?.name ?? ""
                )}`}
                className="gap-1.5"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Manage Grades</span>
              </Link>
            </Button>
          </div>
        );
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exams & Grades</h1>
          <p className="text-sm text-muted-foreground">
            Manage your course exams and record student grades.
          </p>
        </div>

        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          variant={showCreateForm ? "outline" : "default"}
        >
          {showCreateForm ? "View Exams List" : (
            <>
              <Plus className="mr-1.5 h-4 w-4" />
              Create Exam
            </>
          )}
        </Button>
      </div>

      {showCreateForm ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Create New Exam</CardTitle>
            <CardDescription>
              Set up an exam for one of your assigned courses and classes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeacherExamForm
              onSuccess={() => {
                setShowCreateForm(false);
                fetchExams();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : exams.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No exams found</CardTitle>
            <CardDescription>
              You haven't created any exams yet. Click "Create Exam" above to create your first one.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={exams} />
      )}
    </div>
  );
}
