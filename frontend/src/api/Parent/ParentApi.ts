import { ParentValuesType } from "@/types/AdminTypes/ParentValuesType";
import { axiosClient } from "../axios";
import { isAxiosError } from "axios";

const ParentApi = {
  addParent: async (values: ParentValuesType) => {
    try {
      return await axiosClient.post("/api/parents", { values });
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateParent: async (values: ParentValuesType, id: string) => {
    try {
      return await axiosClient.put(`/api/parents/${id}`, values);
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
  getParents: async () => {
    try {
      return await axiosClient.get("/api/parents");
    } catch (error: any) {
      throw error;
    }
  },
  deleteParent: async (id: string) => {
    return await axiosClient.delete(`/api/parents/${id}`);
  },
  deteleParent: function (id: string) {
    return this.deleteParent(id);
  },
  getPortalData: async () => {
    return await axiosClient.get("/api/parent/portal-data");
  },
};

export default ParentApi;
