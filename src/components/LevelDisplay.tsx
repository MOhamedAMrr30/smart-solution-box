import { useEffect, useState } from "react";
import { Trophy, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface LevelDisplayProps {
  userId: string;
}

export const LevelDisplay = ({ userId }: LevelDisplayProps) => {
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [pointsForNextLevel, setPointsForNextLevel] = useState(5);

  const calculatePointsForLevel = (targetLevel: number): number => {
    if (targetLevel <= 2) return 5;
    return 5 + ((targetLevel - 2) * 15);
  };

  useEffect(() => {
    const fetchProgress = async () => {
      const { data } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (data) {
        setLevel(data.level);
        setPoints(data.points);
        setPointsForNextLevel(calculatePointsForLevel(data.level + 1));
      } else {
        await supabase.from("user_progress").insert({ user_id: userId });
      }
    };

    fetchProgress();
  }, [userId]);

  const progressPercentage = (points / pointsForNextLevel) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold">Level {level}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-lg font-semibold">{points} points</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress to Level {level + 1}</span>
            <span>{points} / {pointsForNextLevel}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
