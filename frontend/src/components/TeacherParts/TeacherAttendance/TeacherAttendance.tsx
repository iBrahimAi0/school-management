"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck2, Users, BookOpen } from "lucide-react";
import AttendanceSessionApi from "@/api/AttendanceSession/AttendanceSessionApi";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/UserProvider";
import { TeacherSessionsType } from "@/types/TeacherTypes/TeacherSessionsType";

export function TeacherAttendance() {
  const [sessions, setSessions] = useState<TeacherSessionsType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await AttendanceSessionApi.getTeacherSessions(user.id);
        setSessions(response.data?.teacherSessions ?? []);
      } catch (error) {
        console.error("Failed to load attendance sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Sessions</h1>
        <p className="text-sm text-muted-foreground">
          Choose a session to view the course student roster and record attendance.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : sessions.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No attendance sessions found</CardTitle>
            <CardDescription>
              There are no attendance sessions scheduled for your account.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session, key) => (
            <Card
              key={session.id}
              className="shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="secondary" className="text-xs font-mono">
                    {session.classe?.code ?? session.classe?.name ?? "Class"}
                  </Badge>
                  <CalendarCheck2 className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-lg">
                  {session.course?.name ?? `Session ${key + 1}`}
                </CardTitle>
                <CardDescription className="space-y-1 pt-1">
                  <div className="text-xs font-medium text-foreground">
                    Class: {session.classe?.name ?? session.classe?.code ?? "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Scheduled Date: {session.date ?? "N/A"}
                  </div>
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-2 border-t">
                <Button asChild size="sm" className="w-full">
                  <Link
                    href={`/teacher/attendance/students?sessionId=${session.id}&courseId=${session.course?.id ?? ""}&courseName=${encodeURIComponent(
                      session.course?.name ?? "Course"
                    )}&classeId=${session.classe?.id ?? ""}&classeCode=${encodeURIComponent(
                      session.classe?.code ?? session.classe?.name ?? ""
                    )}&date=${session.date ?? ""}`}
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    Take Attendance
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
