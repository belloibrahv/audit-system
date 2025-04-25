import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

type Audit = {
  id: number;
  title: string;
  description: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  audit_plan_id: number | null;
  entity_id: number | null;
  created_at: string;
  entity?: {
    id: number;
    name: string;
  };
  plan?: {
    id: number;
    title: string;
    year: number;
  };
};

type Finding = {
  id: number;
  title: string;
  risk_level: string;
  status: string;
  created_at: string;
};

type TeamMember = {
  id: number;
  user_id: string;
  role: string;
  user: {
    email: string;
  };
};

const AuditDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        // Fetch audit details
        const auditResponse = await api.get(`/audits/${id}`);
        setAudit(auditResponse.data);

        // Fetch audit findings
        const findingsResponse = await api.get(`/audits/${id}/findings`);
        setFindings(findingsResponse.data);

        // Fetch audit team members
        const teamResponse = await api.get(`/audits/${id}/team`);
        setTeamMembers(teamResponse.data);
      } catch (error) {
        console.error('Error fetching audit details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuditDetails();
  }, [id]);

  const handleEditAudit = () => {
    navigate(`/audits/${id}/edit`);
  };

  const handleAddFinding = () => {
    navigate(`/audits/${id}/findings/new`);
  };

  const handleViewFinding = (findingId: number) => {
    navigate(`/findings/${findingId}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <MainLayout title="Audit Details">
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  if (!audit) {
    return (
      <MainLayout title="Audit Details">
        <Card>
          <div className="text-center py-8">
            <p className="text-red-500">Audit not found or you don't have permission to view it.</p>
            <button 
              onClick={() => navigate('/audits')} 
              className="mt-4 btn btn-primary"
            >
              Back to Audits List
            </button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={audit.title}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <StatusBadge status={audit.status} />
          <span className="ml-2 text-gray-600">
            {audit.entity && `${audit.entity.name} • `}
            {audit.plan && `Plan: ${audit.plan.title} (${audit.plan.year})`}
          </span>
        </div>
        <button
          onClick={handleEditAudit}
          className="btn btn-primary"
        >
          Edit Audit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card title="Audit Information">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1">{audit.description || 'No description provided'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p>{formatDate(audit.start_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p>{formatDate(audit.end_date)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Audit Team">
          {teamMembers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <li key={member.id} className="py-2">
                  <div className="flex justify-between">
                    <p className="text-sm">{member.user.email}</p>
                    <p className="text-sm font-medium capitalize">{member.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No team members assigned yet.</p>
          )}
        </Card>

        <Card title="Audit Timeline">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="ml-3">
                <p className="text-sm font-medium">Audit Created</p>
                <p className="text-xs text-gray-500">{new Date(audit.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            {audit.start_date && (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Audit Started</p>
                  <p className="text-xs text-gray-500">{formatDate(audit.start_date)}</p>
                </div>
              </div>
            )}
            {audit.end_date && (
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Audit Completed</p>
                  <p className="text-xs text-gray-500">{formatDate(audit.end_date)}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card title="Audit Findings">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">{findings.length} findings</p>
          <button
            onClick={handleAddFinding}
            className="btn btn-secondary"
          >
            Add Finding
          </button>
        </div>

        {findings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="relative px-4 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {findings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{finding.title}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={finding.risk_level} type="risk" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={finding.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(finding.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewFinding(finding.id)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No findings recorded for this audit yet.</p>
            <button
              onClick={handleAddFinding}
              className="mt-4 btn btn-secondary"
            >
              Add Your First Finding
            </button>
          </div>
        )}
      </Card>
    </MainLayout>
  );
};

export default AuditDetails;
