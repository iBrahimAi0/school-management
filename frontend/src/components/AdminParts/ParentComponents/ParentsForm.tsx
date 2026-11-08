import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { ParentSchema } from "@/schema/ParentSchema";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export function ParentsForm({
  handleSubmit,
  values,
  onUpdate,
  onSuccess,
  mode = "create",
}: any) {
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };

  type ParentValues = z.infer<typeof ParentSchema>;
  type LaravelValidationResponse = {
    message?: string;
    errors?: Record<string, string[]>;
  };

  const form = useForm<
    z.input<typeof ParentSchema>,
    unknown,
    z.output<typeof ParentSchema>
  >({
    resolver: zodResolver(ParentSchema),
    defaultValues: {
      first_name: values?.first_name ?? "",
      last_name: values?.last_name ?? "",
      date_of_birth: formatDateForInput(values?.date_of_birth) ?? "",
      gender: values?.gender ?? "m",
      blood_type: values?.blood_type ?? "",
      address: values?.address ?? "",
      phone: values?.phone ?? "",
      email: values?.email ?? "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    if (mode === "update" && values) {
      form.reset({
        first_name: values.first_name ?? "",
        last_name: values.last_name ?? "",
        date_of_birth: formatDateForInput(values?.date_of_birth) ?? "",
        gender: values.gender ?? "m",
        blood_type: values.blood_type ?? "",
        address: values?.address ?? "",
        phone: values.phone ?? "",
        email: values.email ?? "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [values, mode, form]);

  const onSubmit = async (values: ParentValues) => {
    let loaderToast;
    try {
      loaderToast = toast.loading(
        mode === "create" ? "Creating parent account..." : "Updating parent account..."
      );
      const response = await handleSubmit(values);
      toast.dismiss(loaderToast);

      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Success", {
          description: response.data?.message || "Parent saved successfully",
          position: "bottom-right",
        });
        const updatedParent = response.data?.parent;
        if (onUpdate && updatedParent) {
          onUpdate(updatedParent);
        }
        if (onSuccess) {
          onSuccess();
        }
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
            form.setError(field as keyof ParentValues, {
              type: "server",
              message: messages[0],
            });
          });
          toast.error(data.message || "Please fix validation errors");
          return;
        }
      }

      console.error("Something went wrong:", error);
      toast.error("Failed to save parent. Please try again.");
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
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Textarea
                  placeholder="Add Address"
                  className="resize-none"
                  {...form.register("address")}
                  id="address"
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input
              {...form.register("phone")}
              type="tel"
              placeholder="01234567890"
              id="phone"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.phone.message}
              </p>
            )}
          </Field>
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
