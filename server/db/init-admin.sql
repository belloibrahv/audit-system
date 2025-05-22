-- Create the first admin user
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  role
) VALUES (
  'belloibrahv@gmail.com',
  crypt('password123$@', gen_salt('bf')),
  now(),
  'authenticated'
);

-- Get the user id of the admin we just created
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user id
  SELECT id INTO admin_user_id FROM auth.users 
  WHERE email = 'belloibrahv@gmail.com';

  -- Ensure admin role exists
  INSERT INTO public.roles (name, permissions)
  VALUES ('admin', '["*"]')
  ON CONFLICT (name) DO NOTHING;

  -- Assign admin role to user
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT admin_user_id, id
  FROM public.roles
  WHERE name = 'admin';
END $$;