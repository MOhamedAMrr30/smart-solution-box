-- Create function to update timestamps (if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create function to calculate points needed for next level
CREATE OR REPLACE FUNCTION public.calculate_points_for_level(target_level INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF target_level <= 2 THEN
    RETURN 5;
  ELSE
    RETURN 5 + ((target_level - 2) * 15);
  END IF;
END;
$$;

-- Create trigger for automatic timestamp updates (drop first if exists)
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();