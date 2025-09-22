import { Inbox, AlertCircle, Search } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: 'inbox' | 'alert' | 'search';
}

const EmptyState = ({ title, description, icon }: EmptyStateProps) => {
    const { theme } = useAppSelector((state) => state.ui);
  const icons = {
    inbox: <Inbox className="w-12 h-12 text-gray-400" />,
    alert: <AlertCircle className="w-12 h-12 text-yellow-400" />,
    search: <Search className="w-12 h-12 text-gray-400" />,
  };

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4" style={{
        color: theme === "dark" ? "white" : "#111827",
      }}>
        {icons[icon]}
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2" style={{
        color: theme === "dark" ? "white" : "#111827",
      }}>
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto" style={{
        color: theme === "dark" ? "white" : "#111827",
      }}>
        {description}
      </p>
    </div>
  );
};

export default EmptyState;