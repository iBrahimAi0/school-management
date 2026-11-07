import { isAxiosError } from "axios";
import { axiosClient } from "../axios";
import { StudentTypes } from "@/types/AdminTypes/StudentValuesType";

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
  addStudent: async (values: StudentTypes) => {
    try {
      console.log("Submitting payload:", values);
      return await axiosClient.post("/api/students", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateStudent: async (values: StudentTypes, id: string) => {
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
  deleteStudent: async (id: string) => {
    return await axiosClient.delete(`/api/students/${id}`);
  },
  deteleStudent: function (id: string) {
    return this.deleteStudent(id);
  },
  getTeacherStudents: async (id: number | undefined) => {
    try {
      return await axiosClient.get(`/api/teacher/${id}/students`);
    } catch (error: any) {
      throw error;
    }
  },
  getStudentByClasse: async (id: number | undefined) => {
    try {
      return await axiosClient.get(`/api/teacher/${id}/attendanceSessions`);
    } catch (error: any) {
      throw error;
    }
  },
  getTeacherStudentsClasse: async (
    teacherId: number | undefined,
    classeId: number | undefined,
  ) => {
    try {
      return await axiosClient.get(
        `/api/teachers/${teacherId}/classe/${classeId}/students`,
      );
    } catch (error: any) {
      throw error;
    }
  },
};
