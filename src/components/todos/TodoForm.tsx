import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoService } from '../../services/todoService';
import { addToast } from '../../features/ui/uiSlice';
import { createTodoSchema, type CreateTodoData, type Todo } from '../../schemas/todos';
import { X, Calendar, Tag } from 'lucide-react';

interface TodoFormProps {
  todoId?: string; // Change from todo to todoId
  onClose: () => void;
  onTodoChanged?: () => void;
}

const TodoForm = ({ todoId, onClose, onTodoChanged }: TodoFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    reset: resetForm,
  } = useForm<CreateTodoData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      tags: [],
      dueDate: '',
    },
  });

  // Load todo data when in edit mode
  useEffect(() => {
    const loadTodoData = async () => {
      if (todoId) {
        setIsLoading(true);
        try {
          // Get all todos and find the one with matching ID
          const data = await todoService.getTodos({});
          const todoToEdit = data.todos.find(todo => todo.id === todoId);

          if (todoToEdit) {
            setCurrentTodo(todoToEdit);
            resetForm({
              title: todoToEdit.title,
              description: todoToEdit.description || '',
              status: todoToEdit.status,
              priority: todoToEdit.priority || 'medium',
              tags: todoToEdit.tags || [],
              dueDate: todoToEdit.dueDate || '',
            });
          }
        } catch (error) {
          console.error('Failed to load todo data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadTodoData();
  }, [todoId, resetForm]);

  const onSubmit = async (data: CreateTodoData) => {
    setIsLoading(true);
    try {
      if (todoId && currentTodo) {
        // Edit existing todo
        await todoService.updateTodo(todoId, data);
        addToast({ type: 'success', message: 'Todo updated!' });
      } else {
        // Create new todo
        await todoService.createTodo(data);
        addToast({ type: 'success', message: 'Todo created!' });
      }

      if (onTodoChanged) {
        onTodoChanged();
      }

      onClose();
      resetForm();
    } catch (error: any) {
      addToast({ type: 'error', message: error.message || 'Failed to save todo' });
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim()) {
      setValue('tags', [...(watch('tags') || []), tag.trim()]);
    }
  };

  const removeTag = (index: number) => {
    const currentTags = watch('tags') || [];
    setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {todoId ? 'Edit Todo' : 'Create Todo'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter todo title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter todo description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Due Date
            </label>
            <input
              {...register('dueDate')}
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(watch('tags') || []).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full dark:bg-blue-900 dark:text-blue-300"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add a tag and press Enter"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : todoId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;