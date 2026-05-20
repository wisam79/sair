-- UniRide v2: Admin Profiles Insertion policy and Driver Promotion/Demotion Triggers

-- 1. Profiles policy for Admin insertion
CREATE POLICY "Profiles: Admins can insert any"
  ON public.profiles
  FOR INSERT
  WITH CHECK (is_admin());

-- 2. Driver promotion function
CREATE OR REPLACE FUNCTION public.sync_driver_role_promotion()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's role in public.profiles to 'driver'
  UPDATE public.profiles
  SET role = 'driver'
  WHERE id = NEW.user_id;

  -- Update the user's role in auth.users app_metadata to 'driver'
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'driver')
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Driver promotion
DROP TRIGGER IF EXISTS on_driver_created ON public.drivers;
CREATE TRIGGER on_driver_created
  AFTER INSERT ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_driver_role_promotion();

-- 3. Driver demotion function
CREATE OR REPLACE FUNCTION public.sync_driver_role_demotion()
RETURNS TRIGGER AS $$
BEGIN
  -- Update public.profiles back to 'student'
  UPDATE public.profiles
  SET role = 'student'
  WHERE id = OLD.user_id;

  -- Update auth.users app_metadata back to 'student'
  UPDATE auth.users
  SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'student')
  WHERE id = OLD.user_id;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Driver demotion
DROP TRIGGER IF EXISTS on_driver_deleted ON public.drivers;
CREATE TRIGGER on_driver_deleted
  AFTER DELETE ON public.drivers
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_driver_role_demotion();
