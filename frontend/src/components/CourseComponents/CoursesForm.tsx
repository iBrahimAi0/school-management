import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useEffect } from "react";
import { CourseSchema } from "@/schema/CourseSchema";
import { Textarea } from "../ui/textarea";

export function CourseForm({ handleSubmit, values, onUpdate, mode }: any) {
  type CourseValues = z.infer<typeof CourseSchema>;
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const form = useForm<
    z.input<typeof CourseSchema>,
    unknown,
    z.output<typeof CourseSchema>
  >({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      //new
      name: values?.name ?? "",
      description: values?.description ?? "",
    },
  });
  //new
  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        name: values?.name ?? "",
        description: values?.description ?? "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: CourseValues) => {
    try {
      const loaderToast = toast.loading(
        mode === "create" ? "Creating course..." : "Updating course...",
      );
      const response = await handleSubmit(values);
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
        const updatedCourse = response.data?.course;
        if (mode === "update" && onUpdate) {
          onUpdate(updatedCourse);
        } else {
          form.reset();
        }
      }

      return response;
    } catch (error: unknown) {
      if (isAxiosError<LaravelValidationResponse>(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422 && data?.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            form.setError(field as keyof CourseValues, {
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
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  placeholder="Add Description"
                  className="resize-none"
                  {...form.register("description")}
                  id="description"
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
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
