import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { AttendanceRecordFormValues } from "@/types/AdminTypes/AttendanceRecordValuesType";

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
    id: string | number,
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
  getAttendanceRecords: async (sessionId?: number | string) => {
    try {
      const params = sessionId ? { session_id: sessionId } : {};
      return await axiosClient.get("/api/attendanceRecords", { params });
    } catch (error: any) {
      throw error;
    }
  },
  deleteAttendanceRecord: async (id: string | number) => {
    return await axiosClient.delete(`/api/attendanceRecords/${id}`);
  },
  deteleAttendanceRecord: function (id: string | number) {
    return this.deleteAttendanceRecord(id);
  },
};

export default AttendanceRecordApi;
