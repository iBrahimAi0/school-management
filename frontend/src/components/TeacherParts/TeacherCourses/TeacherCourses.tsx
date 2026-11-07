import CourseApi from "@/api/Course/CourseApi";
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
import { TeacherCoursesType } from "@/types/TeacherTypes/TeacherCoursesType";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TeacherCourses() {
  const [courses, setCourses] = useState<TeacherCoursesType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user?.id) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await CourseApi.getTeacherCourses(user.id);
        setCourses(response.data?.teacherCourses ?? []);
      } catch (error) {
        console.error("Error fetching teacher courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.id]);

  return (
    <div className="flex flex-wrap gap-5 items-start">
      {loading ? (
        <div className="flex h-100 m-auto max-w-100 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : courses.length === 0 ? (
        <div className="w-full text-center py-10 text-muted-foreground">
          No courses assigned to you yet.
        </div>
      ) : (
        courses.map((course) => (
          <Card
            className="relative mx-auto w-full max-w-sm pt-0"
            key={course.id}>
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />

            <img
              src="/classeImage.png"
              alt="Course cover"
              className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />

            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>

            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  href={`/teacher/courses/students?courseId=${course.id}&courseName=${encodeURIComponent(course.name)}`}>
                  View Students
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
