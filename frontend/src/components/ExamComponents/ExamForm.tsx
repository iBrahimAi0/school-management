import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ExamSchema } from "@/schema/ExamSchema";
import { ExamFormValuesType } from "@/types/ExamValuesType";
import ClasseApi from "@/api/Classe/ClasseApi";
import { CourseValuesType } from "@/types/CourseValuesType";
import { TeacherValuesType } from "@/types/TeacherValuesType";
import TeacherApi from "@/api/Teacher/TeacherApi";
import CourseApi from "@/api/Course/CourseApi";
import { ClasseType } from "@/types/ClasseValuesType";

export function ExamForm({ handleSubmit, values, onUpdate, mode }: any) {
  type ExamValues = z.infer<typeof ExamSchema>;
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const [classes, setClasses] = useState<ClasseType[]>([]);
  const [courses, setCourses] = useState<CourseValuesType[]>([]);
  const [teachers, setTeachers] = useState<TeacherValuesType[]>([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [classesRes, coursesRes, teachersRes] = await Promise.all([
          ClasseApi.getClasse(),
          CourseApi.getCourses(),
          TeacherApi.getTeachers(),
        ]);

        setClasses(classesRes.data.classes || []);
        setCourses(coursesRes.data.courses || []);
        setTeachers(teachersRes.data.teachers || []);
      } catch (error) {
        console.error("Failed to load select data:", error);
      }
    };

    loadFormData();
  }, []);
  const form = useForm<ExamFormValuesType>({
    defaultValues: {
      name: values?.name ?? "",
      type: values?.type ?? "cc",
      file_path: null,

      teacher_id: values?.teacher?.id ? String(values.teacher.id) : "",

      course_id: values?.course?.id ? String(values.course.id) : "",

      classe_id: values?.classe?.id ? String(values.classe.id) : "",
    },
  });
  //new
  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        name: values?.name ?? "",
        type: values?.type ?? "cc",
        file_path: null,

        teacher_id: values?.teacher?.id ? String(values.teacher.id) : "",

        course_id: values?.course?.id ? String(values.course.id) : "",

        classe_id: values?.classe?.id ? String(values.classe.id) : "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: ExamFormValuesType) => {
    const loaderToast = toast.loading(
      mode === "create" ? "Creating exam..." : "Updating exam...",
    );
    try {
      console.log(values);
      const response = await handleSubmit(values);
      const updatedExam = response.data?.exam;
      if (mode === "update") {
        onUpdate(updatedExam);
      } else {
        form.reset();
      }

      if (response.status === 200 || response?.status === 201) {
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
            form.setError(field as keyof ExamFormValuesType, {
              type: "server",
              message: messages[0],
            });
          });

          return;
        }
      }

      console.error("Something went wrong:", error);
    } finally {
      toast.dismiss(loaderToast);
    }
  };
  return (
    <div className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Zod Validation Blocked Submit:", errors);
        })}
        className="space-y-4">
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
            </FieldGroup>
          </FieldSet>
          <Field>
            <FieldLabel>Type</FieldLabel>

            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value="efm">Efm</SelectItem>
                      <SelectItem value="cc">CC</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.type && (
            <p className="text-sm text-destructive">
              {form.formState.errors.type.message}
            </p>
          )}
          <Field>
            <FieldLabel>Teacher</FieldLabel>

            <Controller
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Teacher" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Teacher</SelectLabel>

                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={String(teacher.id)}>
                          {`${teacher.first_name} ${teacher.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.teacher_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.teacher_id?.message}
            </p>
          )}
          <Field>
            <FieldLabel>Course</FieldLabel>

            <Controller
              control={form.control}
              name="course_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Course</SelectLabel>

                      {courses.map((course) => (
                        <SelectItem key={course.id} value={String(course.id)}>
                          {`${course.name}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.course_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.course_id?.message}
            </p>
          )}
          <Field>
            <FieldLabel>Classe</FieldLabel>

            <Controller
              control={form.control}
              name="classe_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a classe" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Classe</SelectLabel>

                      {classes.map((classe) => (
                        <SelectItem key={classe.id} value={String(classe.id)}>
                          {`${classe.name}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.classe_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.classe_id?.message}
            </p>
          )}
          <Field>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="file_path">File</FieldLabel>
                <Controller
                  control={form.control}
                  name="file_path"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <Input
                      {...fieldProps}
                      type="file"
                      id="file_path"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        console.log(file); // 👈 Grab index 0
                        onChange(file || null);
                      }}
                    />
                  )}
                />
                {form.formState.errors.file_path && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.file_path.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </Field>
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
