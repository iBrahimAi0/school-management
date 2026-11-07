"use client";

import { useEffect, useState, useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowDownIcon,
  ArrowUpIcon,
  Plus,
  Pencil,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  Mail,
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
import { TeacherSessionsType } from "@/types/TeacherTypes/TeacherSessionsType";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";
import { AttendanceRecord } from "@/types/AdminTypes/AttendanceRecordValuesType";
import CourseApi from "@/api/Course/CourseApi";
import { StudentApi } from "@/api/Student/StudentApi";
import AttendanceRecordApi from "@/api/AttendanceRecord/AttendanceRecordApi";
import { useUserContext } from "@/context/UserProvider";
import { AttendanceModal } from "./AttendanceModal";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

interface TeacherAttendanceStudentsProps {
  session: TeacherSessionsType;
  onBack: () => void;
}

export default function TeacherAttendanceStudents({
  session,
  onBack,
}: TeacherAttendanceStudentsProps) {
  const { user } = useUserContext();
  const [students, setStudents] = useState<StudentTypes[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentTypes | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const fetchRecords = async () => {
    try {
      const res = await AttendanceRecordApi.getAttendanceRecords(session.id);
      setRecords(res.data?.attendanceRecords ?? []);
    } catch (error) {
      console.error("Failed to fetch session attendance records:", error);
    }
  };

  const loadData = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      let studentList: StudentTypes[] = [];
      if (session.course?.id) {
        const courseRes = await CourseApi.getTeacherCourseStudents(
          user.id,
          Number(session.course.id)
        );
        studentList = courseRes.data?.teacherCourseStudents ?? [];
      }

      if (studentList.length === 0 && session.classe?.id) {
        const classRes = await StudentApi.getTeacherStudentsClasse(
          user.id,
          Number(session.classe.id)
        );
        studentList = classRes.data?.teacherStudentsClasse ?? [];
      }

      setStudents(studentList);
      await fetchRecords();
    } catch (error) {
      console.error("Failed to load attendance session data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id, session.id]);

  const recordMap = useMemo(() => {
    const map = new Map<number, AttendanceRecord>();
    records.forEach((rec) => {
      const studentId = rec.user_id ?? rec.student?.id;
      if (studentId) {
        map.set(Number(studentId), rec);
      }
    });
    return map;
  }, [records]);

  const stats = useMemo(() => {
    let present = 0;
    let late = 0;
    let absent = 0;
    records.forEach((r) => {
      if (r.status === "present") present++;
      else if (r.status === "late") late++;
      else if (r.status === "absent") absent++;
    });
    return {
      total: students.length,
      present,
      late,
      absent,
    };
  }, [students, records]);

  const handleOpenAddModal = (student: StudentTypes) => {
    setSelectedStudent(student);
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (
    student: StudentTypes,
    record: AttendanceRecord
  ) => {
    setSelectedStudent(student);
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const renderStatusBadge = (record?: AttendanceRecord) => {
    if (!record) {
      return (
        <Badge variant="secondary" className="gap-1 opacity-70">
          <HelpCircle className="h-3 w-3" />
          Not Marked
        </Badge>
      );
    }

    switch (record.status) {
      case "present":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-500/30 dark:text-emerald-400 gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Present
          </Badge>
        );
      case "late":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-500/30 dark:text-amber-400 gap-1">
            <Clock className="h-3 w-3" />
            Late
          </Badge>
        );
      case "absent":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Absent
          </Badge>
        );
      default:
        return <Badge variant="secondary">{record.status}</Badge>;
    }
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
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground text-sm">
          <Mail className="h-3.5 w-3.5 opacity-60" />
          {row.original.email ?? "—"}
        </span>
      ),
    }),
    columnHelper.accessor(
      (row) => row.classe?.code ?? row.classe?.name ?? "—",
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
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const studentId = Number(row.original.id);
        const record = recordMap.get(studentId);
        return renderStatusBadge(record);
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
                Edit
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-8 gap-1"
                onClick={() => handleOpenAddModal(student)}
              >
                <Plus className="h-3.5 w-3.5" />
                Mark
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
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Sessions
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {session.course?.name ?? "Course"} Attendance
          </h1>
          <p className="text-sm text-muted-foreground">
            Class: <span className="font-medium text-foreground">{session.classe?.code ?? session.classe?.name ?? "N/A"}</span> &bull; Date: <span className="font-medium text-foreground">{session.date}</span>
          </p>
        </div>

        {/* Attendance Counter Stats */}
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
              There are no students enrolled in this course or class.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={students} />
      )}

      {/* Attendance Modal (Dialog) */}
      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        courseName={session.course?.name ?? "Course"}
        sessionId={session.id}
        existingRecord={selectedRecord}
        onSuccess={fetchRecords}
      />
    </div>
  );
}
