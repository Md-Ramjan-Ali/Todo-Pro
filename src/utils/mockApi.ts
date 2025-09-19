// Simple mock API functions that don't require Service Worker
export const mockApi = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock user data
    const mockUser = {
      id: "1",
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    if (email === mockUser.email && password === mockUser.password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      const token = btoa(JSON.stringify({ userId: mockUser.id }));
      return { user: userWithoutPassword, token };
    }

    throw new Error("Invalid credentials");
  },

  register: async (name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if user already exists (in a real app, this would be a DB check)
    if (email === "test@example.com") {
      throw new Error("User already exists");
    }

    // Create new user
    const newUser = {
      id: String(Math.random().toString(36).substr(2, 9)),
      name,
      email,
      password,
    };

    const { password: _, ...userWithoutPassword } = newUser;
    const token = btoa(JSON.stringify({ userId: newUser.id }));

    return { user: userWithoutPassword, token };
  },
};
