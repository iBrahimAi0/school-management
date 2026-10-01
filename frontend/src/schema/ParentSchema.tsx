import z from "zod";

export const ParentSchema = z
  .object({
    first_name: z
      .string()
      .min(2, "First name must be at least 2 characters"),

    last_name: z
      .string()
      .min(2, "Last name must be at least 2 characters"),

    date_of_birth: z
    .string()
    .min(1, "Date of birth is required"),

    gender: z.enum(["m", "f"], {
      message: "Please select a gender",
    }),

    blood_type: z
      .string()
      .min(1, "Please select a blood type"),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters"),

    phone: z
      .string()
      .min(10, "Please enter a valid phone number"),

    email: z
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    password_confirmation: z.string(),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    }
  );

export type ParentValues = z.infer<typeof ParentSchema>;