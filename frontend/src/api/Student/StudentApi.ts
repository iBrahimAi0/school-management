import { isAxiosError } from "axios";
import { axiosClient } from "../axios";
import { StudentValuesType } from "@/types/StudentValuesType";

export const StudentApi = {
  getStudents: async () => {
    try {
      return await axiosClient.get("/api/students");
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.log("❌ STATUS:", error.response?.status);
        console.log("❌ DATA:", error.response?.data);
        console.log("❌ HEADERS:", error.response?.headers);
        console.log("❌ REQUEST URL:", error.config?.url);
        console.log("❌ METHOD:", error.config?.method);
      } else {
        console.log("❌ UNKNOWN ERROR:", error);
      }
      throw error;
    }
  },
  addStudent: async (values: StudentValuesType) => {
    try {
      console.log("Submitting payload:", values);
      return await axiosClient.post("/api/students", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateStudent: async (values: StudentValuesType, id: string) => {
    try {
      return await axiosClient.put(`/api/students/${id}`, values);
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.log("❌ STATUS:", error.response?.status);
        console.log("❌ DATA:", error.response?.data);
        console.log("❌ HEADERS:", error.response?.headers);
        console.log("❌ REQUEST URL:", error.config?.url);
        console.log("❌ METHOD:", error.config?.method);
      } else {
        console.log("❌ UNKNOWN ERROR:", error);
      }
      throw error;
    }
  },
  getStudent: async () => {
    try {
      return await axiosClient.get("/api/students");
    } catch (error: any) {
      throw error;
    }
  },
  deteleStudent: async (id: string) => {
    try {
      return await axiosClient.delete(`/api/students/${id}`);
    } catch (error: any) {
      if (isAxiosError(error)) {
        console.log("❌ STATUS:", error.response?.status);
        console.log("❌ DATA:", error.response?.data);
        console.log("❌ HEADERS:", error.response?.headers);
        console.log("❌ REQUEST URL:", error.config?.url);
        console.log("❌ METHOD:", error.config?.method);
      } else {
        console.log("❌ UNKNOWN ERROR:", error);
      }

      throw error;
    }
  },
};
