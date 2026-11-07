import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { AttendanceSession } from "@/types/AdminTypes/AttendanceSessionValuesType";
import AttendanceSessionApi from "@/api/AttendanceSession/AttendanceSessionApi";
import { StudentApi } from "@/api/Student/StudentApi";
import { AttendanceRecordFormValues } from "@/types/AdminTypes/AttendanceRecordValuesType";
import { StudentValuesType } from "@/types/AdminTypes/StudentValuesType";

export function AttendanceRecordForm({
  handleSubmit,
  values,
  onUpdate,
  mode,
}: any) {
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const [attendanceSessions, setAttendanceSessions] = useState<
    AttendanceSession[]
  >([]);
  const [students, setStudents] = useState<StudentValuesType[]>([]);

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [studentsRes, attendanceSessionsRes] = await Promise.all([
          StudentApi.getStudents(),
          AttendanceSessionApi.getAttendanceSessions(),
        ]);

        setStudents(studentsRes.data.students || []);
        setAttendanceSessions(
          attendanceSessionsRes.data.attendanceSessions || [],
        );
      } catch (error) {
        console.error("Failed to load select data:", error);
      }
    };

    loadFormData();
  }, []);
  const form = useForm<AttendanceRecordFormValues>({
    defaultValues: {
      attendance_session_id: values?.attendanceSession?.id
        ? String(values.attendanceSession.id)
        : "",
      user_id: values?.user?.id ? String(values.user.id) : "",
      status: values?.status ?? "",
    },
  });
  //new
  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        attendance_session_id: values?.attendanceSession?.id
          ? String(values.attendanceSession.id)
          : "",
        user_id: values?.user?.id ? String(values.user.id) : "",
        status: values?.status ?? "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: AttendanceRecordFormValues) => {
    const loaderToast = toast.loading(
      mode === "create"
        ? "Creating Attendance Record..."
        : "Updating Attendance Record...",
    );
    try {
      console.log(values);
      const response = await handleSubmit(values);
      const updatedAttendanceRecord = response.data?.attendanceRecord;
      if (mode === "update") {
        onUpdate(updatedAttendanceRecord);
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
            form.setError(field as keyof AttendanceRecordFormValues, {
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
            <FieldLabel>Attendance Session</FieldLabel>

            <Controller
              control={form.control}
              name="attendance_session_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Attendance Session" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {attendanceSessions?.map((attendanceSession) => (
                        <SelectItem
                          key={attendanceSession.id}
                          value={String(attendanceSession.id)}>
                          {attendanceSession.course?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.attendance_session_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.attendance_session_id.message}
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
          <Field>
            <FieldLabel>Status</FieldLabel>

            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Status" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem key="1" value="present">
                        Present
                      </SelectItem>
                      <SelectItem key="2" value="absent">
                        Absent
                      </SelectItem>
                      <SelectItem key="3" value="late">
                        Late
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.status && (
            <p className="text-sm text-destructive">
              {form.formState.errors.status.message}
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
