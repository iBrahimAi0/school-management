import AttendanceSessionApi from "@/api/AttendanceSession/AttendanceSessionApi";
import CourseApi from "@/api/Course/CourseApi";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/UserProvider";
import { TeacherCoursesType } from "@/types/TeacherTypes/TeacherCoursesType";
import { TeacherSessionsType } from "@/types/TeacherTypes/TeacherSessionsType";
import { ChevronRightIcon } from "lucide-react";

import { useEffect, useState } from "react";
import TeacherAttendanceStudents from "./TeacherAttendanceStudents";

export function TeacherAttendance() {
  const [sessions, setSessions] = useState<TeacherSessionsType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchCourses = async () => {
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

    fetchCourses();
  }, [user?.id]);

  return (
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
          <Card key={session.id} size="sm" className="mx-auto w-full max-w-xs">
            <CardHeader>
              <CardTitle>{`Session ${key + 1} | ${session.course?.name ?? "Course"}`}</CardTitle>
              <CardDescription>
                Classe: {session.classe?.code ?? "N/A"}
              </CardDescription>
              <CardDescription>
                Course: {session.course?.name ?? "N/A"}
              </CardDescription>
              <CardDescription>
                Teacher: {session.teacher?.first_name ?? ""}{" "}
                {session.teacher?.last_name ?? ""}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex-col gap-2">
              <Button size="sm" className="w-full">
                Attendance
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
