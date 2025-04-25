import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllAudits = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select(`
        *,
        audit_entities(name),
        audit_plans(title, year)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching audits:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAuditById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data: audit, error } = await supabase
      .from('audits')
      .select(`
        *,
        audit_entities(id, name),
        audit_plans(id, title, year)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    // Get team members
    const { data: teamMembers, error: teamError } = await supabase
      .from('audit_team_members')
      .select(`
        id, role,
        users:user_id(id, email)
      `)
      .eq('audit_id', id);

    if (teamError) throw teamError;

    // Get findings
    const { data: findings, error: findingsError } = await supabase
      .from('findings')
      .select(`
        id, title, risk_level, status
      `)
      .eq('audit_id', id);

    if (findingsError) throw findingsError;

    res.status(200).json({
      ...audit,
      team_members: teamMembers || [],
      findings: findings || []
    });
  } catch (error: any) {
    console.error('Error fetching audit:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      title, 
      description, 
      audit_plan_id, 
      entity_id, 
      status, 
      start_date, 
      end_date 
    } = req.body;
    const userId = req.user?.id;

    if (!title || !entity_id) {
      return res.status(400).json({ error: 'Title and entity ID are required' });
    }

    const { data, error } = await supabase
      .from('audits')
      .insert({
        title,
        description,
        audit_plan_id,
        entity_id,
        status: status || 'planned',
        start_date,
        end_date,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating audit:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      audit_plan_id, 
      entity_id, 
      status, 
      start_date, 
      end_date 
    } = req.body;

    if (!title || !entity_id) {
      return res.status(400).json({ error: 'Title and entity ID are required' });
    }

    const { data, error } = await supabase
      .from('audits')
      .update({
        title,
        description,
        audit_plan_id,
        entity_id,
        status,
        start_date,
        end_date,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating audit:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('audits')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting audit:', error);
    res.status(500).json({ error: error.message });
  }
};

export const assignTeamMember = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id, role } = req.body;

    if (!user_id || !role) {
      return res.status(400).json({ error: 'User ID and role are required' });
    }

    // Check if audit exists
    const { data: audit, error: auditError } = await supabase
      .from('audits')
      .select('id')
      .eq('id', id)
      .single();

    if (auditError || !audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    // Check if user is already assigned
    const { data: existingMember, error: checkError } = await supabase
      .from('audit_team_members')
      .select('id')
      .eq('audit_id', id)
      .eq('user_id', user_id)
      .single();

    if (existingMember) {
      return res.status(400).json({ error: 'User is already assigned to this audit' });
    }

    // Assign team member
    const { data, error } = await supabase
      .from('audit_team_members')
      .insert({
        audit_id: id,
        user_id,
        role
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error assigning team member:', error);
    res.status(500).json({ error: error.message });
  }
};
