import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllPlans = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('audit_plans')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getPlanById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('audit_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, year, status } = req.body;
    const userId = req.user?.id;

    if (!title || !year) {
      return res.status(400).json({ error: 'Title and year are required' });
    }

    const { data, error } = await supabase
      .from('audit_plans')
      .insert({
        title,
        description,
        year,
        status: status || 'draft',
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, year, status } = req.body;

    if (!title || !year) {
      return res.status(400).json({ error: 'Title and year are required' });
    }

    const { data, error } = await supabase
      .from('audit_plans')
      .update({
        title,
        description,
        year,
        status,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deletePlan = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('audit_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: error.message });
  }
};
