import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import FormInput from '../../components/forms/FormInput';
import FormTextarea from '../../components/forms/FormTextarea';
import FormSelect from '../../components/forms/FormSelect';
import api from '../../services/api';

type Entity = {
  id?: number;
  name: string;
  description: string;
  risk_level: string;
  parent_id: number | null;
};

type ParentOption = {
  value: string;
  label: string;
};

const EntityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [parentOptions, setParentOptions] = useState<ParentOption[]>([]);
  
  const [formData, setFormData] = useState<Entity>({
    name: '',
    description: '',
    risk_level: '',
    parent_id: null
  });

  const isEditMode = !!id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all entities for parent selection
        const entitiesResponse = await api.get('/entities');
        const entities = entitiesResponse.data;
        
        const options = entities.map((entity: { id: number; name: string }) => ({
          value: entity.id.toString(),
          label: entity.name
        }));
        setParentOptions(options);

        // If editing, fetch the entity data
        if (isEditMode) {
          const entityResponse = await api.get(`/entities/${id}`);
          const entityData = entityResponse.data;
          setFormData({
            name: entityData.name,
            description: entityData.description || '',
            risk_level: entityData.risk_level || '',
            parent_id: entityData.parent_id
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
      [name]: value === '' ? (name === 'parent_id' ? null : '') : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/entities/${id}`, formData);
      } else {
        await api.post('/entities', formData);
      }
      navigate('/entities');
    } catch (error: any) {
      console.error('Error saving entity:', error);
      setFormError(error.response?.data?.error || 'Failed to save entity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title={isEditMode ? 'Edit Entity' : 'Create New Entity'}>
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={isEditMode ? 'Edit Entity' : 'Create New Entity'}>
      <Card>
        {formError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormInput
            id="name"
            label="Entity Name"
            value={formData.name}
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

          <FormSelect
            id="risk_level"
            label="Risk Level"
            value={formData.risk_level}
            onChange={handleInputChange}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' }
            ]}
          />

          <FormSelect
            id="parent_id"
            label="Parent Entity"
            value={formData.parent_id?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                parent_id: value ? parseInt(value) : null
              }));
            }}
            options={parentOptions}
          />

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/entities')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? <Loader size="small" /> : isEditMode ? 'Update Entity' : 'Create Entity'}
            </button>
          </div>
        </form>
      </Card>
    </MainLayout>
  );
};

export default EntityForm;
