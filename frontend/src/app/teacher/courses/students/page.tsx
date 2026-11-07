"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { DataTableFeatures } from "@/components/DataTable/data-table-features";
import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";
import CourseApi from "@/api/Course/CourseApi";
import { useUserContext } from "@/context/UserProvider";

function TeacherCoursesStudentsContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const courseName = searchParams.get("courseName");

  const [students, setStudents] = useState<StudentTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user?.id || !courseId) {
      setLoading(false);
      return;
    }

    const fetchCourseStudents = async () => {
      try {
        setLoading(true);
        const res = await CourseApi.getTeacherCourseStudents(
          user.id,
          Number(courseId),
        );
        setStudents(res.data.teacherCourseStudents || []);
      } catch (error) {
        console.error("Failed to fetch students for course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseStudents();
  }, [user?.id, courseId]);

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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          #ID
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    }),
    columnHelper.accessor((row) => row.classe?.code ?? "No Class", {
      id: "classe",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Class Code
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const classe = row.original.classe;
        return classe ? (
          <Badge variant="outline">{classe.code}</Badge>
        ) : (
          <span className="text-muted-foreground italic text-sm">Not assigned</span>
        );
      },
    }),
    columnHelper.accessor("first_name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          First Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    }),
    columnHelper.accessor("last_name", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Last Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    }),
    columnHelper.accessor("date_of_birth", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date of Birth
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.original.date_of_birth);
        return isNaN(date.getTime()) ? "Invalid date" : format(date, "dd/MM/yyyy");
      },
    }),
    columnHelper.accessor("gender", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Gender
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.gender === "m" ? "Male" : "Female"}
        </span>
      ),
    }),
    columnHelper.accessor("blood_type", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Blood Type
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
    }),
    columnHelper.accessor(
      (row) =>
        row.parent?.first_name
          ? `${row.parent.first_name} ${row.parent.last_name}`
          : "No Parent",
      {
        id: "parent",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Parent
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const parent = row.original.parent;
          return parent ? (
            <span className="font-medium">
              {parent.first_name} {parent.last_name}
            </span>
          ) : (
            <span className="text-muted-foreground italic text-sm">Not assigned</span>
          );
        },
      },
    ),
  ]);

  if (!courseId) {
    return (
      <div className="container mx-auto py-10 space-y-4">
        <Button variant="outline" asChild>
          <Link href="/teacher/courses" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Courses</span>
          </Link>
        </Button>
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No course selected. Please select a course from My Courses.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/teacher/courses" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to My Courses</span>
          </Link>
        </Button>

        {courseName && (
          <h2 className="text-lg font-semibold text-foreground">
            Course: <span className="text-primary">{courseName}</span>
          </h2>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No students are currently enrolled in this course.
        </div>
      ) : (
        <DataTable columns={columns} data={students} />
      )}
    </div>
  );
}

export default function TeacherCoursesStudentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      }>
      <TeacherCoursesStudentsContent />
    </Suspense>
  );
}
