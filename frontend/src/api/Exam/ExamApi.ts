import { objectToFormData } from "@/lib/formData";
import { axiosClient } from "../axios";
import { ExamFormValuesType, ExamType } from "@/types/AdminTypes/ExamValuesType";

const ExamApi = {
  getExams: () => axiosClient.get("/api/exams"),

  // CREATE (Sends FormData as POST)
  addExam: (values: ExamFormValuesType | ExamType) => {
    const payload = objectToFormData(values);
    return axiosClient.post("/api/exams", payload);
  },

  // UPDATE (Sends FormData as POST with _method: 'PUT' for Laravel)
  updateExam: (id: string | number, values: ExamFormValuesType | ExamType) => {
    const payload = objectToFormData(values, "PUT");
    return axiosClient.post(`/api/exams/${id}`, payload);
  },

  // DELETE
  deleteExam: (id: string | number) => axiosClient.delete(`/api/exams/${id}`),
  viewExamFile: async (id: number | string) => {
    const response = await axiosClient.get(`/api/exams/${id}/file`, {
      responseType: "blob",
    });

    // Create a local blob URL in the browser
    const blob = new Blob([response.data], { type: "application/pdf" });
    const fileUrl = window.URL.createObjectURL(blob);

    // Open the generated URL in a new tab
    window.open(fileUrl, "_blank");

    // Clean up memory after 1 minute
    setTimeout(() => window.URL.revokeObjectURL(fileUrl), 60000);
  },
};

export default ExamApi;
