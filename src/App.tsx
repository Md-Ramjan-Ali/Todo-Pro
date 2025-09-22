import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './hooks/redux';
import { useTheme } from './hooks/useTheme'; // Import the hook
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ToastContainer from './components/ui/ToastContainer';
import Layout from './components/ui/Layout';
import Todos from './pages/Todos';


function App() {
  const { toasts } = useAppSelector((state) => state.ui);
  const { theme } = useAppSelector((state) => state.ui);

  // Use the theme hook to handle theme logic
  useTheme();

  return (
    <div className="min-h-screen transition-colors duration-200 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700" style={{
      backgroundColor: theme === "dark" ? "#1f2937" : "white",
      borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
    }}>
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
    </div>
  );
}

export default App;