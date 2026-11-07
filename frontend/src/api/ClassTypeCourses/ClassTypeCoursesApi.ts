import { ClassTypeCourseFormValues } from "@/types/AdminTypes/ClassTypeCourseValuesTypes";
import { axiosClient } from "../axios";
import { isAxiosError } from "axios";

const ClassTypeCoursesApi = {
  addClassTypeCourse: async (values: ClassTypeCourseFormValues) => {
    try {
      return await axiosClient.post("/api/class-type-courses", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateClassTypeCourse: async (
    id: string,
    values: ClassTypeCourseFormValues,
  ) => {
    try {
      return await axiosClient.put(`/api/class-type-courses/${id}`, values);
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
  getClassTypeCourses: async () => {
    try {
      return await axiosClient.get("/api/class-type-courses");
    } catch (error: any) {
      throw error;
    }
  },
  deleteClassTypeCourse: async (id: string) => {
    return await axiosClient.delete(`/api/class-type-courses/${id}`);
  },
  deteleClassTypeCourse: function (id: string) {
    return this.deleteClassTypeCourse(id);
  },
};

export default ClassTypeCoursesApi;
