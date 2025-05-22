import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY! // Note: Use service key, not anon key
);

async function createAdminUser(email: string, password: string) {
  try {
    // First check if user exists
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('User already exists, updating...');
      // Update existing user if needed
    }

    // Create new user with confirmed email
    const { data, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      },
      app_metadata: {
        role: 'admin'
      }
    });

    if (userError) throw userError;
    if (!data?.user) throw new Error('User creation failed');

    // Get admin role id
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();

    if (roleError) throw roleError;
    if (!roleData) throw new Error('Admin role not found');

    // Assign admin role
    const { error: assignError } = await supabase
      .from('user_roles')
      .insert({
        user_id: data.user.id,
        role_id: roleData.id
      })
      .select()
      .single();

    if (assignError) throw assignError;

    console.log('Admin user created successfully:', {
      email: email,
      userId: data.user.id,
      roleId: roleData.id
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: ts-node create-admin.ts <email> <password>');
  process.exit(1);
}

// Execute
createAdminUser(email, password);