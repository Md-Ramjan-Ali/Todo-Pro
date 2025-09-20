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
      {
        todos: Todo[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
      },
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
        if (params.status && params.status !== "all")
          queryParams.append("status", params.status);
        if (params.search) queryParams.append("q", params.search);
        if (params.sortBy) queryParams.append("_sort", params.sortBy);

        const queryString = queryParams.toString();
        return queryString ? `todos?${queryString}` : "todos";
      },
      // Provide tags for all possible variations of the query
      providesTags: (result, error, arg) => [
        { type: "Todo", id: "LIST" },
        {
          type: "Todo",
          id: `LIST-${arg.page}-${arg.status}-${arg.search}-${arg.sortBy}`,
        },
      ],
    }),

    createTodo: builder.mutation<Todo, CreateTodoData>({
      query: (newTodo) => ({
        url: "todos",
        method: "POST",
        body: newTodo,
      }),
      // Invalidate all list queries
      invalidatesTags: [{ type: "Todo", id: "LIST" }],
    }),

    updateTodo: builder.mutation<Todo, { id: string; data: UpdateTodoData }>({
      query: ({ id, data }) => ({
        url: `todos/${id}`,
        method: "PATCH",
        body: data,
      }),
      // Invalidate both the specific todo and the list
      invalidatesTags: (result, error, { id }) => [
        { type: "Todo", id },
        { type: "Todo", id: "LIST" },
      ],
    }),

    deleteTodo: builder.mutation<void, string>({
      query: (id) => ({
        url: `todos/${id}`,
        method: "DELETE",
      }),
      // Invalidate both the specific todo and the list
      invalidatesTags: (result, error, id) => [
        { type: "Todo", id },
        { type: "Todo", id: "LIST" },
      ],
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
