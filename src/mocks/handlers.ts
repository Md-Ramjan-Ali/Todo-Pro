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



const todos: Todo[] = [];
let nextId = 1;

// Helper function to simulate API delay and random failures
const simulateApiCall = async () => {
  await delay(300 + Math.random() * 200); // 300-500ms delay

  // 10% chance of failure - return false instead of throwing error
  if (Math.random() < 0.1) {
    return false;
  }

  return true;
};

export const handlers = [
  // Auth handlers
  http.post("/auth/register", async ({ request }) => {
    const success = await simulateApiCall();
    if (!success) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

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
    const success = await simulateApiCall();
    if (!success) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

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
    console.log("GET /todos handler called");

    try {
      const success = await simulateApiCall();
      if (!success) {
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      }

      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const url = new URL(request.url);

      // Safe parameter extraction with defaults
      const status = url.searchParams.get("status") || "all";
      const search = url.searchParams.get("q") || "";
      const sortBy = url.searchParams.get("_sort") || "createdAt";
      const page = parseInt(url.searchParams.get("_page") || "1");

      console.log("Request params:", { status, search, sortBy, page });

      // Start with all todos
      let filteredTodos = [...todos];

      // Apply status filter
      if (status && status !== "all") {
        filteredTodos = filteredTodos.filter((todo) => todo.status === status);
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredTodos = filteredTodos.filter(
          (todo) =>
            todo.title.toLowerCase().includes(searchLower) ||
            (todo.description &&
              todo.description.toLowerCase().includes(searchLower))
        );
      }

      // Apply sorting
      if (sortBy === "dueDate") {
        filteredTodos.sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return dateA - dateB;
        });
      } else if (sortBy === "priority") {
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
        filteredTodos.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // Paginate (10 items per page)
      const itemsPerPage = 10;
      const startIndex = (page - 1) * itemsPerPage;
      const paginatedTodos = filteredTodos.slice(
        startIndex,
        startIndex + itemsPerPage
      );

      const response = {
        todos: paginatedTodos,
        totalCount: filteredTodos.length,
        totalPages: Math.ceil(filteredTodos.length / itemsPerPage),
        currentPage: page,
      };

      return HttpResponse.json(response);
    } catch (error) {
      console.error("Error in GET /todos handler:", error);
      return HttpResponse.json({
        todos: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
      });
    }
  }),

  http.post("/todos", async ({ request }) => {
    const success = await simulateApiCall();
    if (!success) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

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

    console.log("Created new todo:", newTodo);
    console.log("Total todos now:", todos.length);

    return HttpResponse.json(newTodo);
  }),

  http.patch("/todos/:id", async ({ request, params }) => {
    console.log("PATCH /todos handler called");

    try {
      const success = await simulateApiCall();
      if (!success) {
        console.log("Simulated API failure");
        return HttpResponse.json({ error: "Server error" }, { status: 500 });
      }

      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("Unauthorized request");
        return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id } = params;
      const updates = (await request.json()) as Partial<Todo>;

      console.log("Updating todo ID:", id);
      console.log("Updates:", updates);

      const todoIndex = todos.findIndex((todo) => todo.id === id);

      if (todoIndex === -1) {
        console.log("Todo not found:", id);
        return HttpResponse.json({ error: "Todo not found" }, { status: 404 });
      }

      // Create updated todo object
      const updatedTodo = {
        ...todos[todoIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Validate the updated todo
      if (updatedTodo.title === undefined || updatedTodo.title.trim() === "") {
        return HttpResponse.json(
          { error: "Title is required" },
          { status: 400 }
        );
      }

      // Update the todos array
      todos[todoIndex] = updatedTodo;

      console.log("Todo updated successfully:", updatedTodo);
      console.log("Total todos:", todos.length);

      return HttpResponse.json(updatedTodo);
    } catch (error) {
      console.error("Error in PATCH /todos handler:", error);
      return HttpResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }),

  http.delete("/todos/:id", async ({ request, params }) => {
    const success = await simulateApiCall();
    if (!success) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

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
