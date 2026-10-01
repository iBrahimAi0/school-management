import z from "zod";

export const ClassTypeCourseSchema = z.object({
  class_type_id: z.coerce
    .number({ message: "Class Type is required" })
    .min(1, "Please select a Class Type"),
  course_type: z.coerce
    .number({ message: "Course is required" })
    .min(1, "Please select a Course"),
  coef: z.number("Coef is invalid"),
});
