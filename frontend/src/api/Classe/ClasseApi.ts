import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { ClassTypeValues } from "@/schema/ClassTypeSchema";

const ClasseApi = {
  addClasse: async (values: ClassTypeValues) => {
    try {
      return await axiosClient.post("/api/classes", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateClasse: async (values: ClassTypeValues, id: string) => {
    try {
      return await axiosClient.put(`/api/classes/${id}`, values);
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
  getClasse: async () => {
    try {
      return await axiosClient.get("/api/classes");
    } catch (error: any) {
      throw error;
    }
  },
  deteleClasse: async (id: string) => {
    try {
      return await axiosClient.delete(`/api/classes/${id}`);
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

export default ClasseApi;
