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
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { StudentSchema } from "@/schema/StudentSchema";
import { useEffect, useState } from "react";
import ParentApi from "@/api/Parent/ParentApi";
import ClasseApi from "@/api/Classe/ClasseApi";

interface Parent {
  id: string | number;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: "f" | "m";
  blood_type?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export function StudentsForm({ handleSubmit, values, onUpdate, mode }: any) {
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  const [parents, setParents] = useState<Parent[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [parentsRes, classesRes] = await Promise.allSettled([
          ParentApi.getParents(),
          ClasseApi.getClasse(),
        ]);

        if (parentsRes.status === "fulfilled") {
          const list = parentsRes.value.data?.data ?? parentsRes.value.data ?? [];
          setParents(list);
        }

        if (classesRes.status === "fulfilled") {
          const list = classesRes.value.data?.classes ?? classesRes.value.data ?? [];
          setClasses(list);
        }
      } catch (e) {
        console.error("Failed loading options:", e);
      }
    };

    loadOptions();
  }, []);

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  const getParentIdVal = (val: any) => {
    if (!val) return "";
    return String(val?.student_parent_id ?? val?.student_parent?.id ?? val?.parent?.id ?? "");
  };

  const getClasseIdVal = (val: any) => {
    if (!val) return "";
    return String(val?.classe_id ?? val?.classe?.id ?? "");
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
      first_name: values?.first_name ?? "",
      last_name: values?.last_name ?? "",
      date_of_birth: formatDateForInput(values?.date_of_birth) ?? "",
      gender: values?.gender ?? "m",
      blood_type: values?.blood_type ?? "",
      student_parent_id: getParentIdVal(values),
      classe_id: getClasseIdVal(values),
      email: values?.email ?? "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (values) {
      form.reset({
        first_name: values.first_name ?? "",
        last_name: values.last_name ?? "",
        date_of_birth: formatDateForInput(values?.date_of_birth) ?? "",
        gender: values.gender ?? "m",
        blood_type: values.blood_type ?? "",
        student_parent_id: getParentIdVal(values),
        classe_id: getClasseIdVal(values),
        email: values.email ?? "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [values, form]);

  const onSubmit = async (values: StudentValues) => {
    let loaderToast;
    try {
      loaderToast = toast.loading(
        mode === "create" ? "Creating student..." : "Updating student...",
      );

      const response = await handleSubmit(values);
      toast.dismiss(loaderToast);
      if (mode === "update" && onUpdate) {
        onUpdate(response.data?.student ?? response);
      }
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Success", {
          description: response.data?.message ?? "Saved successfully",
          position: "bottom-right",
        });
      }
      form.reset();
      return response;
    } catch (error: unknown) {
      if (loaderToast) toast.dismiss(loaderToast);
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
          toast.error(data.message || "Please fix validation errors");
          return;
        }
      }

      console.error("Something went wrong:", error);
      toast.error("Failed to save student. Please try again.");
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
            <FieldLabel>Student Parent (Guardian)</FieldLabel>

            <Controller
              control={form.control}
              name="student_parent_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? "" : val)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a parent" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Parent</SelectLabel>
                      <SelectItem value="none">No Parent (Unassigned)</SelectItem>
                      {parents.map((parent) => (
                        <SelectItem key={parent.id} value={String(parent.id)}>
                          {`${parent.first_name} ${parent.last_name}`}
                          {parent.email ? ` (${parent.email})` : ""}
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
            <FieldLabel>Assigned Classroom</FieldLabel>

            <Controller
              control={form.control}
              name="classe_id"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? "" : val)
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a classroom" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Classroom</SelectLabel>
                      <SelectItem value="none">No Class (Unassigned)</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={String(cls.id)}>
                          {cls.name} ({cls.code})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {form.formState.errors.classe_id && (
            <p className="text-sm text-destructive">
              {form.formState.errors.classe_id?.message}
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
