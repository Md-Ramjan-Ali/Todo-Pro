import { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { todoService } from '../../services/todoService';
import { setSelectedTodo } from '../../features/todos/todosSlice';
import { addToast } from '../../features/ui/uiSlice';
import type { Todo } from '../../schemas/todos';
import { Edit3, Trash2, Calendar, Tag, Clock } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onUpdate: () => void; // Make this required
}

const TodoItem = ({ todo, onUpdate }: TodoItemProps) => {
  const dispatch = useAppDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };

  const priorityColors = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-red-600 dark:text-red-400',
  };

  const handleStatusChange = async (newStatus: Todo['status']) => {
    try {
      await todoService.updateTodo(todo.id, { status: newStatus });
      dispatch(addToast({ type: 'success', message: 'Todo updated!' }));
      onUpdate(); // Trigger refresh
    } catch (error: any) {
      dispatch(addToast({ type: 'error', message: error.message || 'Failed to update todo' }));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;

    setIsDeleting(true);
    try {
      await todoService.deleteTodo(todo.id);
      dispatch(addToast({ type: 'success', message: 'Todo deleted!' }));
      onUpdate(); // Trigger refresh
    } catch (error: any) {
      dispatch(addToast({ type: 'error', message: error.message || 'Failed to delete todo' }));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[todo.status]}`}>
              {todo.status.replace('_', ' ')}
            </span>
            {todo.priority && (
              <span className={`text-xs font-medium ${priorityColors[todo.priority]}`}>
                {todo.priority}
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {todo.title}
          </h3>

          {todo.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(todo.dueDate).toLocaleDateString()}
              </div>
            )}

            {todo.tags && todo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {todo.tags.join(', ')}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(todo.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <select
            value={todo.status}
            onChange={(e) => handleStatusChange(e.target.value as Todo['status'])}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button
            onClick={() => dispatch(setSelectedTodo(todo.id))}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            aria-label="Edit todo"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
            aria-label="Delete todo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;