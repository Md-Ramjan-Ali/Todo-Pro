import { useDispatch } from 'react-redux';
import { removeToast } from '../../features/ui/uiSlice';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
  }>;
}

const ToastContainer = ({ toasts }: ToastContainerProps) => {
  const dispatch = useDispatch();

  const handleRemoveToast = (id: string) => {
    dispatch(removeToast(id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onRemove={handleRemoveToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;