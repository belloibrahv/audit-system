import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const getAllAudits = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('audits')
      .select(`
        *,
        audit_plans(title, year),
        audit_entities(name, risk_level)
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
    const { data, error } = await supabase
      .from('audits')
      .select(`
        *,
        audit_plans(title, year),
        audit_entities(name, risk_level),
        audit_team_members(user_id, role)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    res.status(200).json(data);
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
      end_date,
      team_members
    } = req.body;
    
    const userId = req.user?.id;

    if (!title || !entity_id) {
      return res.status(400).json({ error: 'Title and entity_id are required' });
    }

    // Start a Supabase transaction
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

    // Add team members if provided
    if (team_members && team_members.length > 0 && data) {
      const teamMembersToInsert = team_members.map((member: any) => ({
        audit_id: data.id,
        user_id: member.user_id,
        role: member.role
      }));

      const { error: teamError } = await supabase
        .from('audit_team_members')
        .insert(teamMembersToInsert);

      if (teamError) throw teamError;
    }

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
      return res.status(400).json({ error: 'Title and entity_id are required' });
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

export const getAuditTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('audit_team_members')
      .select('*')
      .eq('audit_id', id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching audit team:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAuditTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { team_members } = req.body;

    if (!team_members || !Array.isArray(team_members)) {
      return res.status(400).json({ error: 'Valid team_members array is required' });
    }

    // Delete existing team members
    const { error: deleteError } = await supabase
      .from('audit_team_members')
      .delete()
      .eq('audit_id', id);

    if (deleteError) throw deleteError;

    // Add new team members
    const teamMembersToInsert = team_members.map((member: any) => ({
      audit_id: id,
      user_id: member.user_id,
      role: member.role
    }));

    const { data, error } = await supabase
      .from('audit_team_members')
      .insert(teamMembersToInsert)
      .select();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error updating audit team:', error);
    res.status(500).json({ error: error.message });
  }
};
