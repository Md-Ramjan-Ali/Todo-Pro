import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { toggleTheme, addToast } from '../../features/ui/uiSlice';
import { Sun, Moon, LogOut, User } from 'lucide-react';

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ type: 'success', message: 'Logged out successfully' }));
    navigate('/login');
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <header
      className="transition-colors duration-200 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700"
      style={{
        backgroundColor: theme === "dark" ? "#1f2937" : "white",
        borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
      }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/app/todos"
            className="text-xl font-bold text-gray-900 transition-colors duration-200 rounded-md dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            style={{
              color: theme === "dark" ? "white" : "#111827",
            }}
          >
            Todo Pro
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200" style={{
                color: theme === "dark" ? "white" : "#111827",
              }}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} 
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                  <Sun style={{
                    color: theme === "dark" ? "white" : "#111827",
                  }} />
              )}
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200" style={{
              color: theme === "dark" ? "white" : "#111827",
            }}>
              <User className="w-4 h-4" aria-hidden="true" />
              <span aria-label="User name">{user?.name}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-600 dark:text-gray-300 transition-colors duration-200" style={{
                color: theme === "dark" ? "white" : "#111827",
              }}
              aria-label="Logout" 
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;