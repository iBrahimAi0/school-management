"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schema/loginSchema";
import * as z from "zod";
import { Loader } from "lucide-react";
import { useUserContext } from "@/context/UserProvider";
import { isAxiosError } from "axios";

type LoginErrorResponse = {
  errors?: {
    email?: string[];
  };
};

export function StudentLogin() {
  const { login } = useUserContext();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values);
      // Dynamic redirection is handled inside login() based on authData.role
    } catch (error: unknown) {
      if (isAxiosError<LoginErrorResponse>(error)) {
        if (!error.response) {
          form.setError("email", {
            message:
              "Network Error: Unable to reach the backend API server. Please check CORS and network settings.",
          });
          return;
        }
        const response = error.response.data as any;
        form.setError("email", {
          message:
            response?.errors?.email?.[0] ??
            response?.message ??
            "Invalid credentials. Please verify your email and password.",
        });
      } else {
        form.setError("email", {
          message: "Unable to log in. Please check your details and try again.",
        });
      }
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", pass, { shouldValidate: true });
  };

  return (
    <Card className="w-full sm:max-w-md shadow-lg border-muted/80">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sign in with your Admin, Teacher, Student, or Parent account.
        </p>
      </CardHeader>
      <CardContent>
        {/* Quick Demo Fill Buttons */}
        <div className="mb-4 rounded-lg border bg-muted/40 p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8 px-2"
              onClick={() => fillCredentials("admin@example.com", "admin123456")}
            >
              🔑 Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8 px-2"
              onClick={() => fillCredentials("teacher@example.com", "teacher123456")}
            >
              👨‍🏫 Teacher
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8 px-2"
              onClick={() => fillCredentials("student@example.com", "student123456")}
            >
              🎓 Student
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs justify-start h-8 px-2"
              onClick={() => fillCredentials("parent@example.com", "parent123456")}
            >
              👨‍👩‍👧 Parent
            </Button>
          </div>
        </div>

        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-input-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="user@example.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="py-3">
                  <FieldLabel htmlFor="form-rhf-input-password">
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    type="password"
                    id="form-rhf-input-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            disabled={isSubmitting}
            type="submit"
            form="form-rhf-input"
            className="w-full"
          >
            {isSubmitting && <Loader className="animate-spin mr-2" />}
            Login
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
