import { useAppSelector, useAppDispatch } from '../../hooks/redux'; // Updated import
import { removeToast } from '../../features/ui/uiSlice';
import Toast from './Toast';

const ToastContainer = () => {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.ui); // Updated hook

  const handleRemoveToast = (id: string) => {
    dispatch(removeToast(id));
  };

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