import { useState, useEffect } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { todoService } from '../../services/todoService';
import TodoItem from './TodoItem';
import TodoListSkeleton from './TodoListSkeleton';
import EmptyState from '../ui/EmptyState';
import type { Todo } from '../../schemas/todos';

interface TodoListProps {
  onUpdate: () => void; // Add this prop
}

const TodoList = ({ onUpdate }: TodoListProps) => {
  const { filters } = useAppSelector((state) => state.todos);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTodos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await todoService.getTodos({
        page: filters.page,
        status: filters.status !== 'all' ? filters.status : undefined,
        search: filters.search,
        sortBy: filters.sortBy,
      });

      setTodos(data.todos);
    } catch (err: any) {
      setError(err.message || 'Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [filters]);

  const handleTodoUpdate = () => {
    loadTodos(); // Refresh the todos list
    onUpdate(); // Notify parent component
  };

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading todos"
        description={error}
        icon="alert"
      />
    );
  }

  if (todos.length === 0) {
    return (
      <EmptyState
        title="No todos found"
        description={filters.status !== 'all' || filters.search ?
          "Try adjusting your filters to see more results." :
          "Get started by creating your first todo!"
        }
        icon="inbox"
      />
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={handleTodoUpdate} // Pass the refresh function
        />
      ))}
    </div>
  );
};

export default TodoList;