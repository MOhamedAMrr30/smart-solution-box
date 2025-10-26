import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserProgress {
  points: number;
  level: number;
  pointsForNextLevel: number;
}

export const useUserProgress = (user: User | null) => {
  const [progress, setProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    pointsForNextLevel: 5,
  });
  const [loading, setLoading] = useState(true);

  const calculatePointsForLevel = (level: number): number => {
    if (level <= 2) return 5;
    return 5 + ((level - 2) * 15);
  };

  const fetchProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (!data) {
        // Create initial progress
        const { data: newProgress, error: insertError } = await supabase
          .from("user_progress")
          .insert({ user_id: user.id, points: 0, level: 1 })
          .select()
          .single();

        if (insertError) throw insertError;

        setProgress({
          points: 0,
          level: 1,
          pointsForNextLevel: 5,
        });
      } else {
        setProgress({
          points: data.points,
          level: data.level,
          pointsForNextLevel: calculatePointsForLevel(data.level + 1),
        });
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPoints = async (pointsToAdd: number = 1) => {
    if (!user) return;

    try {
      const { data: currentProgress } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!currentProgress) return;

      let newPoints = currentProgress.points + pointsToAdd;
      let newLevel = currentProgress.level;
      let pointsNeeded = calculatePointsForLevel(newLevel + 1);

      // Check for level up
      while (newPoints >= pointsNeeded) {
        newLevel++;
        pointsNeeded = calculatePointsForLevel(newLevel + 1);
      }

      const { error } = await supabase
        .from("user_progress")
        .update({ points: newPoints, level: newLevel })
        .eq("user_id", user.id);

      if (error) throw error;

      setProgress({
        points: newPoints,
        level: newLevel,
        pointsForNextLevel: pointsNeeded,
      });

      return { leveledUp: newLevel > currentProgress.level, newLevel };
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [user]);

  return { progress, loading, addPoints, refetch: fetchProgress };
};
