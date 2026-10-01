import z from "zod";

export const ClassTypeSchema = z.object({
  name: z.string().min(3, "Name name must be at least 4 characters"),

  code: z.string().min(3, "code name must be at least 3 characters"),
});

export type ClassTypeValues = z.infer<typeof ClassTypeSchema>;
