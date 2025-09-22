import { useAppSelector } from "../../hooks/redux";

const TodoListSkeleton = () => {
  const { theme } = useAppSelector((state) => state.ui);
  return (
    <div className="space-y-3" >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-pulse" style={{
            backgroundColor: theme === "dark" ? "#1f2937" : "white",
          }}
        >
          <div className="flex items-start justify-between" >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" style={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "white",
                }}></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" style={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "white",
                }}></div>
              </div>

              <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "white",
              }}></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "white",
              }}></div>

              <div className="flex items-center gap-4">
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" style={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "white",
                }}></div>
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" style={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "white",
                }}></div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" style={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "white",
                }}></div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4">
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "white",
              }}></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "white",
              }}></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded" style={{
                backgroundColor: theme === "dark" ? "#1f2937" : "white",
              }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoListSkeleton;