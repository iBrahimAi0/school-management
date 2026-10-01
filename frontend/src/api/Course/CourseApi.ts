import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { CourseValuesType } from "@/types/CourseValuesType";

const CourseApi = {
  addCourse: async (values: CourseValuesType) => {
    try {
      return await axiosClient.post("/api/courses", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateCourse: async (values: CourseValuesType, id: string) => {
    try {
      return await axiosClient.put(`/api/courses/${id}`, values);
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
  getCourses: async () => {
    try {
      return await axiosClient.get("/api/courses");
    } catch (error: any) {
      throw error;
    }
  },
  deteleCourse: async (id: string) => {
    try {
      return await axiosClient.delete(`/api/courses/${id}`);
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

export default CourseApi;
