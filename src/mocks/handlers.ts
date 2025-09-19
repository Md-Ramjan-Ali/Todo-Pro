import { http, HttpResponse, delay } from "msw";
import type { Todo, CreateTodoData } from "../schemas/todos";

// Mock data
const users = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  },
];

let todos: Todo[] = [];
let nextId = 1;

// Helper function to simulate API delay and random failures
const simulateApiCall = async () => {
  await delay(300 + Math.random() * 200); // 300-500ms delay

  if (Math.random() < 0.1) {
    // 10% chance of failure
    throw new Error("Server error");
  }
};

export const handlers = [
  // Auth handlers (existing)
  http.post("/auth/register", async ({ request }) => {
    await simulateApiCall();
    const { email, password, name } = (await request.json()) as any;

    if (users.find((user) => user.email === email)) {
      return HttpResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = { id: String(users.length + 1), email, password, name };
    users.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    const token = btoa(JSON.stringify({ userId: newUser.id }));

    return HttpResponse.json({ user: userWithoutPassword, token });
  }),

  http.post("/auth/login", async ({ request }) => {
    await simulateApiCall();
    const { email, password } = (await request.json()) as any;

    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return HttpResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = btoa(JSON.stringify({ userId: user.id }));

    return HttpResponse.json({ user: userWithoutPassword, token });
  }),

  // Todo handlers
  http.get("/todos", async ({ request }) => {
    await simulateApiCall();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("q");
    const sortBy = url.searchParams.get("_sort");
    const page = parseInt(url.searchParams.get("_page") || "1");

    // Filter todos
    let filteredTodos = [...todos];

    if (status && status !== "all") {
      filteredTodos = filteredTodos.filter((todo) => todo.status === status);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          todo.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sort todos
    if (sortBy) {
      filteredTodos.sort((a, b) => {
        if (sortBy === "dueDate") {
          return (
            new Date(a.dueDate || "").getTime() -
            new Date(b.dueDate || "").getTime()
          );
        }
        if (sortBy === "priority") {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
          );
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }

    // Paginate (10 items per page)
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedTodos = filteredTodos.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return HttpResponse.json({
      todos: paginatedTodos,
      totalCount: filteredTodos.length,
      totalPages: Math.ceil(filteredTodos.length / itemsPerPage),
      currentPage: page,
    });
  }),

  http.post("/todos", async ({ request }) => {
    await simulateApiCall();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoData = (await request.json()) as CreateTodoData;
    const newTodo: Todo = {
      id: String(nextId++),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    return HttpResponse.json(newTodo);
  }),

  http.patch("/todos/:id", async ({ request, params }) => {
    await simulateApiCall();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const updates = (await request.json()) as Partial<Todo>;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return HttpResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(todos[todoIndex]);
  }),

  http.delete("/todos/:id", async ({ request, params }) => {
    await simulateApiCall();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return HttpResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    todos.splice(todoIndex, 1);
    return HttpResponse.json({ message: "Todo deleted successfully" });
  }),
];
