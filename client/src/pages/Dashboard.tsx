import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import {
  ClockIcon,
  MapPinIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { UserManagementModal } from '../components/UserManagement';

interface AuditTask {
  id: string;
  title: string;
  location: string;
  status: 'in_progress' | 'not_started' | 'completed';
  progress?: number;
  dueDate: string;
  created_at: string;
}

type PostgrestError = {
  message: string;
  details: string;
  hint: string;
  code: string;
};

const Dashboard = () => {
  // State management
  const { user } = useAuth();
  const [tasks, setTasks] = useState<AuditTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Derived values
  const userName = user?.user_metadata?.firstName || user?.email?.split('@')[0] || 'User';

  // Effects
  useEffect(() => {
    fetchTasks();
  }, []);

  // Data fetching
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('audits')
        .select(`
          id,
          title,
          location,
          status,
          progress,
          due_date,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      if (data) {
        const formattedTasks = data.map(task => ({
          id: task.id,
          title: task.title || 'Untitled Audit',
          location: task.location || 'No location',
          status: task.status || 'not_started',
          progress: task.progress || 0,
          dueDate: task.due_date || new Date().toISOString(),
          created_at: task.created_at
        }));
        setTasks(formattedTasks);
      }
    } catch (err) {
      const error = err as PostgrestError;
      setError(error.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleUserCreated = () => {
    fetchTasks();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  // UI Components
  const TaskCard = ({ task }: { task: AuditTask }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <ClipboardDocumentListIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-medium">{task.title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPinIcon className="h-4 w-4 mr-1" />
            {task.location}
          </div>
          {task.progress !== undefined && (
            <div className="mt-2 w-32">
              <div className="h-1.5 bg-gray-200 rounded-full">
                <div
                  className="h-1.5 bg-blue-600 rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-500">
          <ClockIcon className="h-4 w-4 inline mr-1" />
          Due {new Date(task.dueDate).toLocaleDateString()}
        </span>
        <Link
          to={`/audits/${task.id}`}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Start audit
        </Link>
      </div>
    </div>
  );

  const WeeklyCalendar = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay());

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigateWeek('prev')}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-600">
            {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
            {new Date(startOfWeek.setDate(startOfWeek.getDate() + 6))
              .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button 
            onClick={() => navigateWeek('next')}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-sm text-gray-500 mb-1">{day}</div>
              <div className="text-sm font-medium">
                {new Date(startOfWeek.setDate(startOfWeek.getDate() + (index === 0 ? 0 : 1))).getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Welcome Back {userName} 👋</h1>
          <p className="text-gray-600">Let's get started to make things easier</p>
        </div>
        {user?.user_metadata?.role === 'admin' && (
          <button
            onClick={() => setShowUserModal(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create User
          </button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-6">Your Pending Audit Tasks</h2>
            {error ? (
              <div className="text-center py-4 text-red-600">{error}</div>
            ) : loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No pending tasks</div>
            ) : (
              <div className="space-y-4">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Calendar & Recent */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
            <WeeklyCalendar />
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recently Completed</h2>
            {/* Recently completed tasks will be implemented here */}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserManagementModal
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
};

export default Dashboard;