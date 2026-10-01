import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { ClassTypeValuesType } from "@/types/ClassTypeValuesType";

const ClassTypeApi = {
  addClassType: async (values: ClassTypeValuesType) => {
    try {
      return await axiosClient.post("/api/class-types", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateClassType: async (values: ClassTypeValuesType, id: string) => {
    try {
      return await axiosClient.put(`/api/class-types/${id}`, values);
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
  getClassTypes: async () => {
    try {
      return await axiosClient.get("/api/class-types");
    } catch (error: any) {
      throw error;
    }
  },
  deteleClassType: async (id: string) => {
    try {
      return await axiosClient.delete(`/api/class-types/${id}`);
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

export default ClassTypeApi;
