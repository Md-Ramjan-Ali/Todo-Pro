import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {  clearSelectedTodo } from '../features/todos/todosSlice';
import TodoList from '../components/todos/TodoList';
import Filters from '../components/todos/Filters';
import Pagination from '../components/todos/Pagination';
import TodoForm from '../components/todos/TodoForm';
import { Plus } from 'lucide-react';

const Todos = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const { selectedTodoId } = useAppSelector((state) => state.todos);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCloseModal = () => {
    dispatch(clearSelectedTodo()); 
    setIsCreateModalOpen(false);
  };

  const handleTodoChanged = () => {
    // Increment refresh trigger to force components to reload
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{
          color: theme === "dark" ? "white" : "#111827",
        }}>
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
      <TodoList
        key={refreshTrigger}
        onUpdate={handleTodoChanged}
      />
      <Pagination onUpdate={handleTodoChanged} />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <TodoForm
          onClose={handleCloseModal}
          onTodoChanged={handleTodoChanged}
        />
      )}

      {/* Edit Modal - Only show when selectedTodoId exists */}
      {selectedTodoId && (
        <TodoForm
          todoId={selectedTodoId} // Pass the todoId instead of undefined
          onClose={handleCloseModal}
          onTodoChanged={handleTodoChanged}
        />
      )}
    </div>
  );
};

export default Todos;