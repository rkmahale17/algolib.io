import { CloudOff } from "lucide-react";
import { Card } from "@/components/ui/card";

const MaintenancePage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-background/50 backdrop-blur-sm">
      <Card className="max-w-md w-full p-8 glass-card border-primary/20 shadow-2xl relative overflow-hidden text-center space-y-6 animate-in fade-in zoom-in duration-500">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700" />

        {/* Icon Animation */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
            <div className="relative bg-background/80 p-4 rounded-full border-2 border-primary/20 shadow-inner">
                <CloudOff className="w-10 h-10 text-primary animate-bounce duration-1000" />
            </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Naughty Cloud is Offline!
            </h1>
            
            <div className="space-y-2 text-muted-foreground">
                <p>
                    Oops! It seems our servers decided to take an unscheduled coffee break. ☕
                </p>
                <p className="text-sm">
                    They're currently being thoroughly scolded. We should be back online shortly!
                </p>
            </div>
        </div>

        <div className="pt-4 flex justify-center">
           <div className="h-1 w-16 bg-primary/20 rounded-full overflow-hidden">
             <div className="h-full bg-primary w-1/2 animate-[shimmer_2s_infinite]" />
           </div>
        </div>

      </Card>
    </div>
  );
};

export default MaintenancePage;
