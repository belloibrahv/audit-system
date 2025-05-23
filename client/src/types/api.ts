export interface Audit {
  id: string;
  title: string;
  location: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  due_date: string;
  created_at: string;
}