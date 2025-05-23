import { AuditPlanningForm } from '../../components/audit/AuditPlanningForm';
import { AuditPlanList } from '../../components/audit/AuditPlanList';

export const PlanningPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <AuditPlanningForm />
      <AuditPlanList />
    </div>
  );
};