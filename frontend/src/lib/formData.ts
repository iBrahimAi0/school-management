// src/lib/formData.ts
export function objectToFormData(
  data: Record<string, any>,
  method?: "PUT" | "PATCH",
): FormData {
  const formData = new FormData();

  if (method) {
    formData.append("_method", method);
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    // 1. If it's a FileList (from native react-hook-form register)
    if (value instanceof FileList) {
      if (value.length > 0) {
        formData.append(key, value[0]); // 👈 Unpack the real File
      }
    }
    // 2. If it's already a single File
    else if (value instanceof File) {
      formData.append(key, value);
    }
    // 3. Other primitive values
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
}
