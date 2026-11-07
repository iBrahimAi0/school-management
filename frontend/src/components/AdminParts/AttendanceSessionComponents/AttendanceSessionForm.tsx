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
} from "../../ui/select";
import { CourseValuesType } from "@/types/AdminTypes/CourseValuesType";
import CourseApi from "@/api/Course/CourseApi";
import ClassTypeApi from "@/api/ClassType/ClassTypeApi";
import { ClasseType } from "@/types/AdminTypes/ClasseValuesType";
import { TeacherValuesType } from "@/types/AdminTypes/TeacherValuesType";
import TeacherApi from "@/api/Teacher/TeacherApi";
import {
  AttendanceSession,
  AttendanceSessionFormValues,
} from "@/types/AdminTypes/AttendanceSessionValuesType";
import ClasseApi from "@/api/Classe/ClasseApi";

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
          ClasseApi.getClasse(),
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

  const onSubmit = async (values: AttendanceSessionFormValues) => {
    const loaderToast = toast.loading(
      mode === "create"
        ? "Creating Attendance Session..."
        : "Updating Attendance Session...",
    );
    try {
      console.log(values);
      const response = await handleSubmit(values);
      const updatedAttendanceSession = response.data?.attendanceSession;
      if (mode === "update") {
        onUpdate(updatedAttendanceSession);
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
            form.setError(field as keyof AttendanceSessionFormValues, {
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
            <FieldLabel>Classe</FieldLabel>

            <Controller
              control={form.control}
              name="classe_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Classe" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {classes?.map((classe) => (
                        <SelectItem key={classe.id} value={String(classe.id)}>
                          {classe.code}
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
              {form.formState.errors.classe_id.message}
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
                    <SelectValue placeholder="Choose Teacher" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={String(teacher.id)}>
                          {teacher.first_name} {teacher.last_name}
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
              {form.formState.errors.teacher_id.message}
            </p>
          )}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="date">Date</FieldLabel>
                <Input
                  placeholder="12.5"
                  {...form.register("date")}
                  id="date"
                  type="date"
                />
                {form.formState.errors.date && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.date.message}
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
