import { useEffect } from 'react';
import { X, CheckCircle, XCircle, Info } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  onRemove: (id: string) => void;
}

const Toast = ({ id, type, message, onRemove }: ToastProps) => {
   const { theme } = useAppSelector((state) => state.ui);
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg border ${styles[type]} shadow-lg animate-in slide-in-from-right-full`}
    >
      <div className="mr-2">{icons[type]}</div>
      <div className="flex-1 mr-2">{message}</div>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-gray-600" 
        style={{
          color: theme === "dark" ? "white" : "#111827",
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;