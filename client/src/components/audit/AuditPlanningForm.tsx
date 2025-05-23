import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { BuildingOfficeIcon, UserIcon, UsersIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface AuditPlanFormData {
  project_name: string;
  audit_type: 'risk-based' | 'compliance' | 'operational' | 'internal';
  owner: string;
  location: string;
  personnel: string[];
  entities: string[];
  frequency: 'quarterly' | 'bi-annually' | 'annually';
  start_date: string;
  end_date: string;
  period_start_date: string;
  period_end_date: string;
  processes: string;
  units: string;
}

export const AuditPlanningForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<AuditPlanFormData>({
    project_name: '',
    audit_type: 'risk-based',
    owner: '',
    location: '',
    personnel: [],
    entities: [],
    frequency: 'quarterly',
    start_date: '',
    end_date: '',
    period_start_date: '',
    period_end_date: '',
    processes: '',
    units: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPlan(prev => ({
      ...prev,
      [name]: name === 'personnel' || name === 'entities' 
        ? value.split(',').map(item => item.trim())
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to create an audit plan');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('audit_plans')
        .insert({
          ...plan,
          created_by: user.id,
          status: 'draft'
        });

      if (error) throw error;

      toast.success('Audit plan created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating audit plan:', error);
      toast.error(error.message || 'Failed to create audit plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">Audit Planning</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-8">
            {/* Project Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Project Information
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audit Project Name
                  </label>
                  <input
                    type="text"
                    name="project_name"
                    value={plan.project_name}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audit Type
                  </label>
                  <div className="relative">
                    <select
                      name="audit_type"
                      value={plan.audit_type}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-3 pr-10 py-2"
                    >
                      <option value="">Select type</option>
                      <option value="risk-based">Risk Based</option>
                      <option value="compliance">Compliance</option>
                      <option value="operational">Operational Audit</option>
                      <option value="internal">Internal Audit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-4 w-4 text-gray-500" />
                      <span>Owner/Process owner</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={plan.owner}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter owner name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />
                      <span>Audit Location</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={plan.location}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter location"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4 text-gray-500" />
                      <span>Audit Personnel</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="personnel"
                    value={plan.personnel.join(', ')}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter personnel names, separated by commas"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Entities
                  </label>
                  <input
                    type="text"
                    name="entities"
                    value={plan.entities.join(', ')}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter entities, separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                      <span>Audit Frequency</span>
                    </div>
                  </label>
                  <select
                    name="frequency"
                    value={plan.frequency}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select frequency</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="bi-annually">Bi-annually</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>

                {/* Date Ranges */}
                <div className="col-span-2 grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audit Dates
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="date"
                          name="start_date"
                          value={plan.start_date}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500 mt-1">Start</span>
                      </div>
                      <div>
                        <input
                          type="date"
                          name="end_date"
                          value={plan.end_date}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500 mt-1">End</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period of Review
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="date"
                          name="period_start_date"
                          value={plan.period_start_date}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500 mt-1">Start</span>
                      </div>
                      <div>
                        <input
                          type="date"
                          name="period_end_date"
                          value={plan.period_end_date}
                          onChange={handleChange}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500 mt-1">End</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Areas */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <span>Processes included in the project</span>
                    </div>
                  </label>
                  <textarea
                    name="processes"
                    value={plan.processes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Describe the processes included"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center gap-1">
                      <DocumentTextIcon className="h-4 w-4 text-gray-500" />
                      <span>Units included in the project</span>
                    </div>
                  </label>
                  <textarea
                    name="units"
                    value={plan.units}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="List the units included"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              disabled={loading}
              onClick={() => navigate('/planning')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};