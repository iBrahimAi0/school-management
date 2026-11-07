import z from "zod";

export const AttendanceRecordSchema = z.object({
  attendance_session__id: z.coerce
    .number({ message: "Classe is required" })
    .min(1, "Please select a Classe"),
  student_id: z.coerce
    .number({ message: "Course is required" })
    .min(1, "Please select a Course"),
  status: z.enum(["present", "absent", "late"], {
    message: "Please select a Status",
  }),
});
