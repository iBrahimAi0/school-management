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
import { CourseValuesType } from "@/types/CourseValuesType";
import CourseApi from "@/api/Course/CourseApi";
import { ClassTypeValues } from "@/schema/ClassTypeSchema";
import ClassTypeApi from "@/api/ClassType/ClassTypeApi";
import type { ClassTypeCourseFormValues } from "@/types/ClassTypeCourseValuesTypes";
import { ClasseType } from "@/types/ClasseValuesType";
import { TeacherValuesType } from "@/types/TeacherValuesType";
import TeacherApi from "@/api/Teacher/TeacherApi";
import { AttendanceSessionFormValues } from "@/types/AttendanceSessionValuesType";

export function AttendanceSessionForm({
  handleSubmit,
  values,
  onUpdate,
  mode,
}: any) {
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
        const [coursesRes, classesRes, teachersRes] = await Promise.all([
          CourseApi.getCourses(),
          ClassTypeApi.getClassTypes(),
          TeacherApi.getTeachers(),
        ]);

        setCourses(coursesRes.data.courses || []);
        setClasses(classesRes.data.classes || []);
        setTeachers(teachersRes.data.teachers || []);
      } catch (error) {
        console.error("Failed to load select data:", error);
      }
    };

    loadFormData();
  }, []);
  const form = useForm<AttendanceSessionFormValues>({
    defaultValues: {
      classe_id: values?.classe?.id ? String(values.classe.id) : "",
      course_id: values?.course?.id ? String(values.course.id) : "",
      teacher_id: values?.teacher?.id ? String(values.teacher.id) : "",
      date: values?.date ?? "",
    },
  });
  //new
  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        classe_id: values?.classe?.id ? String(values.classe.id) : "",
        course_id: values?.course?.id ? String(values.course.id) : "",
        teacher_id: values?.teacher?.id ? String(values.teacher.id) : "",
        date: values?.date ?? "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: ClassTypeCourseFormValues) => {
    const loaderToast = toast.loading(
      mode === "create"
        ? "Creating Class Type Course..."
        : "Updating  Class Type Course...",
    );
    try {
      console.log(values);
      const response = await handleSubmit(values);
      const updatedClassTypeCourse = response.data?.classTypeCourse;
      if (mode === "update") {
        onUpdate(updatedClassTypeCourse);
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
            form.setError(field as keyof ClassTypeCourseFormValues, {
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
                      {classTypes?.map((classType) => (
                        <SelectItem
                          key={classType.id}
                          value={String(classType.id)}>
                          {classType.code}
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
                    <SelectValue placeholder="Choose Course" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={String(course.id)}>
                          {course.name}
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
              {form.formState.errors.course_id.message}
            </p>
          )}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="coef">coefficient</FieldLabel>
                <Input
                  placeholder="12.5"
                  {...form.register("coef")}
                  id="coef"
                />
                {form.formState.errors.coef && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.coef.message}
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
