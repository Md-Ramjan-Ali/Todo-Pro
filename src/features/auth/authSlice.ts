import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Helper function to safely get token from localStorage
const getTokenFromStorage = (): string | null => {
  try {
    return localStorage.getItem("token");
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};

const initialState: AuthState = {
  user: null,
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      try {
        localStorage.setItem("token", action.payload.token);
      } catch (error) {
        console.error("Error saving token to localStorage:", error);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      try {
        localStorage.removeItem("token");
      } catch (error) {
        console.error("Error removing token from localStorage:", error);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
