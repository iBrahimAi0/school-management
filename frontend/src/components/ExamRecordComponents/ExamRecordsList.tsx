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
import { DataTableFeatures } from "../DataTable/data-table-features";
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
} from "../ui/alert-dialog";
import { toast } from "sonner";
import {
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Sheet } from "@/components/ui/sheet";
import { useUserContext } from "@/context/UserProvider";
import { DataTable } from "../DataTable/DataTable";
import { ExamRecordType } from "@/types/ExamRecordValuesType";
import ExamRecordApi from "@/api/ExamRecord/ExamRecordApi";
import { ExamRecordForm } from "./ExamRecordForm";

const ExamRecordsList = () => {
  const [examRecords, setExamRecords] = useState([]);
  const { updateExamRecord } = useUserContext();

  useEffect(() => {
    const fetchExamRecords = async () => {
      try {
        const fetchedData = await ExamRecordApi.getExamRecords();
        setExamRecords(fetchedData.data.examRecords);
      } catch (error) {
        console.log(error);

        throw error;
      } finally {
      }
    };

    fetchExamRecords();
  }, []);
  const columnHelper = createColumnHelper<DataTableFeatures, ExamRecordType>();

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
    columnHelper.accessor("note", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Note
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("comment", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Comment
            {column.getIsSorted() === "asc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor(
      (row) =>
        row.student
          ? `${row.student.first_name} ${row.student.last_name}`
          : "No Teacher",
      {
        id: "student",
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

    columnHelper.accessor(
      (row) => (row.exam ? `${row.exam.name}` : "No Exam"),
      {
        id: "exam",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Exam
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const exam = row.original.exam;
          if (!exam) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return <span className="font-medium">{exam.name}</span>;
        },
      },
    ),

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
        const { id, student } = row.original;
        const handleDelete = async () => {
          const deletingLoaderToast = toast.loading("Deleting in progress");
          if (id) {
            const response = await ExamRecordApi.deteleExamRecord(id);
            setExamRecords((prev) =>
              prev.filter((item: ExamRecordType) => item && item?.id !== id),
            );
            toast.dismiss(deletingLoaderToast);
            if (response.status === 200) {
              toast.success("Exam Record deleted", {
                description: "Exam Record has been deleetd successfully",
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

        const handleUpdatedExam = (examRecord: any) => {
          setExamRecords((prev: any) =>
            prev.map((p: any) =>
              String(p?.id) === String(examRecord?.id) ? examRecord : p,
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
                  <SheetTitle>Edit Exam Record</SheetTitle>
                  <SheetDescription>
                    Make changes to this exam record here. Click save when
                    you're done.
                  </SheetDescription>
                </SheetHeader>

                <ExamRecordForm
                  values={row.original}
                  handleSubmit={(values: ExamRecordType) =>
                    id && updateExamRecord(id, values)
                  }
                  mode={"update"}
                  onUpdate={handleUpdatedExam}
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
                  <AlertDialogTitle>Delete Exam Record?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete{" "}
                    <strong>{`${student?.first_name} ${student?.last_name} `}</strong>
                    Exam Record.
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
      <DataTable columns={columns} data={examRecords} />
    </div>
  );
};

export default ExamRecordsList;
