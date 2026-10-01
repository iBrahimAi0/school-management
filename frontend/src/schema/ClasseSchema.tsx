import z from "zod";

export const ClasseSchema = z.object({
  name: z.string().min(3, "Name name must be at least 4 characters"),

  code: z.string().min(3, "code name must be at least 3 characters"),
  class_type_id: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z.number("Class type id is required").positive("Class type id is required"),
  ),
});
