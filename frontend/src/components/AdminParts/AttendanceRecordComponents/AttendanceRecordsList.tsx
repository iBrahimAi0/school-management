"use client";

import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon } from "lucide-react";
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
import AttendanceRecordApi from "@/api/AttendanceRecord/AttendanceRecordApi";
import {
  AttendanceRecord,
  AttendanceRecordFormValues,
} from "@/types/AdminTypes/AttendanceRecordValuesType";
import { AttendanceRecordForm } from "./AttendanceRecordForm";

const AttendanceRecordsList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const { updateAttendanceRecord } = useUserContext();

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        const fetchedData = await AttendanceRecordApi.getAttendanceRecords();
        setAttendanceRecords(fetchedData.data.attendanceRecords);
      } catch (error) {
        console.log(error);

        throw error;
      } finally {
      }
    };

    fetchAttendanceRecords();
  }, []);
  const columnHelper = createColumnHelper<
    DataTableFeatures,
    AttendanceRecord
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
      (row) =>
        row.attendance_session
          ? `${row.attendance_session?.course}`
          : "No Classe",
      {
        id: "attendance_session_id",
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
          const attendanceSession = row.original.attendance_session;
          if (!attendanceSession) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return (
            <span className="font-medium">{attendanceSession.course}</span>
          );
        },
      },
    ),
    columnHelper.accessor(
      (row) => (row.student ? `${row.student_id}` : "No Class Type"),
      {
        id: "user_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Student
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const student = row.original.student;
          if (!student) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return (
            <span className="font-medium">
              {student.first_name} {student.last_name}
            </span>
          );
        },
      },
    ),

    columnHelper.accessor("status", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Status
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
              await AttendanceRecordApi.deteleAttendanceRecord(id);
            setAttendanceRecords((prev) =>
              prev.filter((item: AttendanceRecord) => item && item?.id !== id),
            );
            toast.dismiss(deletingLoaderToast);
            if (response.status === 200) {
              toast.success("Attendance Record deleted", {
                description: "Attendance Record has been deleetd successfully",
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

        const handleUpdatedAttendanceRecord = (attendanceRecord: any) => {
          setAttendanceRecords((prev: any) =>
            prev.map((p: any) =>
              String(p?.id) === String(attendanceRecord?.id)
                ? attendanceRecord
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
                  <SheetTitle>Edit Attendance Record</SheetTitle>
                  <SheetDescription>
                    Make changes to this attendance record here. Click save when
                    you're done.
                  </SheetDescription>
                </SheetHeader>

                <AttendanceRecordForm
                  values={row.original}
                  handleSubmit={(values: AttendanceRecordFormValues) =>
                    id && updateAttendanceRecord(id, values)
                  }
                  mode={"update"}
                  onUpdate={handleUpdatedAttendanceRecord}
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
                    Delete Attendance Record ?
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
      <DataTable columns={columns} data={attendanceRecords ?? []} />
    </div>
  );
};

export default AttendanceRecordsList;
