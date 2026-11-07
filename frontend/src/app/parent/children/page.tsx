"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowLeft, Users, Mail, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import ParentApi from "@/api/Parent/ParentApi";
import { ParentPortalData } from "@/types/ParentTypes/ParentPortalType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<ParentPortalData["children"]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await ParentApi.getPortalData();
        setChildren(res.data?.children ?? []);
      } catch (err) {
        console.error("Failed to load children:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const columnHelper = createColumnHelper<DataTableFeatures, ParentPortalData["children"][number]>();

  const columns = columnHelper.columns([
    columnHelper.accessor("id", {
      header: "#ID",
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
    }),
    columnHelper.accessor(
      (row) => `${row.first_name} ${row.last_name}`,
      {
        id: "name",
        header: "Child Full Name",
        cell: ({ row }) => (
          <div>
            <span className="font-semibold text-foreground">
              {row.original.first_name} {row.original.last_name}
            </span>
            <span className="text-xs text-muted-foreground block">{row.original.email}</span>
          </div>
        ),
      }
    ),
    columnHelper.accessor((row) => row.classe?.code ?? row.classe?.name ?? "—", {
      id: "classe",
      header: "Class Section",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-mono text-xs">
          {row.original.classe?.code ?? row.original.classe?.name ?? "Unassigned"}
        </Badge>
      ),
    }),
    columnHelper.accessor((row) => row.classe?.class_type?.name ?? "Standard Academic", {
      id: "grade_level",
      header: "Academic Grade",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.classe?.class_type?.name ?? "Standard Academic"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "teacher",
      header: "Primary Teacher",
      cell: ({ row }) => {
        const teacher = row.original.classe?.teacher;
        if (!teacher) return <span className="text-muted-foreground italic text-xs">Not Assigned</span>;
        return (
          <div className="text-sm">
            <span className="font-medium text-foreground">{teacher.first_name} {teacher.last_name}</span>
            {teacher.email && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3 opacity-60" /> {teacher.email}
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("gender", {
      header: "Gender",
      cell: ({ row }) => (
        <span className="text-sm capitalize text-muted-foreground">
          {row.original.gender === "m" ? "Male" : row.original.gender === "f" ? "Female" : "—"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: () => (
        <Badge variant="outline" className="text-emerald-700 bg-emerald-500/10 border-emerald-500/30">
          Active Student
        </Badge>
      ),
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <Link href="/parent/dashboard">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">My Children Directory</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your registered children, assigned classes, and instructors.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5 text-xs">
          <Users className="h-3.5 w-3.5 mr-1.5" />
          {children.length} Registered Children
        </Badge>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : children.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No children registered</CardTitle>
            <CardDescription>
              There are no student accounts linked to your parent profile yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={children} />
      )}
    </div>
  );
}
