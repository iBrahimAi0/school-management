import z from "zod";

export const AttendanceSessionSchema = z.object({
  classe_id: z.coerce
    .number({ message: "Classe is required" })
    .min(1, "Please select a Classe"),
  course_id: z.coerce
    .number({ message: "Course is required" })
    .min(1, "Please select a Course"),
  teacher_id: z.coerce
    .number({ message: "Teacher is required" })
    .min(1, "Please select a Teacher"),
  date: z.date("Invalid date"),
});
