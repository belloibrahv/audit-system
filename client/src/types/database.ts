export type AuditType = 'risk-based' | 'compliance' | 'operational' | 'internal';
export type AuditFrequency = 'quarterly' | 'bi-annually' | 'annually';
export type AuditStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';

export interface AuditPlan {
  id: string;
  project_name: string;
  audit_type: AuditType;
  owner: string;
  location: string;
  personnel: string[];
  entities: string[];
  frequency: AuditFrequency;
  start_date: string;
  end_date: string;
  period_start_date: string;
  period_end_date: string;
  processes: string;
  units: string;
  status: AuditStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}