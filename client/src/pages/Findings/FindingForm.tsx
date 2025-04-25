import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSelect from '../../components/forms/FormSelect';
import api from '../../services/api';

type Finding = {
  id?: number;
  audit_id: number | null;
  title: string;
  description: string;
  risk_level: string;
  status: string;
};

type Audit = {
  id: number;
  title: string;
};

const FindingForm = () => {
  const { id, auditId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [audits, setAudits] = useState<Audit[]>([]);
  
  const [formData, setFormData] = useState<Finding>({
    audit_id: auditId ? parseInt(auditId) : null,
    title: '',
    description: '',
    risk_level: '',
    status: 'draft'
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all audits for selection
        const auditsResponse = await api.get('/audits');
        setAudits(auditsResponse.data);

        // If editing, fetch the finding data
        if (isEditMode) {
          const findingResponse = await api.get(`/findings/${id}`);
          const findingData = findingResponse.data;
          setFormData({
            audit_id: findingData.audit_id,
            title: findingData.title,
            description: findingData.description || '',
            risk_level: findingData.risk_level || '',
            status: findingData.status || 'draft'
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/findings/${id}`, formData);
      } else {
        await api.post('/findings', formData);
      }
      
      // Redirect back to the audit details if we came from there
      if (auditId) {
        navigate(`/audits/${auditId}`);
      } else {
        navigate('/audits');
      }
    } catch (error: any) {
      console.error('Error saving finding:', error);
      setFormError(error.response?.data?.error || 'Failed to save finding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title={isEditMode ? 'Edit Finding' : 'Create New Finding'}>
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={isEditMode ? 'Edit Finding' : 'Create New Finding'}>
      <Card>
        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!auditId && (
            <FormSelect
              id="audit_id"
              label="Audit"
              value={formData.audit_id?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  audit_id: value ? parseInt(value) : null
                }));
              }}
              options={audits.map(audit => ({
                value: audit.id.toString(),
                label: audit.title
              }))}
              required
            />
          )}

          <FormInput
            id="title"
            label="Finding Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <FormTextarea
            id="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            required
          />

          <FormSelect
            id="risk_level"
            label="Risk Level"
            value={formData.risk_level}
            onChange={handleInputChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'critical', label: 'Critical' }
            ]}
            required
          />

          <FormSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'open', label: 'Open' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'closed', label: 'Closed' },
              { value: 'accepted', label: 'Risk Accepted' }
            ]}
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => auditId ? navigate(`/audits/${auditId}`) : navigate('/audits')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? <Loader size="small" /> : isEditMode ? 'Update Finding' : 'Create Finding'}
            </button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
};

export default FindingForm;
