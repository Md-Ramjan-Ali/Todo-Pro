import { z } from "zod";

export const todoStatusSchema = z.enum(["todo", "in_progress", "done"]);
export const todoPrioritySchema = z.enum(["low", "medium", "high"]);

export const todoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: todoStatusSchema.default("todo"),
  priority: todoPrioritySchema.optional(),
  tags: z.array(z.string()).optional(),
  dueDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createTodoSchema = todoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTodoSchema = createTodoSchema.partial();

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoData = z.infer<typeof createTodoSchema>;
export type UpdateTodoData = z.infer<typeof updateTodoSchema>;
export type TodoStatus = z.infer<typeof todoStatusSchema>;
export type TodoPriority = z.infer<typeof todoPrioritySchema>;
