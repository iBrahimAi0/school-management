import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { CourseValuesType } from "@/types/AdminTypes/CourseValuesType";

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
  deleteCourse: async (id: string) => {
    return await axiosClient.delete(`/api/courses/${id}`);
  },
  deteleCourse: function (id: string) {
    return this.deleteCourse(id);
  },
  getTeacherCourses: async (id: number | undefined) => {
    try {
      return await axiosClient.get(`/api/teachers/${id}/courses`);
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
  getTeacherCourseStudents: async (
    teacherId: number | undefined,
    courseId: number | undefined,
  ) => {
    try {
      return await axiosClient.get(
        `/api/teachers/${teacherId}/course/${courseId}/students`,
      );
    } catch (error: any) {
      throw error;
    }
  },
};

export default CourseApi;
