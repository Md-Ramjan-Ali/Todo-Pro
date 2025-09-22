import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAppSelector } from '../../hooks/redux';


const Layout = () => {
    const { theme } = useAppSelector((state) => state.ui);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" style={{
      color: theme === "dark" ? "white" : "#111827",
    }}>
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-8" style={{
        backgroundColor: theme === "dark" ? "#1f2937" : "white",
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;