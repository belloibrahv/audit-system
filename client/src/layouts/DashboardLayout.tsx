import { ReactNode } from 'react';
import Navigation from '../components/Navigation';

type DashboardLayoutProps = {
  children: ReactNode;
  title: string;
};

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation />
      
      <div className="flex-1 pl-64">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
