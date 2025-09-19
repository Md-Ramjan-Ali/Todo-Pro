import { useAppSelector } from '../../hooks/redux';
import { useGetTodosQuery } from '../../features/todos/todosApi';
import TodoItem from './TodoItem';
import TodoListSkeleton from './TodoListSkeleton';
import EmptyState from '../ui/EmptyState';

const TodoList = () => {
  const { filters } = useAppSelector((state) => state.todos);
  const { data, error, isLoading } = useGetTodosQuery({
    page: filters.page,
    status: filters.status !== 'all' ? filters.status : undefined,
    search: filters.search,
    sortBy: filters.sortBy,
  });

  if (isLoading) {
    return <TodoListSkeleton />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading todos"
        description="There was a problem loading your todos. Please try again."
        icon="alert"
      />
    );
  }

  if (!data?.todos || data.todos.length === 0) {
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
      {data.todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;