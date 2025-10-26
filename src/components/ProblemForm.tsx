import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const problemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000, "Description must be less than 1000 characters"),
});

type ProblemFormData = z.infer<typeof problemSchema>;

interface ProblemFormProps {
  onSubmitSuccess?: () => void;
}

export const ProblemForm = ({ onSubmitSuccess }: ProblemFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProblemFormData>({
    name: "",
    email: "",
    category: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProblemFormData, string>>>({});
  const [excuse, setExcuse] = useState<string>("");

  const calculatePointsForLevel = (targetLevel: number): number => {
    if (targetLevel <= 2) return 5;
    return 5 + ((targetLevel - 2) * 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = problemSchema.parse(formData);
      
      const response = await fetch("https://moamr321.app.n8n.cloud/webhook-test/2f999fc3-e701-40ec-918b-0a130823771c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) throw new Error("Failed to submit problem");

      const responseData = await response.json();
      setExcuse(responseData.output || "");
      
      toast.success("Problem submitted successfully!");

      if (user) {
        const { data: currentProgress } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (currentProgress) {
          let newPoints = currentProgress.points + 1;
          let newLevel = currentProgress.level;
          let pointsNeeded = calculatePointsForLevel(newLevel + 1);

          while (newPoints >= pointsNeeded) {
            newLevel++;
            pointsNeeded = calculatePointsForLevel(newLevel + 1);
          }

          await supabase
            .from("user_progress")
            .update({ points: newPoints, level: newLevel })
            .eq("user_id", user.id);

          if (newLevel > currentProgress.level) {
            toast.success(`🎉 Level Up! You're now Level ${newLevel}!`);
          }

          onSubmitSuccess?.();
        }
      }
      
      setFormData({ name: "", email: "", category: "", description: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ProblemFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ProblemFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please check the form for errors");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {excuse && (
        <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
          <h3 className="text-lg font-semibold mb-2">Here is your excuse</h3>
          <p className="text-foreground/80">{excuse}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Problem Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger className={errors.category ? "border-destructive" : ""}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Technical Issue</SelectItem>
              <SelectItem value="account">Account Problem</SelectItem>
              <SelectItem value="billing">Billing Question</SelectItem>
              <SelectItem value="feature">Feature Request</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Problem Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your problem in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={`min-h-[150px] ${errors.description ? "border-destructive" : ""}`}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? "Submitting..." : "Submit Problem"}
        </Button>
      </form>
    </div>
  );
};
