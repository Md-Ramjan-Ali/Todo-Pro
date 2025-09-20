// Simple in-memory storage for todos when MSW fails
let fallbackTodos: any[] = [];

export const apiFallback = {
  getTodos: async (params: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredTodos = [...fallbackTodos];

    // Filter by status
    if (params.status && params.status !== "all") {
      filteredTodos = filteredTodos.filter(
        (todo) => todo.status === params.status
      );
    }

    // Filter by search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort
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
  },

  createTodo: async (todoData: any) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newTodo = {
      id: String(Math.random().toString(36).substr(2, 9)),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fallbackTodos.push(newTodo);
    return newTodo;
  },

  updateTodo: async (id: string, updates: any) => {
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
  },

  deleteTodo: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const todoIndex = fallbackTodos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      throw new Error("Todo not found");
    }

    fallbackTodos.splice(todoIndex, 1);
  },
};
