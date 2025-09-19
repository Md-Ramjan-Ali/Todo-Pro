import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { setCredentials } from '../features/auth/authSlice';
import { addToast } from '../features/ui/uiSlice';
import LoginForm from '../components/auth/LoginForm';
import type { LoginFormData } from '../schemas/auth';
import { mockApi } from '../utils/mockApi';

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/app/todos';

  const handleSubmit = async (formData: LoginFormData) => {
    setIsLoading(true);
    try {
      // Try MSW first, fallback to mockApi if it fails
      let response;

      try {
        response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (error) {
        console.log(error);
        // If fetch fails (MSW not working), use mockApi
        const data = await mockApi.login(formData.email, formData.password);
        dispatch(setCredentials({ user: data.user, token: data.token }));
        dispatch(addToast({ type: 'success', message: 'Login successful!' }));
        navigate(from, { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      dispatch(setCredentials({ user: data.user, token: data.token }));
      dispatch(addToast({ type: 'success', message: 'Login successful!' }));
      navigate(from, { replace: true });
    } catch (error: any) {
      dispatch(addToast({ type: 'error', message: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Manage your todos efficiently
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Login;