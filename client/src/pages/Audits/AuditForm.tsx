import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSelect from '../../components/forms/FormSelect';
import api from '../../services/api';

type AuditFormData = {
  title: string;
  description: string;
  audit_plan_id: number | null;
  entity_id: number | null;
  status: string;
  start_date: string;
  end_date: string;
};

type Option = {
  value: string;
  label: string;
};

const AuditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [planOptions, setPlanOptions] = useState<Option[]>([]);
  const [entityOptions, setEntityOptions] = useState<Option[]>([]);
  
  const [formData, setFormData] = useState<AuditFormData>({
    title: '',
    description: '',
    audit_plan_id: null,
    entity_id: null,
    status: 'planned',
    start_date: '',
    end_date: ''
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch plans for dropdown
        const plansResponse = await api.get('/plans');
        const plans = plansResponse.data;
        const planOptions = plans.map((plan: { id: number; title: string; year: number }) => ({
          value: plan.id.toString(),
          label: `${plan.title} (${plan.year})`
        }));
        setPlanOptions(planOptions);

        // Fetch entities for dropdown
        const entitiesResponse = await api.get('/entities');
        const entities = entitiesResponse.data;
        const entityOptions = entities.map((entity: { id: number; name: string }) => ({
          value: entity.id.toString(),
          label: entity.name
        }));
        setEntityOptions(entityOptions);

        // If editing, fetch the audit data
        if (isEditMode) {
          const auditResponse = await api.get(`/audits/${id}`);
          const auditData = auditResponse.data;
          setFormData({
            title: auditData.title,
            description: auditData.description || '',
            audit_plan_id: auditData.audit_plan_id,
            entity_id: auditData.entity_id,
            status: auditData.status,
            start_date: auditData.start_date || '',
            end_date: auditData.end_date || ''
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
      [name]: value === '' ? (name === 'audit_plan_id' || name === 'entity_id' ? null : '') : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      // Format data for API
      const apiData = {
        ...formData,
        audit_plan_id: formData.audit_plan_id ? Number(formData.audit_plan_id) : null,
        entity_id: formData.entity_id ? Number(formData.entity_id) : null,
      };

      if (isEditMode) {
        await api.put(`/audits/${id}`, apiData);
      } else {
        await api.post('/audits', apiData);
      }
      navigate('/audits');
    } catch (error: any) {
      console.error('Error saving audit:', error);
      setFormError(error.response?.data?.error || 'Failed to save audit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title={isEditMode ? 'Edit Audit' : 'Create New Audit'}>
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={isEditMode ? 'Edit Audit' : 'Create New Audit'}>
      <Card>
        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            id="title"
            label="Audit Title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />

          <FormTextarea
            id="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              id="entity_id"
              label="Auditable Entity"
              value={formData.entity_id?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  entity_id: value ? parseInt(value) : null
                }));
              }}
              options={entityOptions}
              required
            />

            <FormSelect
              id="audit_plan_id"
              label="Audit Plan"
              value={formData.audit_plan_id?.toString() || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  audit_plan_id: value ? parseInt(value) : null
                }));
              }}
              options={planOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect
              id="status"
              label="Status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'planned', label: 'Planned' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'review', label: 'Under Review' },
                { value: 'completed', label: 'Completed' },
                { value: 'follow_up', label: 'Follow-up' }
              ]}
              required
            />

            <FormInput
              id="start_date"
              label="Start Date"
              value={formData.start_date}
              onChange={handleInputChange}
              type="date"
            />

            <FormInput
              id="end_date"
              label="End Date"
              value={formData.end_date}
              onChange={handleInputChange}
              type="date"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/audits')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? <Loader size="small" /> : isEditMode ? 'Update Audit' : 'Create Audit'}
            </button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
};

export default AuditForm;
