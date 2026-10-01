import { valuesType } from "@/types/ValuesType";
import { axiosClient } from "../axios";

export const UserApi = {
  login: async ({ email, password }: valuesType) => {
    try {
      const response = await axiosClient.post("/api/login", {
        email,
        password,
      });
      console.log("LOGIN RESPONSE:", response);
      console.log("LOGIN DATA:", response.data.token);

      const token = response.data.token;
      localStorage.setItem("token", token);

      return response.data;
    } catch (error: any) {
      console.log("LOGIN ERROR:", error.response?.data);
      console.log("STATUS:", error.response?.status);
      throw error;
    }
  },
  logout: async () => {
    try {
      await axiosClient.post("/api/logout");
    } finally {
      localStorage.removeItem("token");
    }
  },

  getUser: async () => {
    return await axiosClient.get("/api/user");
  },
};
