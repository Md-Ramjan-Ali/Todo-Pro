import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/redux';
import { setCredentials } from '../features/auth/authSlice';
import { addToast } from '../features/ui/uiSlice';
import RegisterForm from '../components/auth/RegisterForm';
import type { RegisterFormData } from '../schemas/auth';
import { mockApi } from '../utils/mockApi';

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Try MSW first, fallback to mockApi if it fails
      let response;

      try {
        response = await fetch('/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } catch (error) {
        console.log(error);
        // If fetch fails (MSW not working), use mockApi
        const data = await mockApi.register(formData.name, formData.email, formData.password);
        dispatch(setCredentials({ user: data.user, token: data.token }));
        dispatch(addToast({ type: 'success', message: 'Account created successfully!' }));
        navigate('/app/todos', { replace: true });
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      dispatch(setCredentials({ user: data.user, token: data.token }));
      dispatch(addToast({ type: 'success', message: 'Account created successfully!' }));
      navigate('/app/todos', { replace: true });
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join us to start managing your todos
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10">
          <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Register;