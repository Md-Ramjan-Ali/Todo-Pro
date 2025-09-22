import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import {
  setStatusFilter,
  setSearchFilter,
  setSortBy,
  clearFilters,
} from '../../features/todos/todosSlice';
// import { Search, Filter, X } from 'lucide-react';
import { Search, X } from 'lucide-react';

const Filters = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.todos);
  const hasActiveFilters = filters.status !== 'all' || filters.search || filters.sortBy !== 'createdAt';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6" style={{
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
    }}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search Input */}
        <div className="flex-1 w-full sm:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Search todos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" style={{
                color: theme === "dark" ? "white" : "#111827",
              }} />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search todos..."
              value={filters.search}
              onChange={(e) => dispatch(setSearchFilter(e.target.value))}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "white",
                borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
              }}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-auto">
          <label htmlFor="status" className="sr-only">
            Filter by status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => dispatch(setStatusFilter(e.target.value as any))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            style={{
              backgroundColor: theme === "dark" ? "#1f2937" : "white",
              color: theme === "dark" ? "white" : "#111827",
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="w-full sm:w-auto">
          <label htmlFor="sort" className="sr-only">
            Sort by
          </label>
          <select
            id="sort"
            value={filters.sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            style={{
              backgroundColor: theme === "dark" ? "#1f2937" : "white",
              color: theme === "dark" ? "white" : "#111827",
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            }}
          >
            <option value="createdAt">Newest First</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            style={{
              backgroundColor: theme === "dark" ? "#1f2937" : "white",
              color: theme === "dark" ? "white" : "#111827",
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
            }}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;