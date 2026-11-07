"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowLeft, BookOpen, GraduationCap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { StudentApi } from "@/api/Student/StudentApi";
import { StudentPortalData } from "@/types/StudentTypes/StudentPortalType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<StudentPortalData["courses"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const res = await StudentApi.getPortalData();
        setCourses(res.data?.courses ?? []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const columnHelper = createColumnHelper<DataTableFeatures, StudentPortalData["courses"][number]>();

  const columns = columnHelper.columns([
    columnHelper.accessor("id", {
      header: "#ID",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    }),
    columnHelper.accessor("name", {
      header: "Course Subject",
      cell: ({ row }) => (
        <div>
          <span className="font-semibold text-foreground">{row.original.name}</span>
          {row.original.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{row.original.description}</p>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: "teachers",
      header: "Instructor",
      cell: ({ row }) => {
        const teachers = row.original.teachers ?? [];
        if (teachers.length === 0) {
          return <span className="text-xs italic text-muted-foreground">Faculty Member</span>;
        }
        return (
          <div className="space-y-1">
            {teachers.map((t) => (
              <div key={t.id} className="text-sm">
                <span className="font-medium text-foreground">{t.first_name} {t.last_name}</span>
                {t.email && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3 opacity-60" /> {t.email}
                  </span>
                )}
              </div>
            ))}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant="outline" className="text-emerald-700 bg-emerald-500/10 border-emerald-500/30">
          Active Course
        </Badge>
      ),
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <Link href="/student/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">My Assigned Courses</h1>
          <p className="text-sm text-muted-foreground">
            Curriculum subjects and faculty instructors assigned to your classroom.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5 text-xs">
          <BookOpen className="h-3.5 w-3.5 mr-1.5" />
          {courses.length} Subjects
        </Badge>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : courses.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No assigned courses</CardTitle>
            <CardDescription>
              There are no courses assigned to your class section.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={courses} />
      )}
    </div>
  );
}
