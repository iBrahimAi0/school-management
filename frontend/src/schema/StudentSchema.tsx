import z from "zod";

export const StudentSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),

    last_name: z.string().min(2, "Last name must be at least 2 characters"),

    date_of_birth: z.string().min(1, "Date of birth is required"),

    gender: z.enum(["m", "f"], {
      message: "Please select a gender",
    }),

    blood_type: z.string("Blood type is required"),
    email: z.email("Please enter a valid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    password_confirmation: z.string(),

    student_parent_id: z.preprocess(
      (val) =>
        val === "" || val === null || val === undefined
          ? undefined
          : Number(val),
      z.number("Please choose a parent").positive("Please choose a parent"),
    ),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });
