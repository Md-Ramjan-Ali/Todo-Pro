import type { Todo, CreateTodoData, UpdateTodoData } from "../schemas/todos";

// Simple in-memory storage as fallback
let fallbackTodos: Todo[] = [
  {
    id: "1",
    title: "Welcome to Todo Pro!",
    description:
      "This is a fallback todo. The mock API might not be working properly.",
    status: "todo",
    priority: "medium",
    tags: ["welcome"],
    dueDate: "2024-01-31",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

class ApiService {
  private async tryFetch(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    try {
      const response = await fetch(input, init);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.warn("Fetch failed, using fallback:", error);
      throw error;
    }
  }

  async getTodos(params: {
    page?: number;
    status?: string;
    search?: string;
    sortBy?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("_page", params.page.toString());
      if (params.status && params.status !== "all")
        queryParams.append("status", params.status);
      if (params.search) queryParams.append("q", params.search);
      if (params.sortBy) queryParams.append("_sort", params.sortBy);

      const response = await this.tryFetch(`/todos?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.log(error);
      // Fallback to in-memory data
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

      let filteredTodos = [...fallbackTodos];

      // Apply filters
      if (params.status && params.status !== "all") {
        filteredTodos = filteredTodos.filter(
          (todo) => todo.status === params.status
        );
      }

      if (params.search) {
        const searchLower = params.search.toLowerCase();
        filteredTodos = filteredTodos.filter(
          (todo) =>
            todo.title.toLowerCase().includes(searchLower) ||
            (todo.description &&
              todo.description.toLowerCase().includes(searchLower))
        );
      }

      // Apply sorting
      if (params.sortBy === "dueDate") {
        filteredTodos.sort((a, b) =>
          (a.dueDate || "").localeCompare(b.dueDate || "")
        );
      } else if (params.sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        filteredTodos.sort((a, b) => {
          const priorityA =
            priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const priorityB =
            priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return priorityB - priorityA;
        });
      } else {
        filteredTodos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }

      // Paginate
      const page = params.page || 1;
      const itemsPerPage = 10;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedTodos = filteredTodos.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      return {
        todos: paginatedTodos,
        totalCount: filteredTodos.length,
        totalPages: Math.ceil(filteredTodos.length / itemsPerPage),
        currentPage: page,
      };
    }
  }

  async createTodo(todoData: CreateTodoData) {
    try {
      const response = await this.tryFetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(todoData),
      });

      return await response.json();
    } catch (error) {
      console.log(error);
      // Fallback to in-memory storage
      await new Promise((resolve) => setTimeout(resolve, 300));

      const newTodo: Todo = {
        id: Math.random().toString(36).substr(2, 9),
        ...todoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      fallbackTodos.push(newTodo);
      return newTodo;
    }
  }

  async updateTodo(id: string, updates: UpdateTodoData) {
    try {
      const response = await this.tryFetch(`/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updates),
      });

      return await response.json();
    } catch (error) {
      console.log(error);
      // Fallback to in-memory storage
      await new Promise((resolve) => setTimeout(resolve, 300));

      const todoIndex = fallbackTodos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) {
        throw new Error("Todo not found");
      }

      fallbackTodos[todoIndex] = {
        ...fallbackTodos[todoIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return fallbackTodos[todoIndex];
    }
  }

  async deleteTodo(id: string) {
    try {
      const response = await this.tryFetch(`/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      return await response.json();
    } catch (error) {
      // Fallback to in-memory storage
      await new Promise((resolve) => setTimeout(resolve, 300));

      const todoIndex = fallbackTodos.findIndex((todo) => todo.id === id);
      if (todoIndex === -1) {
        throw new Error("Todo not found");
      }

      fallbackTodos.splice(todoIndex, 1);
      return { message: "Todo deleted successfully" };
    }
  }
}

export const apiService = new ApiService();
