import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllEntities = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('audit_entities')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getEntityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('audit_entities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching entity:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createEntity = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, risk_level, parent_id } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
      .from('audit_entities')
      .insert({
        name,
        description,
        risk_level,
        parent_id,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating entity:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateEntity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, risk_level, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
      .from('audit_entities')
      .update({
        name,
        description,
        risk_level,
        parent_id,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteEntity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('audit_entities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: error.message });
  }
};
