import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumLoaderProps {
  text?: string;
}

export const PremiumLoader: React.FC<PremiumLoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Main Neural/Graph Animation */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Central Core */}
          <motion.div
            className="absolute w-8 h-8 rounded-full bg-primary shadow-[0_0_30px_rgba(var(--primary),0.6)]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Orbiting Nodes */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{
                duration: 3 + i, // Varies speed for each orbit
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.5
              }}
            >
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/60 border border-background shadow-sm"
                style={{ top: -10 * (i + 1) }} // Offset each orbit
              />
            </motion.div>
          ))}

          {/* Connection Rings (Radar effect) */}
          <motion.div
            className="absolute rounded-full border border-primary/20"
            style={{ width: '100%', height: '100%' }}
            animate={{
              scale: [0.8, 1.5],
              opacity: [0.5, 0],
              borderWidth: ["1px", "0px"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
          <motion.div
            className="absolute rounded-full border border-primary/20"
            style={{ width: '100%', height: '100%' }}
            animate={{
              scale: [0.8, 1.5],
              opacity: [0.5, 0],
              borderWidth: ["1px", "0px"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 1
            }}
          />
        </div>

        {/* Text Section */}
        {text && (
          <div className="h-8 flex flex-col items-center justify-center relative w-max text-center px-4">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted-foreground font-mono text-sm tracking-wide"
            >
              {text}
            </motion.p>
          </div>
        )}
      </div>
    </div>
  );
};
