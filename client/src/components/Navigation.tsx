/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type NavItem = {
  name: string;
  path: string;
  icon: string;
  allowedRoles: string[];
};

const Navigation = () => {
  const { user, signOut, hasRole } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊', allowedRoles: ['admin', 'auditor', 'reviewer', 'viewer'] },
    { name: 'Audit Universe', path: '/entities', icon: '🌐', allowedRoles: ['admin', 'auditor', 'reviewer', 'viewer'] },
    { name: 'Audit Plans', path: '/plans', icon: '📅', allowedRoles: ['admin', 'auditor', 'reviewer', 'viewer'] },
    { name: 'Audits', path: '/audits', icon: '📋', allowedRoles: ['admin', 'auditor', 'reviewer', 'viewer'] },
    { name: 'Findings', path: '/findings', icon: '🔍', allowedRoles: ['admin', 'auditor', 'reviewer', 'viewer'] },
    { name: 'Reports', path: '/reports', icon: '📈', allowedRoles: ['admin', 'auditor', 'reviewer', 'viewer'] },
    { name: 'Admin', path: '/admin', icon: '⚙️', allowedRoles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.allowedRoles.some(role => hasRole(role))
  );

  return (
    <nav className="bg-gray-800 text-white h-screen w-64 p-4 fixed">
      <div className="flex items-center justify-center mb-8 p-2">
        <h1 className="text-xl font-bold">Audit Management</h1>
      </div>
      
      <ul>
        {filteredNavItems.map((item) => (
          <li key={item.name} className="mb-2">
            <Link
              to={item.path}
              className={`flex items-center p-3 rounded-md transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-600 text-white'
                  : 'hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      
      {hasRole('admin') && (
        <div className="mt-4">
          <Link
            to="/admin/users"
            className="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
          >
            <span className="mr-3">👥</span>
            User Management
          </Link>
        </div>
      )}
      
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <button
          onClick={signOut}
          className="w-full flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
        >
          <span className="mr-3">🚪</span>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
