"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowLeft,
  ArrowDownIcon,
  ArrowUpIcon,
  Users,
  Mail,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";
import CourseApi from "@/api/Course/CourseApi";
import { useUserContext } from "@/context/UserProvider";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

function TeacherCoursesStudentsContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const courseName = searchParams.get("courseName") ?? "Course";

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
          Number(courseId)
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
            {row.original.classe?.code ?? row.original.classe?.name ?? "No Class"}
          </Badge>
        ),
      }
    ),
    columnHelper.accessor("gender", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gender
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="capitalize text-muted-foreground text-sm">
          {row.original.gender === "m"
            ? "Male"
            : row.original.gender === "f"
            ? "Female"
            : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("blood_type", {
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Blood Group
          {column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownIcon className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.blood_type ?? "—"}
        </span>
      ),
    }),
    columnHelper.accessor(
      (row) =>
        row.parent
          ? `${row.parent.first_name ?? ""} ${row.parent.last_name ?? ""}`.trim()
          : "Not Listed",
      {
        id: "parent",
        header: "Parent Contact",
        cell: ({ row }) => {
          const parent = row.original.parent;
          if (!parent) return <span className="text-muted-foreground/60 italic text-sm">Not Listed</span>;
          const parentName = `${parent.first_name ?? ""} ${parent.last_name ?? ""}`.trim();
          return (
            <div className="text-sm">
              <span className="font-medium text-foreground">{parentName}</span>
            </div>
          );
        },
      }
    ),
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
            <Link href="/teacher/courses">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {courseName} &bull; Enrolled Students
          </h1>
          <p className="text-sm text-muted-foreground">
            Students actively registered in classes taking this course.
          </p>
        </div>

        <Badge variant="secondary" className="px-3 py-1.5 text-xs w-fit">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          Enrolled: {students.length} Students
        </Badge>
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
              There are no students currently enrolled in this course.
            </CardDescription>
          </CardHeader>
        </Card>
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
      }
    >
      <TeacherCoursesStudentsContent />
    </Suspense>
  );
}
