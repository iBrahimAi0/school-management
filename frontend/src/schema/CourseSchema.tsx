import z from "zod";

export const CourseSchema = z.object({
  name: z.string().min(3, "Name name must be at least 4 characters"),

  description: z
    .string()
    .min(10, "Description name must be at least 3 characters"),
});
