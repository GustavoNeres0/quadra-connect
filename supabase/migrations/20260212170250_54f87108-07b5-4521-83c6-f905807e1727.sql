
-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all reservations
CREATE POLICY "Admins can view all reservations"
ON public.reservations
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to view all courts (already has public select, but ensure)
-- Courts already have "Anyone can view courts" so no change needed
