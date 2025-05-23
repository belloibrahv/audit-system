import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { AuditPlanFormData } from '../../schemas/auditPlan';

export const AuditPlanList = () => {
  const [plans, setPlans] = useState<(AuditPlanFormData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Audit Plans</h3>
      
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {plans.map((plan) => (
            <li key={plan.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{plan.projectName}</h4>
                  <p className="text-sm text-gray-500">{plan.auditType}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(plan.startDate).toLocaleDateString()} - 
                  {new Date(plan.endDate).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
          
          {plans.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No audit plans found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};