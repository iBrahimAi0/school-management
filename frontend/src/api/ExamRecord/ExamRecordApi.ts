import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { ExamRecordType } from "@/types/AdminTypes/ExamRecordValuesType";

const ExamRecordApi = {
  addExamRecord: async (values: ExamRecordType) => {
    try {
      return await axiosClient.post("/api/examRecords", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateExamRecord: async (id: string, values: ExamRecordType) => {
    try {
      return await axiosClient.put(`/api/examRecords/${id}`, values);
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
  getExamRecords: async () => {
    try {
      return await axiosClient.get("/api/examRecords");
    } catch (error: any) {
      throw error;
    }
  },
  deleteExamRecord: async (id: string) => {
    return await axiosClient.delete(`/api/examRecords/${id}`);
  },
  deteleExamRecord: function (id: string) {
    return this.deleteExamRecord(id);
  },
};

export default ExamRecordApi;
