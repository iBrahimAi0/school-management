// schema/ExamSchema.ts
import { z } from "zod";

export const ExamSchema = z.object({
  name: z.string().min(1, "Exam name is required"),
  type: z.enum(["efm", "cc"], {
    message: "Please select a type",
  }),

  teacher_id: z.coerce
    .number({ message: "Teacher is required" })
    .min(1, "Please select a teacher"),
  course_id: z.coerce
    .number({ message: "Course is required" })
    .min(1, "Please select a course"),
  classe_id: z.coerce
    .number({ message: "Class is required" })
    .min(1, "Please select a class"),
  // Accepts File, FileList, or undefined (flexible for uploads)
  file_path: z.any().optional(),
});
