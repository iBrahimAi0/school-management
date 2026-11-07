"use client";

import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Mail,
  Users,
} from "lucide-react";
import { StudentApi } from "@/api/Student/StudentApi";
import { SpinnerSize } from "@/components/Spinners/Spiner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserContext } from "@/context/UserProvider";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";
import { DataTable } from "@/components/DataTable/DataTable";
import { DataTableFeatures } from "@/components/DataTable/data-table-features";

export default function TeacherStudents() {
  const [students, setStudents] = useState<StudentTypes[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUserContext();

  useEffect(() => {
    if (!user?.id) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await StudentApi.getTeacherStudents(user.id);
        setStudents(response.data.teacherStudents || []);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user?.id]);

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
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Students</h1>
          <p className="text-sm text-muted-foreground">
            Complete directory of all students currently registered in your classes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <Users className="h-3.5 w-3.5" />
            <span>{students.length} Total Students</span>
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <SpinnerSize />
        </div>
      ) : students.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>No students found</CardTitle>
            <CardDescription>
              No students are currently registered in your classes.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <DataTable columns={columns} data={students} />
      )}
    </div>
  );
}
