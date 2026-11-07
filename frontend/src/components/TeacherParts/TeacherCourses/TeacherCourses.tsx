"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Presentation, Users, BookOpen } from "lucide-react";
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
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
        <p className="text-sm text-muted-foreground">
          Explore course curricula, syllabus details, and active students.
        </p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : courses.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No courses found</CardTitle>
            <CardDescription>
              You do not have any teaching courses assigned to your account yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-1">
                  <Presentation className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {course.description || "Course materials, lessons, and curriculum."}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-2 border-t">
                <Button asChild className="w-full" size="sm">
                  <Link
                    href={`/teacher/courses/students?courseId=${course.id}&courseName=${encodeURIComponent(
                      course.name
                    )}`}
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    View Students
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
