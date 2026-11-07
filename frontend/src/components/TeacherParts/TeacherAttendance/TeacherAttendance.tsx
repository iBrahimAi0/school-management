"use client";

import { useEffect, useState } from "react";
import AttendanceSessionApi from "@/api/AttendanceSession/AttendanceSessionApi";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/UserProvider";
import { TeacherSessionsType } from "@/types/TeacherTypes/TeacherSessionsType";
import TeacherAttendanceStudents from "./TeacherAttendanceStudents";

export function TeacherAttendance() {
  const [sessions, setSessions] = useState<TeacherSessionsType[]>([]);
  const [selectedSession, setSelectedSession] = useState<TeacherSessionsType | null>(null);
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

  // If a session is selected, show the students roster & attendance view
  if (selectedSession) {
    return (
      <TeacherAttendanceStudents
        session={selectedSession}
        onBack={() => setSelectedSession(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Sessions</h1>
        <p className="text-sm text-muted-foreground">
          Choose a session to view the course student roster and record attendance.
        </p>
      </div>

      <div className="flex flex-wrap gap-5 items-start">
        {loading ? (
          <div className="flex h-64 m-auto items-center justify-center">
            <SpinnerSize />
          </div>
        ) : sessions.length === 0 ? (
          <div className="w-full text-center py-12 text-muted-foreground border rounded-xl p-8 bg-card">
            No attendance sessions found for your account.
          </div>
        ) : (
          sessions.map((session, key) => (
            <Card key={session.id} size="sm" className="w-full max-w-xs shadow-sm hover:shadow transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">
                  {`Session ${key + 1} | ${session.course?.name ?? "Course"}`}
                </CardTitle>
                <CardDescription>
                  Classe: {session.classe?.code ?? session.classe?.name ?? "N/A"}
                </CardDescription>
                <CardDescription>
                  Course: {session.course?.name ?? "N/A"}
                </CardDescription>
                <CardDescription>
                  Date: {session.date ?? "N/A"}
                </CardDescription>
              </CardHeader>

              <CardFooter className="flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedSession(session)}
                >
                  Attendance
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
