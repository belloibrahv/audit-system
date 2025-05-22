import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

type MainLayoutProps = {
  children: ReactNode;
  title?: string;
};

const MainLayout = ({ children, title }: MainLayoutProps) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-20 p-8">
        {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
