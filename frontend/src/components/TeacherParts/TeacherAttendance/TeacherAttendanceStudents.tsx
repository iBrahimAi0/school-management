"use client";

import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, Plus, Pencil, CheckCircle2, Clock, XCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { TeacherSessionsType } from "@/types/TeacherTypes/TeacherSessionsType";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";
import { AttendanceRecord } from "@/types/AdminTypes/AttendanceRecordValuesType";
import CourseApi from "@/api/Course/CourseApi";
import { StudentApi } from "@/api/Student/StudentApi";
import AttendanceRecordApi from "@/api/AttendanceRecord/AttendanceRecordApi";
import { useUserContext } from "@/context/UserProvider";
import { AttendanceModal } from "./AttendanceModal";

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

      // Fetch students for the course (or class)
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

      // Fetch attendance records for this session
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

  // Map student ID to their attendance record
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

  // Statistics
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
      marked: records.length,
      present,
      late,
      absent,
    };
  }, [students.length, records]);

  const handleOpenAddModal = (student: StudentTypes) => {
    setSelectedStudent(student);
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (student: StudentTypes, record: AttendanceRecord) => {
    setSelectedStudent(student);
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const renderStatusBadge = (record?: AttendanceRecord) => {
    if (!record) {
      return (
        <Badge variant="outline" className="text-muted-foreground border-dashed gap-1 font-normal">
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

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
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

      {/* Main Student List */}
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
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Student Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Class</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {students.map((student) => {
                  const studentId = Number(student.id);
                  const record = recordMap.get(studentId);
                  const fullName = `${student.first_name ?? ""} ${student.last_name ?? ""}`.trim() || `Student #${student.id}`;

                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {fullName}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.email ?? "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {student.classe?.code ?? student.classe?.name ?? "—"}
                      </td>
                      <td className="px-6 py-4">
                        {renderStatusBadge(record)}
                      </td>
                      <td className="px-6 py-4 text-right">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
