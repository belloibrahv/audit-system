import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
// import Card from '../components/Card';
import Loader from '../components/Loader';
import api from '../services/api';

type Stats = {
  auditCount: number;
  openFindings: number;
  pendingRecommendations: number;
  entitiesCount: number;
};

type RecentAudit = {
  id: number;
  title: string;
  status: string;
  start_date: string;
};

const Dashboard = () => {
  // const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAudits, setRecentAudits] = useState<RecentAudit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, we'd have a dedicated endpoint for dashboard stats
        // For now, we'll simulate it with separate calls
        
        // Get audits count
        const auditsResponse = await api.get('/audits');
        const audits = auditsResponse.data;
        
        // Get findings count
        const findingsResponse = await api.get('/findings');
        const findings = findingsResponse.data;
        const openFindings = findings.filter((f: any) => f.status !== 'closed').length;
        
        // Get entities count
        const entitiesResponse = await api.get('/entities');
        const entities = entitiesResponse.data;
        
        // Calculate pending recommendations
        let pendingRecommendations = 0;
        findings.forEach((finding: any) => {
          if (finding.recommendations) {
            pendingRecommendations += finding.recommendations.filter(
              (r: any) => r.status !== 'closed' && r.status !== 'implemented'
            ).length;
          }
        });
        
        setStats({
          auditCount: audits.length,
          openFindings,
          pendingRecommendations,
          entitiesCount: entities.length,
        });
        
        // Get recent audits
        const recentAudits = audits
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        
        setRecentAudits(recentAudits);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const navigateToAudit = (id: number) => {
    navigate(`/audits/${id}`);
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      planning: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      review: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
      draft: "bg-gray-100 text-gray-800"
    };
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Audit Management Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Audit Dashboard</h1>
        <p className="text-gray-600">Here's an overview of your audit management system</p>
      </div>
      
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-500 hover:shadow-lg transition duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Total Audits</div>
                <div className="text-3xl font-bold text-indigo-700">{stats?.auditCount || 0}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-yellow-500 hover:shadow-lg transition duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Open Findings</div>
                <div className="text-3xl font-bold text-yellow-700">{stats?.openFindings || 0}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-orange-500 hover:shadow-lg transition duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Pending Recommendations</div>
                <div className="text-3xl font-bold text-orange-700">{stats?.pendingRecommendations || 0}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-green-500 hover:shadow-lg transition duration-300">
          <div className="p-5">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600">Audit Universe</div>
                <div className="text-3xl font-bold text-green-700">{stats?.entitiesCount || 0} <span className="text-sm font-normal">entities</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Audits and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Audits - Takes 2/3 of the space on medium+ screens */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Recent Audits</h2>
              <button 
                onClick={() => navigate('/audits')}
                className="text-xs font-medium px-2 py-1 rounded bg-white text-indigo-800 hover:bg-indigo-50"
              >
                View All
              </button>
            </div>
            
            {recentAudits.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recentAudits.map((audit) => (
                  <div key={audit.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => navigateToAudit(audit.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium block truncate"
                        >
                          {audit.title}
                        </button>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{audit.start_date ? new Date(audit.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not started'}</span>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                          {audit.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No recent audits</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new audit.</p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/audits/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Audit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions - 1/3 of the space */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-900">
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            
            <div className="p-4 space-y-3">
              <button
                onClick={() => navigate('/audits/new')}
                className="w-full flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="flex-shrink-0 mr-3 p-2 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Create New Audit</p>
                  <p className="text-sm text-gray-500">Start a new audit engagement</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/entities/new')}
                className="w-full flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="flex-shrink-0 mr-3 p-2 rounded-full bg-green-100 text-green-600 group-hover:bg-green-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add to Audit Universe</p>
                  <p className="text-sm text-gray-500">Create a new auditable entity</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/plans/new')}
                className="w-full flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="flex-shrink-0 mr-3 p-2 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Create Audit Plan</p>
                  <p className="text-sm text-gray-500">Plan audits for a period</p>
                </div>
              </button>
              
              <button
                onClick={() => navigate('/findings')}
                className="w-full flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 group"
              >
                <div className="flex-shrink-0 mr-3 p-2 rounded-full bg-yellow-100 text-yellow-600 group-hover:bg-yellow-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Review Findings</p>
                  <p className="text-sm text-gray-500">Track and manage issues</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;