import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TodoStatus } from "../../schemas/todos";

interface FiltersState {
  status: TodoStatus | "all";
  search: string;
  sortBy: "createdAt" | "dueDate" | "priority";
  page: number;
}

interface TodosState {
  filters: FiltersState;
  selectedTodoId: string | null;
}

const initialState: TodosState = {
  filters: {
    status: "all",
    search: "",
    sortBy: "createdAt",
    page: 1,
  },
  selectedTodoId: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<TodoStatus | "all">) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setSortBy: (
      state,
      action: PayloadAction<"createdAt" | "dueDate" | "priority">
    ) => {
      state.filters.sortBy = action.payload;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setSelectedTodo: (state, action: PayloadAction<string | null>) => {
      state.selectedTodoId = action.payload;
    },
    clearSelectedTodo: (state) => {
      state.selectedTodoId = null;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  setStatusFilter,
  setSearchFilter,
  setSortBy,
  setPage,
  setSelectedTodo,
  clearSelectedTodo, // Export the new action
  clearFilters,
} = todosSlice.actions;

export default todosSlice.reducer;
