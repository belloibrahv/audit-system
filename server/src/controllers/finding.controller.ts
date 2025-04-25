import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllFindings = async (req: AuthRequest, res: Response) => {
  try {
    const auditId = req.query.audit_id;
    
    let query = supabase
      .from('findings')
      .select(`
        *,
        audits(id, title),
        recommendations(id, description, status, due_date)
      `);
    
    if (auditId) {
      query = query.eq('audit_id', auditId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching findings:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getFindingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data: finding, error } = await supabase
      .from('findings')
      .select(`
        *,
        audits(id, title)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!finding) {
      return res.status(404).json({ error: 'Finding not found' });
    }

    // Get recommendations
    const { data: recommendations, error: recError } = await supabase
      .from('recommendations')
      .select(`
        *,
        assigned_user:assigned_to(id, email)
      `)
      .eq('finding_id', id);

    if (recError) throw recError;

    res.status(200).json({
      ...finding,
      recommendations: recommendations || []
    });
  } catch (error: any) {
    console.error('Error fetching finding:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createFinding = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      audit_id, 
      title, 
      description, 
      risk_level, 
      status 
    } = req.body;
    const userId = req.user?.id;

    if (!audit_id || !title) {
      return res.status(400).json({ error: 'Audit ID and title are required' });
    }

    const { data, error } = await supabase
      .from('findings')
      .insert({
        audit_id,
        title,
        description,
        risk_level: risk_level || 'medium',
        status: status || 'draft',
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating finding:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateFinding = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      risk_level, 
      status 
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('findings')
      .update({
        title,
        description,
        risk_level,
        status,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Finding not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating finding:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteFinding = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('findings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting finding:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // finding_id
    const { 
      description, 
      status, 
      assigned_to, 
      due_date 
    } = req.body;
    const userId = req.user?.id;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        finding_id: id,
        description,
        status: status || 'open',
        assigned_to,
        due_date,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating recommendation:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateRecommendation = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      description, 
      status, 
      assigned_to, 
      due_date 
    } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const { data, error } = await supabase
      .from('recommendations')
      .update({
        description,
        status,
        assigned_to,
        due_date,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating recommendation:', error);
    res.status(500).json({ error: error.message });
  }
};