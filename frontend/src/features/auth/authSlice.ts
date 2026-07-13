import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { signupAsync, loginAsync, logoutAsync } from "./authThunks";
import type{ AuthState, User } from "./auth.types";
import { setAccessToken } from "../../api/axiosInstance";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {  
    state.accessToken = action.payload;
  },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { message: string })?.message || "Signup failed";
      })

      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        setAccessToken(action.payload.accessToken);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as { message: string })?.message || "Login failed";
      })

      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        setAccessToken(null);
      });
  },
});

export const { setUser, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;