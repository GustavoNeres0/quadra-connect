
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('user', 'landlord', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND approved = true
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can request a role"
ON public.user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can manage roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Landlord policies for courts: CRUD
CREATE POLICY "Landlords can create courts"
ON public.courts FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'landlord') AND auth.uid() = owner_id);

CREATE POLICY "Landlords can update their courts"
ON public.courts FOR UPDATE
USING (public.has_role(auth.uid(), 'landlord') AND auth.uid() = owner_id);

CREATE POLICY "Landlords can delete their courts"
ON public.courts FOR DELETE
USING (public.has_role(auth.uid(), 'landlord') AND auth.uid() = owner_id);

-- Blocked slots table
CREATE TABLE public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id uuid NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
  blocked_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  reason text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blocked slots"
ON public.blocked_slots FOR SELECT
USING (true);

CREATE POLICY "Landlords can create blocked slots"
ON public.blocked_slots FOR INSERT
WITH CHECK (
  auth.uid() = created_by
  AND EXISTS (SELECT 1 FROM public.courts WHERE id = court_id AND owner_id = auth.uid())
);

CREATE POLICY "Landlords can delete blocked slots"
ON public.blocked_slots FOR DELETE
USING (
  auth.uid() = created_by
  AND EXISTS (SELECT 1 FROM public.courts WHERE id = court_id AND owner_id = auth.uid())
);

-- Landlords can view reservations for their courts
CREATE POLICY "Landlords can view reservations for their courts"
ON public.reservations FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.courts WHERE id = court_id AND owner_id = auth.uid())
);

-- Landlords can update reservations for their courts (cancel)
CREATE POLICY "Landlords can update reservations for their courts"
ON public.reservations FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM public.courts WHERE id = court_id AND owner_id = auth.uid())
);

-- Add landlord-specific fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS cnpj text;
