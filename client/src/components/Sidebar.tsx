import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  DocumentTextIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: HomeIcon, label: 'Overview' },
    { path: '/audits', icon: ClipboardDocumentListIcon, label: 'Audits' },
    { path: '/plans', icon: DocumentTextIcon, label: 'Plans' },
    { path: '/entities', icon: ChartBarIcon, label: 'Entities' },
    ...(user?.user_metadata?.role === 'admin' 
      ? [{ path: '/admin/users', icon: UserGroupIcon, label: 'Users' }] 
      : []),
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally add a toast notification here
    }
  };

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 z-10 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4">
        <div className="flex items-center justify-center h-14 mb-8">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className={`h-8 ${!isExpanded && 'w-8 object-contain'}`}
          />
          {isExpanded && (
            <span className="ml-2 text-xl font-semibold">
              Audit System
            </span>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center py-3 px-4 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-6 w-6" />
                {isExpanded && (
                  <span className="ml-3">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={handleLogout}
          className={`flex items-center py-3 px-4 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors ${
            isExpanded ? 'justify-start' : 'justify-center'
          }`}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          {isExpanded && (
            <span className="ml-3">Logout</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;