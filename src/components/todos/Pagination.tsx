import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { setPage } from '../../features/todos/todosSlice';
import { todoService } from '../../services/todoService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PaginationProps {
  onUpdate: () => void; 
}

const Pagination = ({ onUpdate }: PaginationProps) => {
  const { theme } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.todos);
  const [paginationData, setPaginationData] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1
  });

  useEffect(() => {
    const loadPaginationData = async () => {
      try {
        const data = await todoService.getTodos({
          page: filters.page,
          status: filters.status !== 'all' ? filters.status : undefined,
          search: filters.search,
          sortBy: filters.sortBy,
        });

        setPaginationData({
          totalCount: data.totalCount,
          totalPages: data.totalPages,
          currentPage: data.currentPage
        });
      } catch (error) {
        console.error('Failed to load pagination data:', error);
      }
    };

    loadPaginationData();
  }, [filters, onUpdate]);

  const currentPage = filters.page;
  const totalPages = paginationData.totalPages;

  if (!paginationData || totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
    onUpdate(); 
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" style={{
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
    }}>
      <div className="text-sm text-gray-700 dark:text-gray-300" style={{
        color: theme === "dark" ? "white" : "#111827",
      }}>
        Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * 10, paginationData.totalCount || 0)}</span> of{' '}
        <span className="font-medium">{paginationData.totalCount || 0}</span> results
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          style={{
            backgroundColor: theme === "dark" ? "#1f2937" : "white",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={`min-w-[2.5rem] px-2 py-1 rounded-md border text-sm ${page === currentPage
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
              } ${page === '...' ? 'pointer-events-none' : ''}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:hover:bg-gray-700"
          style={{
            backgroundColor: theme === "dark" ? "#1f2937" : "white",
            borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;