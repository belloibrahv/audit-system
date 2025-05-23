import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  GlobeAltIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  DocumentIcon,
  LightBulbIcon,
  CheckCircleIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';

const MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    path: '/'
  },
  {
    id: 'universe',
    label: 'Audit Universe',
    icon: GlobeAltIcon,
    path: '/universe'
  },
  {
    id: 'risk-audit',
    label: 'Risk Based Audit Scheduling',
    icon: CalendarIcon,
    path: '/risk-audit'
  },
  {
    id: 'planning',
    label: 'Audit planning',
    icon: ClipboardDocumentListIcon,
    path: '/planning'
  },
  {
    id: 'fieldwork',
    label: 'Fieldwork execution',
    icon: MagnifyingGlassIcon,
    path: '/fieldwork'
  },
  {
    id: 'workpaper',
    label: 'Workpaper & Evidence Upload',
    icon: DocumentIcon,
    path: '/workpaper'
  },
  {
    id: 'findings',
    label: 'Findings & Recommendations',
    icon: LightBulbIcon,
    path: '/findings'
  },
  {
    id: 'remediation',
    label: 'Remediation & Follow up',
    icon: CheckCircleIcon,
    path: '/remediation'
  },
  {
    id: 'repository',
    label: 'Document Repository',
    icon: FolderIcon,
    path: '/repository'
  }
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-lg h-screen">
      <div className="h-full flex flex-col">
        <div className="flex-1">
          <nav className="px-3 py-4">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-150 ease-in-out mb-1
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  end
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};