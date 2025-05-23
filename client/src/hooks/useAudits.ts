import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Audit {
  id: string;
  title: string;
  location: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export function useAudits(limit = 5) {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAudits() {
      try {
        const { data, error } = await supabase
          .from('audit_plans')
          .select('id, project_name, location, status, start_date, end_date, created_at')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        const formattedData: Audit[] = data?.map(item => ({
          id: item.id,
          title: item.project_name,
          location: item.location,
          status: item.status,
          start_date: item.start_date,
          end_date: item.end_date,
          created_at: item.created_at
        })) || [];

        setAudits(formattedData);
      } catch (err) {
        console.error('Error fetching audits:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch audits');
      } finally {
        setLoading(false);
      }
    }

    fetchAudits();
  }, [limit]);

  return { audits, loading, error };
}