import React from 'react';
import { motion } from 'framer-motion';
import { 
  Circle, 
  Triangle, 
  Square, 
  GitGraph, 
  Activity, 
  Network, 
  Workflow,
  Binary
} from "lucide-react";

export const AlgorithmLoader = () => {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Floating Elements (Geometry & Flowchart symbols) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingIcon icon={Circle} x="-30%" y="-20%" color="text-blue-500/20" duration={15} delay={0} size={120} />
        <FloatingIcon icon={Triangle} x="35%" y="10%" color="text-yellow-500/20" duration={18} delay={2} size={100} />
        <FloatingIcon icon={Square} x="-25%" y="35%" color="text-green-500/20" duration={20} delay={4} size={90} />
        <FloatingIcon icon={GitGraph} x="30%" y="-30%" color="text-purple-500/20" duration={25} delay={1} size={110} />
        <FloatingIcon icon={Network} x="0%" y="40%" color="text-red-500/20" duration={22} delay={3} size={130} />
        <FloatingIcon icon={Workflow} x="40%" y="40%" color="text-cyan-500/20" duration={19} delay={5} size={80} />
        <FloatingIcon icon={Binary} x="-40%" y="0%" color="text-indigo-500/20" duration={17} delay={1.5} size={100} />
      </div>

      {/* Central Content Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 flex flex-col items-center gap-8 p-12 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        {/* Sorting/Graph Animation */}
        <div className="flex items-end gap-2 h-24 mb-2">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-6 rounded-t-lg bg-gradient-to-t from-primary to-violet-500"
              initial={{ height: "20%" }}
              animate={{
                height: ["20%", "85%", "40%", "100%", "20%"],
                filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <motion.h2 
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% auto" }}
          >
            Loading Algorithm Problem
          </motion.h2>
          
          <div className="flex items-center gap-1.5">
             <motion.span 
               className="w-2 h-2 rounded-full bg-primary"
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1, repeat: Infinity, delay: 0 }}
             />
             <motion.span 
               className="w-2 h-2 rounded-full bg-primary"
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
             />
             <motion.span 
               className="w-2 h-2 rounded-full bg-primary"
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
             />
          </div>
          
          <p className="text-sm text-muted-foreground/80 mt-2 font-mono">
            Initializing environment & visualizations...
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const FloatingIcon = ({ icon: Icon, x, y, color, duration, delay, size }: any) => (
  <motion.div
    className={`absolute ${color}`}
    style={{ left: `calc(50% + ${x})`, top: `calc(50% + ${y})` }}
    initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
    animate={{ 
      opacity: [0.1, 0.3, 0.1], 
      y: [0, -30, 0],
      rotate: [0, 45, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
  >
    <Icon size={size} strokeWidth={1} />
  </motion.div>
);
