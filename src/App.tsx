import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import { useTheme } from './hooks/useTheme'; // Import the hook
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';
import Layout from './components/ui/Layout';
import Todos from './pages/Todos';
// Add this import
import ThemeTest from './components/ThemeTest';

function App() {
  const { toasts } = useAppSelector((state) => state.ui);

  // Use the theme hook to handle theme logic
  useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app/*"
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
      <ToastContainer toasts={toasts} />
      <ThemeTest />
    </div>
  );
}

export default App;