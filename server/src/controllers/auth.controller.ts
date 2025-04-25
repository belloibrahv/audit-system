import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth.middleware';

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user information
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('roles(id, name, permissions)')
      .eq('user_id', userId);

    if (rolesError) throw rolesError;

    // Format the response
    const user = {
      id: userData.user.id,
      email: userData.user.email,
      roles: userRoles?.map(ur => ({
        id: ur.roles.id,
        name: ur.roles.name,
        permissions: ur.roles.permissions
      })) || []
    };

    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Currently, we're only allowing to update email
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { email }
    );

    if (error) throw error;

    res.status(200).json({ message: 'Profile updated successfully', user: data.user });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    // Get all users from Supabase Auth
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) throw error;

    // Get all user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, roles(name)');

    if (rolesError) throw rolesError;

    // Create a map of user_id to roles
    const roleMap = new Map();
    userRoles?.forEach(ur => {
      if (!roleMap.has(ur.user_id)) {
        roleMap.set(ur.user_id, []);
      }
      roleMap.get(ur.user_id).push(ur.roles.name);
    });

    // Format the response
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      roles: roleMap.get(user.id) || []
    }));

    res.status(200).json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: error.message });
  }
};

export const assignRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // user_id
    const { role_id } = req.body;

    if (!role_id) {
      return res.status(400).json({ error: 'Role ID is required' });
    }

    // Check if user exists
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(id);
    
    if (userError || !userData.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if role exists
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('id', role_id)
      .single();

    if (roleError || !roleData) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if user already has this role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', id)
      .eq('role_id', role_id)
      .single();

    if (existingRole) {
      return res.status(400).json({ error: 'User already has this role' });
    }

    // Assign role to user
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: id,
        role_id
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: 'Role assigned successfully', data });
  } catch (error: any) {
    console.error('Error assigning role:', error);
    res.status(500).json({ error: error.message });
  }
};
