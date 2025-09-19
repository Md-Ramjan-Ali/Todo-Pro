import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './hooks/redux'; // Updated import
import { setTheme } from './features/ui/uiSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';
import Layout from './components/ui/Layout';
import Todos from './pages/Todos';

function App() {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.ui); // Updated hook

  useEffect(() => {
    // Apply theme on initial load
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        dispatch(setTheme(e.matches ? 'dark' : 'light'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="todos" element={<Todos />} />
            <Route index element={<Navigate to="todos" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/app/todos" replace />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;