-- Fix search_path for calculate_points_for_level function
CREATE OR REPLACE FUNCTION public.calculate_points_for_level(target_level INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF target_level <= 2 THEN
    RETURN 5;
  ELSE
    RETURN 5 + ((target_level - 2) * 15);
  END IF;
END;
$$;