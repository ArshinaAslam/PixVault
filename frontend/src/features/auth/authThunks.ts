import { createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import * as authApi from "./authApi";
import type{ SignupPayload, LoginPayload } from "./auth.types";

export const signupAsync = createAsyncThunk(
  "auth/signup",
  async (data: SignupPayload, { rejectWithValue }) => {
    try {
      return await authApi.signup(data);
    } catch (error) {
      if (isAxiosError(error)) {
        return rejectWithValue({ message: error.response?.data?.message || "Signup failed" });
      }
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      return await authApi.login(data);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log("error.response",error.response)
        return rejectWithValue({ message: error.response?.data?.message || "Login failed" });
      }
      return rejectWithValue({ message: "Network error" });
    }
  }
);

export const logoutAsync = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
  } catch (error) {
    if (isAxiosError(error)) {
      return rejectWithValue({ message: error.response?.data?.message || "Logout failed" });
    }
    return rejectWithValue({ message: "Network error" });
  }
});