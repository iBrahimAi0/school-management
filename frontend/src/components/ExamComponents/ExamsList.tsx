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
import ClasseApi from "@/api/Classe/ClasseApi";
import { ExamForm } from "./ExamForm";
import ExamApi from "@/api/Exam/ExamApi";
import { ExamType } from "@/types/ExamValuesType";

const ExamsList = () => {
  const [exams, setExams] = useState([]);
  const { updateExam } = useUserContext();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const fetchedData = await ExamApi.getExams();
        setExams(fetchedData.data.exams);
      } catch (error) {
        console.log(error);

        throw error;
      } finally {
      }
    };

    fetchExams();
  }, []);
  const columnHelper = createColumnHelper<DataTableFeatures, ExamType>();

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
    columnHelper.accessor("name", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Name
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
        row.teacher
          ? `${row.teacher.first_name} ${row.teacher.last_name}`
          : "No Teacher",
      {
        id: "teacher",
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

    columnHelper.accessor(
      (row) => (row.course ? `${row.course.name}` : "No Course"),
      {
        id: "course",
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
      (row) => (row.classe ? `${row.classe.code}` : "No Classe"),
      {
        id: "classe",
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
    columnHelper.display({
      id: "document",
      header: "Document",
      cell: ({ row }) => {
        const exam = row.original;

        if (!exam.file_path) {
          return (
            <span className="text-xs italic text-muted-foreground">
              No file
            </span>
          );
        }

        const handleViewFile = async () => {
          try {
            await ExamApi.viewExamFile(exam.id);
          } catch (error) {
            console.error("Failed to open document:", error);
            toast.error("Could not load document or unauthorized");
          }
        };

        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewFile}
            className="inline-flex h-auto p-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline hover:bg-transparent">
            <FileTextIcon className="h-4 w-4" />
            <span className="max-w-[160px] truncate">
              {exam.original_name || "View PDF"}
            </span>
            <ExternalLinkIcon className="h-3 w-3 opacity-70" />
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
        const { id, name } = row.original;
        const handleDelete = async () => {
          const deletingLoaderToast = toast.loading("Deleting in progress");
          if (id) {
            const response = await ExamApi.deleteExam(id);
            setExams((prev) =>
              prev.filter((item: ExamType) => item && item?.id !== id),
            );
            toast.dismiss(deletingLoaderToast);
            if (response.status === 200) {
              toast.success("Exam deleted", {
                description: "Exam has been deleetd successfully",
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

        const handleUpdatedExam = (exam: any) => {
          setExams((prev: any) =>
            prev.map((p: any) =>
              String(p?.id) === String(exam?.id) ? exam : p,
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
                  <SheetTitle>Edit Exam</SheetTitle>
                  <SheetDescription>
                    Make changes to this exam here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>

                <ExamForm
                  values={row.original}
                  handleSubmit={(values: ExamType) =>
                    id && updateExam(id, values)
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
                  <AlertDialogTitle>Delete Exam?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{name}</strong>.
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
      <DataTable columns={columns} data={exams} />
    </div>
  );
};

export default ExamsList;
