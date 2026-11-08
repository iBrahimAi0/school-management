"use client";

import { useEffect, useState } from "react";
import ParentApi from "@/api/Parent/ParentApi";
import { DataTable } from "../../DataTable/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, Trash2Icon, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { DataTableFeatures } from "../../DataTable/data-table-features";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "../../ui/input";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../ui/sheet";
import { Sheet } from "@/components/ui/sheet";
import { ParentsForm } from "./ParentsForm";
import { AssignStudentModal } from "./AssignStudentModal";
import { ParentValuesType } from "@/types/AdminTypes/ParentValuesType";
import { useUserContext } from "@/context/UserProvider";

export type ParentsValuesTypes = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "m" | "f";
  blood_type: string;
  address: string;
  phone: string;
  email: string;
  updated_at: string;
};
const ParentsList = () => {
  const [data, setData] = useState<any[]>([]);
  const [assignModalParent, setAssignModalParent] = useState<any | null>(null);
  const { updateParent } = useUserContext();

  const fetchParents = async () => {
    try {
      const response = await ParentApi.getParents();
      const list = response.data?.data ?? response.data ?? [];
      setData(list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);
  const columnHelper = createColumnHelper<
    DataTableFeatures,
    ParentsValuesTypes
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
    columnHelper.accessor("first_name", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            First Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("last_name", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Last Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("date_of_birth", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Date of Birth
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.date_of_birth);

        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        return format(date, "dd/MM/yyyy");
      },
    }),
    columnHelper.accessor("gender", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Gender
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("blood_type", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Blood Type
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("address", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Address
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("phone", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Phone
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Email
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
      (row: any) => row.students_count ?? row.students?.length ?? 0,
      {
        id: "children_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            Children
            {column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }: any) => {
          const count =
            row.original.students_count ?? row.original.students?.length ?? 0;
          return (
            <Badge
              variant="outline"
              className="font-mono text-xs flex items-center gap-1 w-fit bg-muted/40">
              <Users className="h-3 w-3 text-primary" />
              {count} {count === 1 ? "Child" : "Children"}
            </Badge>
          );
        },
      }
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
        const { id, first_name, last_name } = row.original;
        const handleDelete = async () => {
          let deletingLoaderToast;
          try {
            deletingLoaderToast = toast.loading("Deleting in progress");
            const response = await ParentApi.deleteParent(id);
            const deletedId = response.data?.data?.id ?? id;
            setData((prev: any) => prev.filter((p: any) => p.id !== deletedId));
            toast.dismiss(deletingLoaderToast);
            toast.success("Parent deleted", {
              description: "Parent has been deleted successfully",
              position: "bottom-right",
            });
          } catch (error) {
            if (deletingLoaderToast) toast.dismiss(deletingLoaderToast);
            toast.error("Failed to delete parent.");
            console.error(error);
          }
        };

        const handleUpdatedParent = (parent: any) => {
          setData((prev: any) =>
            prev.map((p: any) => (p.id === parent.id ? parent : p)),
          );
        };

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setAssignModalParent(row.original)}>
              <Users className="h-3.5 w-3.5 text-primary" />
              Children
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button size="sm" variant="default">Update</Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto px-5">
                <SheetHeader>
                  <SheetTitle>Edit Parent</SheetTitle>
                  <SheetDescription>
                    Make changes to this parent here. Click save when you're
                    done.
                  </SheetDescription>
                </SheetHeader>

                <ParentsForm
                  values={row.original}
                  handleSubmit={(values: ParentValuesType) =>
                    updateParent(values, id)
                  }
                  onUpdate={handleUpdatedParent}
                  mode="update"
                />

                <SheetFooter></SheetFooter>
              </SheetContent>
            </Sheet>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                    <Trash2Icon />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete Parent?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete{" "}
                    <strong>{first_name + " " + last_name}</strong>.
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
      <DataTable columns={columns} data={data} />

      <AssignStudentModal
        isOpen={!!assignModalParent}
        parent={assignModalParent}
        onClose={() => setAssignModalParent(null)}
        onChanged={fetchParents}
      />
    </div>
  );
};

export default ParentsList;
