import { useAppSelector } from '../hooks/redux';

const ThemeTest = () => {
  const { theme } = useAppSelector((state) => state.ui);

  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
      <h3 className="font-bold mb-2">Theme Debug</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>HTML has dark class: <strong>{document.documentElement.classList.contains('dark') ? 'Yes' : 'No'}</strong></p>
      <p>LocalStorage theme: <strong>{localStorage.getItem('theme') || 'None'}</strong></p>
      <p className="text-sm text-gray-500 dark:text-red-400 mt-2">Use the theme toggle button in the header to switch themes.</p>
    </div>
  );
};

export default ThemeTest;