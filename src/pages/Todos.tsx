import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { setSelectedTodo } from '../features/todos/todosSlice';
import TodoList from '../components/todos/TodoList';
import Filters from '../components/todos/Filters';
import Pagination from '../components/todos/Pagination';
import TodoForm from '../components/todos/TodoForm';
import { Plus } from 'lucide-react';

const Todos = () => {
  const dispatch = useAppDispatch();
  const { selectedTodoId } = useAppSelector((state) => state.todos);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleEditTodo = (id: string) => {
    dispatch(setSelectedTodo(id));
  };

  const handleCloseModal = () => {
    dispatch(setSelectedTodo(null));
    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Todos
        </h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Todo
        </button>
      </div>

      <Filters />
      <TodoList />
      <Pagination />

      {/* Modals */}
      {isCreateModalOpen && (
        <TodoForm onClose={handleCloseModal} />
      )}

      {selectedTodoId && (
        <TodoForm
          todo={undefined} // We'll fetch the todo data in the form component
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Todos;