"use client";

import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  FileTextIcon,
  Trash2Icon,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableFeatures } from "../../DataTable/data-table-features";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { toast } from "sonner";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Sheet } from "@/components/ui/sheet";
import { useUserContext } from "@/context/UserProvider";
import { DataTable } from "../../DataTable/DataTable";
import { ExamRecordType } from "@/types/AdminTypes/ExamRecordValuesType";
import ClassTypeCoursesApi from "@/api/ClassTypeCourses/ClassTypeCoursesApi";
import {
  ClassTypeCourse,
  ClassTypeCourseFormValues,
} from "@/types/AdminTypes/ClassTypeCourseValuesTypes";
import {
  AttendanceSession,
  AttendanceSessionFormValues,
} from "@/types/AdminTypes/AttendanceSessionValuesType";
import AttendanceSessionApi from "@/api/AttendanceSession/AttendanceSessionApi";
import { AttendanceSessionForm } from "./AttendanceSessionForm";

const AttendanceSessionsList = () => {
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const { updateAttendanceSession } = useUserContext();

  useEffect(() => {
    const fetchAttendanceSessions = async () => {
      try {
        const fetchedData = await AttendanceSessionApi.getAttendanceSessions();
        setAttendanceSessions(fetchedData.data.attendanceSessions);
      } catch (error) {
        console.log(error);

        throw error;
      } finally {
      }
    };

    fetchAttendanceSessions();
  }, []);
  const columnHelper = createColumnHelper<
    DataTableFeatures,
    AttendanceSession
  >();

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
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            #ID
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor(
      (row) => (row.classe ? `${row.classe?.code}` : "No Classe"),
      {
        id: "classe_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Classe
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const classe = row.original.classe;
          if (!classe) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return <span className="font-medium">{classe.code}</span>;
        },
      },
    ),
    columnHelper.accessor(
      (row) => (row.course ? `${row.course?.name}` : "No Class Type"),
      {
        id: "course_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Course
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const course = row.original.course;
          if (!course) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return <span className="font-medium">{course.name}</span>;
        },
      },
    ),
    columnHelper.accessor(
      (row) =>
        row.teacher
          ? `${row.teacher.first_name} ${row.teacher.last_name}`
          : "No Teacher",
      {
        id: "teacher_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Teacher
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const teacher = row.original.teacher;
          if (!teacher) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return (
            <span className="font-medium">
              {teacher.first_name} {teacher.last_name}
            </span>
          );
        },
      },
    ),
    columnHelper.accessor("date", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("updated_at", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Updated at
            {column.getIsSorted() === "asc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"));

        return date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const { id } = row.original;
        const handleDelete = async () => {
          const deletingLoaderToast = toast.loading("Deleting in progress");
          if (id) {
            const response =
              await AttendanceSessionApi.deteleAttendanceSession(id);
            setAttendanceSessions((prev) =>
              prev.filter((item: AttendanceSession) => item && item?.id !== id),
            );
            toast.dismiss(deletingLoaderToast);
            if (response.status === 200) {
              toast.success("Attendance Session deleted", {
                description: "Attendance Session has been deleetd successfully",
                icon: <Trash2Icon />,
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo"),
                },
                position: "bottom-right",
              });
            }
          }
        };

        const handleUpdatedAttendanceSession = (attendanceSession: any) => {
          setAttendanceSessions((prev: any) =>
            prev.map((p: any) =>
              String(p?.id) === String(attendanceSession?.id)
                ? attendanceSession
                : p,
            ),
          );
        };

        return (
          <div className="flex gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="default">Update</Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto px-5">
                <SheetHeader>
                  <SheetTitle>Edit Attendance Session</SheetTitle>
                  <SheetDescription>
                    Make changes to this attendance session here. Click save
                    when you're done.
                  </SheetDescription>
                </SheetHeader>

                <AttendanceSessionForm
                  values={row.original}
                  handleSubmit={(values: AttendanceSessionFormValues) =>
                    id && updateAttendanceSession(id, values)
                  }
                  mode={"update"}
                  onUpdate={handleUpdatedAttendanceSession}
                />

                <SheetFooter></SheetFooter>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>
                    Delete Attendance Session?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel variant="outline">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    }),
  ]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={attendanceSessions ?? []} />
    </div>
  );
};

export default AttendanceSessionsList;
