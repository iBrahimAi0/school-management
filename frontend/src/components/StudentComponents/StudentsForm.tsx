import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { StudentSchema } from "@/schema/StudentSchema";
import { useEffect, useState } from "react";
import ParentApi from "@/api/Parent/ParentApi";

interface Parent {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "f" | "m";
  blood_type: string;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export function StudentsForm({ handleSubmit, values, onUpdate, mode }: any) {
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const [parents, setParents] = useState<Parent[]>([]);

  useEffect(() => {
    const fetchParents = async () => {
      const studentParent = await ParentApi.getParents();

      const { data } = studentParent.data;

      setParents(data);
    };

    fetchParents();
  }, []);
  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    // If it's already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  type StudentValues = z.infer<typeof StudentSchema>;
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };
  const form = useForm<
    z.input<typeof StudentSchema>,
    unknown,
    z.output<typeof StudentSchema>
  >({
    resolver: zodResolver(StudentSchema),
    defaultValues: {
      //new
      first_name: values?.first_name ?? "",
      last_name: values?.last_name ?? "",
      date_of_birth: formatDateForInput(values?.date_of_birth) ?? "",
      gender: values?.gender ?? "m",
      blood_type: values?.blood_type ?? "",
      student_parent_id: values?.student_parent_id,
      email: values?.email ?? "",
      password: "",
      password_confirmation: "",
    },
  });
  //new
  useEffect(() => {
    if (values) {
      form.reset({
        first_name: values.first_name ?? "",
        last_name: values.last_name ?? "",
        date_of_birth: formatDateForInput(values?.date_of_birth) ?? "",
        gender: values.gender ?? "m",
        blood_type: values.blood_type ?? "",
        student_parent_id: values.student_parent_id,
        email: values.email ?? "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [values, form]);

  const onSubmit = async (values: StudentValues) => {
    try {
      const loaderToast = toast.loading(
        mode === "create" ? "Creating student..." : "Updating student...",
      );

      const response = await handleSubmit(values);
      if (mode === "update" && onUpdate) {
        onUpdate(response);
      }
      toast.dismiss(loaderToast);
      if (response.status === 200) {
        toast.success("Success", {
          description: response.data.message,
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
          position: "bottom-right",
        });
      }
      form.reset();
      return response;
    } catch (error: unknown) {
      if (isAxiosError<LaravelValidationResponse>(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 422 && data?.errors) {
          Object.entries(data.errors).forEach(([field, messages]) => {
            form.setError(field as keyof StudentValues, {
              type: "server",
              message: messages[0],
            });
          });

          return;
        }
      }

      console.error("Something went wrong:", error);
    }
  };
  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="first_name">First Name</FieldLabel>
                <Input
                  placeholder="First Name"
                  {...form.register("first_name")}
                  id="first_name"
                />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.first_name.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="last_name">Last Name</FieldLabel>
                <Input
                  {...form.register("last_name")}
                  placeholder="Last Name"
                  id="last_name"
                />
                {form.formState.errors.last_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.last_name.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="date_of_birth">Date of birth</FieldLabel>
                <Input
                  {...form.register("date_of_birth")}
                  placeholder="06/11/1999"
                  id="date_of_birth"
                  type="date"
                />
                {form.formState.errors.date_of_birth && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.date_of_birth.message}
                  </p>
                )}
              </Field>
              <FieldSet className="w-full max-w-xs">
                <FieldLegend variant="label">Gender</FieldLegend>
                <FieldDescription>Chose you gender</FieldDescription>
                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}>
                      <Field orientation="horizontal">
                        <RadioGroupItem value="m" />
                        <FieldLabel className="font-normal">Male</FieldLabel>
                      </Field>

                      <Field orientation="horizontal">
                        <RadioGroupItem value="f" />
                        <FieldLabel className="font-normal">Female</FieldLabel>
                      </Field>
                    </RadioGroup>
                  )}
                />
              </FieldSet>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          {form.formState.errors.gender && (
            <p className="text-sm text-destructive">
              {form.formState.errors.gender.message}
            </p>
          )}
          <Field>
            <FieldLabel>Blood Type</FieldLabel>

            <Controller
              control={form.control}
              name="blood_type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Blood Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Blood Type</SelectLabel>

                      {bloodTypes.map((bloodType) => (
                        <SelectItem key={bloodType} value={bloodType}>
                          {bloodType}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.blood_type && (
            <p className="text-sm text-destructive">
              {form.formState.errors.blood_type.message}
            </p>
          )}
          <Field>
            <FieldLabel>Student Parent</FieldLabel>

            <Controller
              control={form.control}
              name="student_parent_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a parent" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Parent</SelectLabel>

                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={String(parent.id)}>
                          {`${parent.first_name} ${parent.last_name}`}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.student_parent_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.student_parent_id?.message}
            </p>
          )}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...form.register("email")}
              placeholder="example@test.com"
              type="email"
              id="email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...form.register("password")}
              placeholder="Password"
              type="password"
              id="password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password_confirmation">
              Confirm Password
            </FieldLabel>

            <Input
              {...form.register("password_confirmation")}
              type="password"
              placeholder="Confirm Password"
              id="password_confirmation"
            />
            {form.formState.errors.password_confirmation && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </Field>

          <Field orientation="horizontal">
            <Button type="submit">{values ? "Update" : "Create"}</Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => form.reset()}>
              Reset
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
