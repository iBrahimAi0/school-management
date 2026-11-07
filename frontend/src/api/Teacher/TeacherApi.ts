import { ParentValuesType } from "@/types/AdminTypes/ParentValuesType";
import { axiosClient } from "../axios";
import { isAxiosError } from "axios";

const TeacherApi = {
  addTeacher: async (values: ParentValuesType) => {
    try {
      return await axiosClient.post("/api/teachers", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateTeacher: async (values: ParentValuesType, id: string) => {
    try {
      return await axiosClient.put(`/api/teachers/${id}`, values);
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
  getTeachers: async () => {
    try {
      return await axiosClient.get("/api/teachers");
    } catch (error: any) {
      throw error;
    }
  },
  deleteTeacher: async (id: string) => {
    return await axiosClient.delete(`/api/teachers/${id}`);
  },
  deteleTeacher: function (id: string) {
    return this.deleteTeacher(id);
  },
};

export default TeacherApi;
