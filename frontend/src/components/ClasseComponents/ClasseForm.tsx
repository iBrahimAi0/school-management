import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ClassTypeSchema } from "@/schema/ClassTypeSchema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ClassTypeApi from "@/api/ClassType/ClassTypeApi";
import { ClasseSchema } from "@/schema/ClasseSchema";
import { ClasseFormType, ClasseType } from "@/types/ClasseValuesType";

export function ClasseForm({ handleSubmit, values, onUpdate, mode }: any) {
  type ClasseValues = z.infer<typeof ClasseSchema>;
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const [classTypes, setClassTypes] = useState<ClasseType[]>([]);

  useEffect(() => {
    const fetchClassTypes = async () => {
      const fetchedData = await ClassTypeApi.getClassTypes();
      setClassTypes(fetchedData.data.classTypes);
    };
    fetchClassTypes();
  }, []);
  const form = useForm<ClasseFormType>({
    defaultValues: {
      //new
      name: values?.name ?? "",
      code: values?.code ?? "",
      class_type_id: values?.class_type_id ?? "",
    },
  });
  //new
  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        name: values?.name ?? "",
        code: values?.code ?? "",
        class_type_id: values?.class_type_id ?? "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: ClasseFormType) => {
    try {
      const loaderToast = toast.loading(
        mode === "create" ? "Creating class type..." : "Updating class type...",
      );
      const response = await handleSubmit(values);
      const updatedClassType = response.data?.classe;
      if (mode === "update") {
        onUpdate(updatedClassType);
      } else {
        form.reset();
      }
      toast.dismiss(loaderToast);
      if (response.status === 200) {
        toast.success("Success", {
          description: response.data.message,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          position: "bottom-right",
        });
      }

      return response;
    } catch (error: unknown) {
      if (isAxiosError<LaravelValidationResponse>(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422 && data?.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            form.setError(field as keyof ClasseFormType, {
              type: "server",
              message: messages[0],
            });
          });

          return;
        }
      }

      console.error("Something went wrong:", error);
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  placeholder="Name"
                  {...form.register("name")}
                  id="name"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="code">Code</FieldLabel>
                <Input
                  {...form.register("code")}
                  placeholder="Code"
                  id="code"
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <FieldLabel>Class Type</FieldLabel>

            <Controller
              control={form.control}
              name="class_type_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Class Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Class Type</SelectLabel>

                      {classTypes.map((classType: any) => (
                        <SelectItem
                          key={classType.id}
                          value={String(classType.id)}>
                          {classType.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.class_type_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.class_type_id.message}
            </p>
          )}
          <Field orientation="horizontal">
            <Button type="submit">{values ? "Update" : "Create"}</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}>
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
