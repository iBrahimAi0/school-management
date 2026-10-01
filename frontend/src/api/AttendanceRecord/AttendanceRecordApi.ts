import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { AttendanceRecordFormValues } from "@/types/AttendanceRecordValuesType";

const AttendanceRecordApi = {
  addAttendanceRecord: async (values: AttendanceRecordFormValues) => {
    try {
      return await axiosClient.post("/api/attendanceRecords", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateAttendanceRecord: async (
    id: string,
    values: AttendanceRecordFormValues,
  ) => {
    try {
      return await axiosClient.put(`/api/attendanceRecords/${id}`, values);
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
  getAttendanceRecords: async () => {
    try {
      return await axiosClient.get("/api/attendanceRecords");
    } catch (error: any) {
      throw error;
    }
  },
  deteleAttendanceRecord: async (id: string) => {
    try {
      return await axiosClient.delete(`/api/attendanceRecords/${id}`);
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

export default AttendanceRecordApi;
