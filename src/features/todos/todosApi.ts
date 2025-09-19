import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Todo, CreateTodoData, UpdateTodoData } from "../../schemas/todos";
import type { RootState } from "../../store";

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getTodos: builder.query<
      { todos: Todo[] },
      {
        page?: number;
        status?: string;
        search?: string;
        sortBy?: string;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("_page", params.page.toString());
        if (params.status) queryParams.append("status", params.status);
        if (params.search) queryParams.append("q", params.search);
        if (params.sortBy) queryParams.append("_sort", params.sortBy);

        return `todos?${queryParams.toString()}`;
      },
      providesTags: ["Todo"],
    }),

    getTodo: builder.query<Todo, string>({
      query: (id) => `todos/${id}`,
      providesTags: ["Todo"],
    }),

    createTodo: builder.mutation<Todo, CreateTodoData>({
      query: (newTodo) => ({
        url: "todos",
        method: "POST",
        body: newTodo,
      }),
      invalidatesTags: ["Todo"],
    }),

    updateTodo: builder.mutation<Todo, { id: string; data: UpdateTodoData }>({
      query: ({ id, data }) => ({
        url: `todos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Todo"],
    }),

    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Todo"],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useGetTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
