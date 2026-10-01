import { axiosClient } from "../axios";
import { isAxiosError } from "axios";
import { AttendanceSessionFormValues } from "@/types/AttendanceSessionValuesType";

const AttendanceSessionApi = {
  addAttendanceSession: async (values: AttendanceSessionFormValues) => {
    try {
      return await axiosClient.post("/api/attendanceSessions", values);
    } catch (error: any) {
      console.log(error.response?.data);
      console.log(error.response?.status);
      throw error;
    }
  },
  updateAttendanceSession: async (
    id: string,
    values: AttendanceSessionFormValues,
  ) => {
    try {
      return await axiosClient.put(`/api/attendanceSessions/${id}`, values);
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
  getAttendanceSessions: async () => {
    try {
      return await axiosClient.get("/api/attendanceSessions");
    } catch (error: any) {
      throw error;
    }
  },
  deteleAttendanceSession: async (id: string) => {
    try {
      return await axiosClient.delete(`/api/attendanceSessions/${id}`);
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

export default AttendanceSessionApi;
