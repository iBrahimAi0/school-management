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
import { ClassTypeCourseForm } from "./ClassTypeCourseForm";

const ClassTypeCoursesList = () => {
  const [classTypeCourses, setClassTypeCourses] = useState([]);
  const { updateClassTypeCourse } = useUserContext();

  useEffect(() => {
    const fetchClassTypeCourses = async () => {
      try {
        const fetchedData = await ClassTypeCoursesApi.getClassTypeCourses();
        setClassTypeCourses(fetchedData.data.classTypeCourses);
      } catch (error) {
        console.log(error);

        throw error;
      } finally {
      }
    };

    fetchClassTypeCourses();
  }, []);
  const columnHelper = createColumnHelper<DataTableFeatures, ClassTypeCourse>();

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
      (row) => (row.class_type ? `${row.class_type.code}` : "No Class Type"),
      {
        id: "class_type_id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }>
              Class Type
              {column.getIsSorted() === "asc" ? (
                <ArrowUpIcon className="ml-2 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          const classType = row.original.class_type;
          if (!classType) {
            return (
              <span className="text-muted-foreground italic text-sm">
                Not assigned
              </span>
            );
          }

          return <span className="font-medium">{classType.code}</span>;
        },
      },
    ),
    columnHelper.accessor("coef", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Coefficient
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
        const { id, course, class_type } = row.original;
        const handleDelete = async () => {
          const deletingLoaderToast = toast.loading("Deleting in progress");
          if (id) {
            const response =
              await ClassTypeCoursesApi.deteleClassTypeCourse(id);
            setClassTypeCourses((prev) =>
              prev.filter((item: ClassTypeCourse) => item && item?.id !== id),
            );
            toast.dismiss(deletingLoaderToast);
            if (response.status === 200) {
              toast.success("Class Type Course deleted", {
                description: "Class Type Course has been deleetd successfully",
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

        const handleUpdatedClassTypeCourse = (classTypeCourse: any) => {
          setClassTypeCourses((prev: any) =>
            prev.map((p: any) =>
              String(p?.id) === String(classTypeCourse?.id)
                ? classTypeCourse
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
                  <SheetTitle>Edit Class Type Course</SheetTitle>
                  <SheetDescription>
                    Make changes to this class type course here. Click save when
                    you're done.
                  </SheetDescription>
                </SheetHeader>

                <ClassTypeCourseForm
                  values={row.original}
                  handleSubmit={(values: ClassTypeCourseFormValues) =>
                    id && updateClassTypeCourse(id, values)
                  }
                  mode={"update"}
                  onUpdate={handleUpdatedClassTypeCourse}
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
                  <AlertDialogTitle>Delete Class type course?</AlertDialogTitle>
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
      <DataTable columns={columns} data={classTypeCourses} />
    </div>
  );
};

export default ClassTypeCoursesList;
