import { useAudits } from '../../hooks/useAudits';
import { format } from 'date-fns';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

const DashboardCard = ({ title, value, icon, color = 'blue' }: DashboardCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className={`text-3xl font-semibold text-${color}-600`}>{value}</p>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { audits, loading, error } = useAudits(5);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const activeAudits = audits.filter(audit => audit.status === 'in_progress').length;
  const completedAudits = audits.filter(audit => audit.status === 'completed').length;
  const pendingAudits = audits.filter(audit => audit.status === 'draft').length;

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard 
          title="Active Audits" 
          value={activeAudits}
          icon="📋"
          color="blue"
        />
        <DashboardCard 
          title="Pending Reviews" 
          value={pendingAudits}
          icon="⏳"
          color="yellow"
        />
        <DashboardCard 
          title="Completed Audits" 
          value={completedAudits}
          icon="✅"
          color="green"
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Audit Plans</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {audits.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No audit plans found</p>
          ) : (
            audits.map((audit) => (
              <div key={audit.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{audit.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{audit.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      audit.status === 'completed' ? 'bg-green-100 text-green-800' :
                      audit.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {audit.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(audit.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}