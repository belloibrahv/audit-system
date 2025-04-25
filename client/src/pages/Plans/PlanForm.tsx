
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSelect from '../../components/forms/FormSelect';
import api from '../../services/api';

type Plan = {
  id?: number;
  title: string;
  description: string;
  year: number | string;
  status: string;
};

const PlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  
  const [formData, setFormData] = useState<Plan>({
    title: '',
    description: '',
    year: new Date().getFullYear(),
    status: 'draft'
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchPlan = async () => {
      if (!isEditMode) return;
      
      setLoading(true);
      try {
        const response = await api.get(`/plans/${id}`);
        const planData = response.data;
        setFormData({
          title: planData.title,
          description: planData.description || '',
          year: planData.year,
          status: planData.status || 'draft'
        });
      } catch (error) {
        console.error('Error fetching plan:', error);
        setFormError('Failed to load plan data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
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
      // Convert year to number before sending
      const submissionData = {
        ...formData,
        year: Number(formData.year)
      };

      if (isEditMode) {
        await api.put(`/plans/${id}`, submissionData);
      } else {
        await api.post('/plans', submissionData);
      }
      navigate('/plans');
    } catch (error: any) {
      console.error('Error saving plan:', error);
      setFormError(error.response?.data?.error || 'Failed to save plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title={isEditMode ? 'Edit Audit Plan' : 'Create New Audit Plan'}>
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={isEditMode ? 'Edit Audit Plan' : 'Create New Audit Plan'}>
      <Card>
        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            id="title"
            label="Plan Title"
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

          <FormInput
            id="year"
            label="Plan Year"
            type="number"
            value={formData.year.toString()}
            onChange={handleInputChange}
            required
          />

          <FormSelect
            id="status"
            label="Status"
            value={formData.status}
            onChange={handleInputChange}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'review', label: 'In Review' },
              { value: 'approved', label: 'Approved' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' }
            ]}
            required
          />

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/plans')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? <Loader size="small" /> : isEditMode ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
};

export default PlanForm;
