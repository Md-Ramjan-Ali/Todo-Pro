import {
  type Todo,
  type CreateTodoData,
  type UpdateTodoData,
} from "../schemas/todos";

// Simple in-memory storage as fallback
let todos: Todo[] = [
  // {
  //   id: "1",
  //   title: "Welcome to Todo Pro!",
  //   description:
  //     "This is a sample todo. The mock API might not be working properly.",
  //   status: "todo",
  //   priority: "medium",
  //   tags: ["welcome"],
  //   dueDate: "2024-01-31",
  //   createdAt: new Date().toISOString(),
  //   updatedAt: new Date().toISOString(),
  // },
];

export const todoService = {
  // Get todos with filtering, sorting, and pagination
  async getTodos(params: {
    page?: number;
    status?: string;
    search?: string;
    sortBy?: string;
  }) {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay

    let filteredTodos = [...todos];

    // Apply status filter
    if (params.status && params.status !== "all") {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.status === params.status
      );
    }

    // Apply search filter
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
      // Default sort by createdAt (newest first)
      filteredTodos.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    // Paginate (10 items per page)
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
  },

  // Create a new todo
  async createTodo(todoData: CreateTodoData) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newTodo: Todo = {
      id: Math.random().toString(36).substr(2, 9),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    return newTodo;
  },

  // Update a todo
  async updateTodo(id: string, updates: UpdateTodoData) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return todos[todoIndex];
  },

  // Delete a todo
  async deleteTodo(id: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const todoIndex = todos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }

    todos.splice(todoIndex, 1);
    return { message: "Todo deleted successfully" };
  },
};
