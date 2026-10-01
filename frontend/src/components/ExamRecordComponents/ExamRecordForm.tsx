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
import { ExamFormValuesType, ExamType } from "@/types/ExamValuesType";
import ClasseApi from "@/api/Classe/ClasseApi";
import { CourseValuesType } from "@/types/CourseValuesType";
import { TeacherValuesType } from "@/types/TeacherValuesType";
import TeacherApi from "@/api/Teacher/TeacherApi";
import CourseApi from "@/api/Course/CourseApi";
import { ClasseType } from "@/types/ClasseValuesType";
import { ExamRecordSchema } from "@/schema/ExamRecordSchema";
import { ExamRecordFormValuesType } from "@/types/ExamRecordValuesType";
import { StudentValuesType } from "@/types/StudentValuesType";
import { StudentApi } from "@/api/Student/StudentApi";
import ExamApi from "@/api/Exam/ExamApi";

export function ExamRecordForm({ handleSubmit, values, onUpdate, mode }: any) {
  type ExamValues = z.infer<typeof ExamRecordSchema>;
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const [students, setStudents] = useState<StudentValuesType[]>([]);
  const [exams, setExams] = useState<ExamType[]>([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [classesRes, coursesRes] = await Promise.all([
          StudentApi.getStudents(),
          ExamApi.getExams(),
        ]);

        setStudents(classesRes.data.students || []);
        setExams(coursesRes.data.exams || []);
      } catch (error) {
        console.error("Failed to load select data:", error);
      }
    };

    loadFormData();
  }, []);
  const form = useForm<ExamRecordFormValuesType>({
    defaultValues: {
      exam_id: values?.exam?.id ? String(values.exam.id) : "",
      user_id: values?.student?.id ? String(values.student.id) : "",
      comment: values?.comment ?? "",
      note: values?.note ?? "",
    },
  });
  //new
  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        exam_id: values?.exam?.id ? String(values.exam.id) : "",
        user_id: values?.student?.id ? String(values.student.id) : "",
        comment: values?.comment ?? "",
        note: values?.note ?? "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: ExamRecordFormValuesType) => {
    const loaderToast = toast.loading(
      mode === "create" ? "Creating exam..." : "Updating exam...",
    );
    try {
      console.log(values);
      const response = await handleSubmit(values);
      const updatedExamRecord = response.data?.examRecord;
      if (mode === "update") {
        onUpdate(updatedExamRecord);
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
            form.setError(field as keyof ExamRecordFormValuesType, {
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
            <FieldLabel>Exam</FieldLabel>

            <Controller
              control={form.control}
              name="exam_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Exam" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {exams?.map((exam) => (
                        <SelectItem key={exam.id} value={String(exam.id)}>
                          {exam.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.exam_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.exam_id.message}
            </p>
          )}
          <Field>
            <FieldLabel>Student</FieldLabel>

            <Controller
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Student" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={String(student.id)}>
                          {student.first_name} {student.last_name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.user_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.user_id.message}
            </p>
          )}
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="note">Note</FieldLabel>
                <Input
                  placeholder="12.5"
                  {...form.register("note")}
                  id="note"
                />
                {form.formState.errors.note && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.note.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Comment</FieldLabel>
                <Input
                  placeholder="Comment"
                  {...form.register("comment")}
                  id="comment"
                />
                {form.formState.errors.comment && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.comment.message}
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
