import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

type Finding = {
  id: number;
  audit_id: number;
  title: string;
  description: string;
  risk_level: string;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  audit: {
    title: string;
  };
};

type Recommendation = {
  id: number;
  finding_id: number;
  description: string;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  created_at: string;
};

const FindingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [finding, setFinding] = useState<Finding | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFindingDetails = async () => {
      try {
        // Fetch finding details
        const findingResponse = await api.get(`/findings/${id}`);
        setFinding(findingResponse.data);

        // Fetch recommendations for this finding
        const recommendationsResponse = await api.get(`/findings/${id}/recommendations`);
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error('Error fetching finding details:', error);
        setError('Failed to load finding details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFindingDetails();
  }, [id]);

  const handleEditFinding = () => {
    navigate(`/findings/${id}/edit`);
  };

  const handleAddRecommendation = () => {
    navigate(`/findings/${id}/recommendations/new`);
  };

  const handleBackToAudit = () => {
    if (finding?.audit_id) {
      navigate(`/audits/${finding.audit_id}`);
    } else {
      navigate('/audits');
    }
  };

  if (loading) {
    return (
      <MainLayout title="Finding Details">
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  if (error || !finding) {
    return (
      <MainLayout title="Finding Details">
        <Card>
          <div className="p-4 text-red-700">{error || 'Finding not found'}</div>
          <button
            onClick={() => navigate('/audits')}
            className="mt-4 btn btn-primary"
          >
            Back to Audits
          </button>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Finding Details">
      <div className="mb-6">
        <button
          onClick={handleBackToAudit}
          className="text-primary-600 hover:text-primary-800 flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back to Audit: {finding.audit?.title || `Audit #${finding.audit_id}`}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Finding Information">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h1 className="text-2xl font-bold text-gray-900">{finding.title}</h1>
                <button
                  onClick={handleEditFinding}
                  className="btn btn-secondary"
                >
                  Edit Finding
                </button>
              </div>
              
              <div className="mt-2 flex items-center">
                <StatusBadge status={finding.status} />
                <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Last updated: {new Date(finding.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Risk Level</h3>
              <StatusBadge status={finding.risk_level} type="risk" />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{finding.description}</p>
            </div>
          </Card>

          <Card title="Recommendations" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Action items to address this finding</p>
              <button
                onClick={handleAddRecommendation}
                className="btn btn-primary"
              >
                Add Recommendation
              </button>
            </div>

            {recommendations.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="py-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-gray-900">Recommendation #{recommendation.id}</h4>
                      <StatusBadge status={recommendation.status} />
                    </div>
                    <p className="mt-2 text-gray-700">{recommendation.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {recommendation.due_date && (
                        <div>Due: {new Date(recommendation.due_date).toLocaleDateString()}</div>
                      )}
                      {recommendation.assigned_to && (
                        <div>Assigned to: {recommendation.assigned_to}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recommendations have been added yet.</p>
            )}
          </Card>
        </div>

        <div>
          <Card title="Finding Details">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created By</h4>
                <p className="mt-1">{finding.created_by || 'Unknown'}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created Date</h4>
                <p className="mt-1">{new Date(finding.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                <p className="mt-1">{new Date(finding.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>

          <Card title="Actions" className="mt-6">
            <div className="space-y-3">
              <button
                onClick={handleEditFinding}
                className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Edit Finding
              </button>
              <button
                onClick={handleAddRecommendation}
                className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Add Recommendation
              </button>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default FindingDetails;
