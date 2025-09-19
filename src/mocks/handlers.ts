import { http, HttpResponse, delay } from "msw";

// Mock data
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const users: User[] = [
  {
    id: "1",
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  },
];

let todos: any[] = [];
let nextId = 1;

export const handlers = [
  // Register
  http.post("/auth/register", async ({ request }) => {
    await delay(500);
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

  // Login
  http.post("/auth/login", async ({ request }) => {
    await delay(500);
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

  // Get todos (protected)
  http.get("/todos", async ({ request }) => {
    await delay(300);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simulate random failures
    if (Math.random() < 0.1) {
      return HttpResponse.json({ error: "Server error" }, { status: 500 });
    }

    return HttpResponse.json({ todos });
  }),

  // Create todo (protected)
  http.post("/todos", async ({ request }) => {
    await delay(500);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const todoData = (await request.json()) as any;
    const newTodo = {
      id: String(nextId++),
      ...todoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);
    return HttpResponse.json(newTodo);
  }),
];
