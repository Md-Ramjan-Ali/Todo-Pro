import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface UIState {
  theme: "light" | "dark";
  toasts: Toast[];
}

const getInitialTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme as "light" | "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const initialState: UIState = {
  theme: getInitialTheme(),
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
      document.documentElement.classList.toggle(
        "dark",
        action.payload === "dark"
      );
    },
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = Math.random().toString(36).substring(2, 9);
      state.toasts.push({ id, ...action.payload });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
  },
});

export const { setTheme, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
