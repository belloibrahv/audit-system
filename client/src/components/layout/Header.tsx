import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Auditors</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
            </button>
            <div className="relative">
              <button 
                onClick={signOut}
                className="flex items-center gap-2 p-2 text-gray-700 hover:text-gray-900"
              >
                <UserCircleIcon className="h-6 w-6" />
                <span className="text-sm">{user?.email}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};