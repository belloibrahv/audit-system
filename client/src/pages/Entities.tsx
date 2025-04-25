import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';

type Entity = {
  id: number;
  name: string;
  description: string | null;
  risk_level: 'low' | 'medium' | 'high' | null;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
};

const Entities = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    risk_level: '',
    parent_id: ''
  });

  const queryClient = useQueryClient();

  // Fetch entities
  const { data: entities = [], isLoading, error } = useQuery<Entity[]>({
    queryKey: ['entities'],
    queryFn: async () => {
      const response = await api.get('/entities');
      return response.data;
    }
  });

  // Create entity mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/entities', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      resetForm();
    }
  });

  // Update entity mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/entities/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      resetForm();
    }
  });

  // Delete entity mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/entities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      risk_level: '',
      parent_id: ''
    });
    setEditingEntity(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      description: formData.description || null,
      risk_level: formData.risk_level || null,
      parent_id: formData.parent_id ? parseInt(formData.parent_id) : null
    };

    if (editingEntity) {
      updateMutation.mutate({ id: editingEntity.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setFormData({
      name: entity.name,
      description: entity.description || '',
      risk_level: entity.risk_level || '',
      parent_id: entity.parent_id ? entity.parent_id.toString() : ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this entity?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout title="Audit Universe">
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-700">
          Manage the entities in your audit universe.
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Entity'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingEntity ? 'Edit Entity' : 'Add Entity'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level
                </label>
                <select
                  value={formData.risk_level}
                  onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
                  className="input w-full"
                >
                  <option value="">-- Select Risk Level --</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Entity
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="input w-full"
                >
                  <option value="">-- None --</option>
                  {entities.map((entity) => (
                    <option 
                      key={entity.id} 
                      value={entity.id}
                      disabled={editingEntity?.id === entity.id}
                    >
                      {entity.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                  rows={3}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="btn bg-gray-300 text-gray-800 mr-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : editingEntity
                  ? 'Update Entity'
                  : 'Add Entity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded text-red-700">
          Error loading entities. Please try again.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entities.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 text-center text-gray-500" colSpan={4}>
                    No entities found. Add your first entity to get started.
                  </td>
                </tr>
              ) : (
                entities.map((entity) => (
                  <tr key={entity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entity.name}
                      </div>
                      {entity.description && (
                        <div className="text-sm text-gray-500">
                          {entity.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${entity.risk_level === 'low' 
                          ? 'bg-green-100 text-green-800' 
                          : entity.risk_level === 'medium' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : entity.risk_level === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'}`
                      }>
                        {entity.risk_level ? entity.risk_level.charAt(0).toUpperCase() + entity.risk_level.slice(1) : 'Not set'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entity.parent_id ? 
                        entities.find(e => e.id === entity.parent_id)?.name || 'Unknown' : 
                        '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(entity)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entity.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Entities;
