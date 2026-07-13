import axiosInstance from "../../api/axiosInstance";
import type{ SignupPayload, LoginPayload, AuthResult } from "./auth.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const signup = async (payload: SignupPayload): Promise<AuthResult> => {
  const response = await axiosInstance.post<ApiResponse<AuthResult>>(
    "/auth/signup",
    payload,
    { withCredentials: true }
  );
  return response.data.data;
};

export const login = async (payload: LoginPayload): Promise<AuthResult> => {
  const response = await axiosInstance.post<ApiResponse<AuthResult>>(
    "/auth/login",
    payload,
    { withCredentials: true }
  );
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
};