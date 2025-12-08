import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, MessageSquare, Database, ArrowRight, Activity, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const adminModules = [
    {
      title: "Algorithm Management",
      description: "Create, edit, and manage algorithm coding challenges, test cases, and solutions.",
      icon: Code2,
      path: "/admin/algorithms",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "User Feedback",
      description: "Review and respond to user bug reports, feature requests, and general feedback.",
      icon: MessageSquare,
      path: "/admin/feedback",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Feature Management",
      description: "Toggle features on/off in real-time using feature flags.",
      icon: Activity,
      path: "/admin/features",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      gradient: "from-emerald-500/20 to-teal-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Manage your application content and monitor system status.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Access</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview (Placeholder for now) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Algorithms</CardTitle>
              <Code2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Active problems</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Modules Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {adminModules.map((module, index) => (
            <motion.div key={index} variants={item}>
              <Card 
                className="group relative overflow-hidden border-muted/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer h-full flex flex-col"
                onClick={() => navigate(module.path)}
              >
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg ${module.bgColor} flex items-center justify-center mb-4 ring-1 ring-inset ring-white/10`}>
                    <module.icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10 flex-1 flex flex-col justify-between gap-4">
                  <CardDescription className="text-base leading-relaxed">
                    {module.description}
                  </CardDescription>
                  
                  <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors mt-auto pt-4">
                    <span>Open Module</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
