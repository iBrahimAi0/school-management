"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowDownIcon,
  ArrowUpIcon,
  Plus,
  Pencil,
  GraduationCap,
  Award,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";
import { ExamRecordType } from "@/types/AdminTypes/ExamRecordValuesType";
import CourseApi from "@/api/Course/CourseApi";
import { StudentApi } from "@/api/Student/StudentApi";
import ExamRecordApi from "@/api/ExamRecord/ExamRecordApi";
import { useUserContext } from "@/context/UserProvider";
import { GradeModal } from "@/components/TeacherParts/TeacherGrades/GradeModal";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

function TeacherGradesStudentsContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId");
  const examName = searchParams.get("examName") ?? "Exam";
  const classeId = searchParams.get("classeId");
  const courseId = searchParams.get("courseId");
  const courseName = searchParams.get("courseName") ?? "Course";

  const { user } = useUserContext();
  const [students, setStudents] = useState<StudentTypes[]>([]);
  const [records, setRecords] = useState<ExamRecordType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentTypes | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ExamRecordType | null>(null);

  const fetchRecords = async () => {
    if (!examId) return;
    try {
      const res = await ExamRecordApi.getExamRecords(examId);
      setRecords(res.data?.examRecords ?? []);
    } catch (error) {
      console.error("Failed to fetch exam records:", error);
    }
  };

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      let studentList: StudentTypes[] = [];
      if (courseId) {
        const courseRes = await CourseApi.getTeacherCourseStudents(
          user.id,
          Number(courseId)
        );
        studentList = courseRes.data?.teacherCourseStudents ?? [];
      }

      if (studentList.length === 0 && classeId) {
        const classRes = await StudentApi.getTeacherStudentsClasse(
          user.id,
          Number(classeId)
        );
        studentList = classRes.data?.teacherStudentsClasse ?? [];
      }

      setStudents(studentList);
      await fetchRecords();
    } catch (error) {
      console.error("Failed to load grade student data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, examId, courseId, classeId]);

  const recordMap = useMemo(() => {
    const map = new Map<number, ExamRecordType>();
    records.forEach((rec) => {
      const studentId = rec.user_id ?? rec.student?.id;
      if (studentId) {
        map.set(Number(studentId), rec);
      }
    });
    return map;
  }, [records]);

  const stats = useMemo(() => {
    let graded = 0;
    let sum = 0;
    let max = -1;

    records.forEach((r) => {
      if (r.note !== undefined && r.note !== null) {
        graded++;
        const val = Number(r.note);
        sum += val;
        if (val > max) max = val;
      }
    });

    return {
      total: students.length,
      graded,
      avg: graded > 0 ? (sum / graded).toFixed(1) : null,
      max: max >= 0 ? max : null,
    };
  }, [students, records]);

  const handleOpenAddModal = (student: StudentTypes) => {
    setSelectedStudent(student);
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (
    student: StudentTypes,
    record: ExamRecordType
  ) => {
    setSelectedStudent(student);
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const renderGradeBadge = (record?: ExamRecordType) => {
    if (!record || record.note === undefined || record.note === null) {
      return (
        <Badge variant="secondary" className="opacity-60">
          Not graded
        </Badge>
      );
    }

    const note = Number(record.note);
    if (note >= 16) {
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/30 dark:text-emerald-400 font-semibold gap-1">
          <Award className="h-3 w-3" />
          {note} / 20
        </Badge>
      );
    }
    if (note >= 10) {
      return (
        <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-500/30 dark:text-blue-400 font-semibold gap-1">
          <CheckCircle className="h-3 w-3" />
          {note} / 20
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="font-semibold">
        {note} / 20
      </Badge>
    );
  };

  const columnHelper = createColumnHelper<DataTableFeatures, StudentTypes>();

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
    columnHelper.accessor(
      (row) => `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() || `Student #${row.id}`,
      {
        id: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Student Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const fullName =
            `${row.original.first_name ?? ""} ${row.original.last_name ?? ""}`.trim() ||
            `Student #${row.original.id}`;
          return <span className="font-medium text-foreground">{fullName}</span>;
        },
      }
    ),
    columnHelper.accessor(
      (row) => row.classe?.code ?? row.classe?.name ?? "No Class",
      {
        id: "classe",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Class
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
      }
    ),
    columnHelper.display({
      id: "grade",
      header: "Grade",
      cell: ({ row }) => {
        const studentId = Number(row.original.id);
        const record = recordMap.get(studentId);
        return renderGradeBadge(record);
      },
    }),
    columnHelper.display({
      id: "comment",
      header: "Comments / Feedback",
      cell: ({ row }) => {
        const studentId = Number(row.original.id);
        const record = recordMap.get(studentId);
        if (!record?.comment) {
          return <span className="text-muted-foreground/50 italic text-sm">None</span>;
        }
        return <span className="text-sm text-muted-foreground max-w-xs truncate">{record.comment}</span>;
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => {
        const student = row.original;
        const studentId = Number(student.id);
        const record = recordMap.get(studentId);
        return (
          <div className="flex items-center justify-end">
            {record ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => handleOpenEditModal(student, record)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit Grade
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => handleOpenAddModal(student)}
              >
                <Plus className="h-3.5 w-3.5" />
                Enter Grade
              </Button>
            )}
          </div>
        );
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/teacher/grades">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Exams
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {examName} &bull; Student Grades
          </h1>
          <p className="text-sm text-muted-foreground">
            Course: <span className="font-medium text-foreground">{courseName}</span>
          </p>
        </div>

        {/* Counter Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Graded: {stats.graded} / {stats.total}
          </Badge>
          {stats.avg !== null && (
            <Badge className="bg-blue-500/15 text-blue-700 border-blue-500/30 px-3 py-1 text-xs dark:text-blue-400">
              Avg: {stats.avg} / 20
            </Badge>
          )}
          {stats.max !== null && (
            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 px-3 py-1 text-xs dark:text-emerald-400">
              Max: {stats.max} / 20
            </Badge>
          )}
        </div>
      </div>

      {/* Main Student List with Shadcn DataTable */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : students.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No students found</CardTitle>
            <CardDescription>
              There are no students currently assigned to this course or class.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={students} />
      )}

      {/* Grade Modal (Dialog) */}
      <GradeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        examName={examName}
        examId={examId ?? ""}
        existingRecord={selectedRecord}
        onSuccess={fetchRecords}
      />
    </div>
  );
}

export default function TeacherGradesStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      }
    >
      <TeacherGradesStudentsContent />
    </Suspense>
  );
}
