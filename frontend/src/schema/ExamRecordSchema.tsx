import z from "zod";

export const ExamRecordSchema = z.object({
  exam_id: z.coerce
    .number({ message: "Exam is required" })
    .min(1, "Please select a Exam"),
  student_id: z.coerce
    .number({ message: "Student is required" })
    .min(1, "Please select a Student"),
  note: z.float32("Note is invalid"),

  comment: z.string().min(5, "Comment must be at least 5 characters"),
});
