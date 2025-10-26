import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProblemForm } from "@/components/ProblemForm";
import { LevelDisplay } from "@/components/LevelDisplay";
import { CheckCircle2, Zap, Shield, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const { user, signOut } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(107, 70, 193, 0.95), rgba(168, 85, 247, 0.9)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          {user ? (
            <Button onClick={signOut} variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              We solve <span className="text-accent">anything</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Submit any problem you're facing and get expert help. No problem is too big or too small.
            </p>
            <div className="flex flex-wrap gap-6 justify-center pt-4">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="w-5 h-5" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5" />
                <span>Expert Solutions</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Shield className="w-5 h-5" />
                <span>100% Confidential</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-2xl space-y-6">
          {user && (
            <LevelDisplay key={refreshKey} userId={user.id} />
          )}
          
          <Card 
            className="p-8 md:p-12 backdrop-blur-sm border-border/50"
            style={{
              background: "var(--gradient-card)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div className="space-y-4 mb-8 text-center">
              <h2 className="text-3xl font-bold">Submit Your Problem</h2>
              <p className="text-muted-foreground">
                {user 
                  ? "Fill out the form below and earn points for each submission!"
                  : "Sign in to track your progress and earn points for each submission!"}
              </p>
            </div>
            
            <ProblemForm onSubmitSuccess={handleFormSuccess} />
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Anything. We're here to help.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
