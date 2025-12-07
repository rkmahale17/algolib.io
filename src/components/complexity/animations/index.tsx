
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- O(1) Constant Time Animation ---
export const ConstantTimeAnim = ({ n }: { n: number }) => {
  return (
    <div className="flex flex-col items-center gap-4">
       <div className="flex gap-1 flex-wrap justify-center max-w-[300px]">
          {Array.from({ length: n }).map((_, i) => (
             <motion.div 
               key={i} 
               layout
               className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-muted-foreground/20'}`}
             />
          ))}
       </div>
       <div className="text-center text-xs text-muted-foreground">
          Accessing Index [0] takes 1 step, regardless of N.
       </div>
       <motion.div 
         className="w-12 h-12 bg-green-500/20 border-2 border-green-500 rounded-lg flex items-center justify-center font-bold text-green-500"
         animate={{ scale: [1, 1.1, 1] }}
         transition={{ repeat: Infinity, duration: 2 }}
       >
         1
       </motion.div>
    </div>
  );
};

// --- O(n) Linear Search Animation ---
export const LinearAnim = ({ n }: { n: number }) => {
    return (
        <div className="w-full h-full flex flex-col justify-center gap-2">
            <div className="flex gap-1 flex-wrap justify-center overflow-hidden h-[100px] content-start">
             {Array.from({ length: Math.min(n, 100) }).map((_, i) => (
                <motion.div
                    key={i}
                    className="w-2 h-8 bg-yellow-500/30 rounded-full"
                    animate={{ 
                        opacity: [0.3, 1, 0.3],
                        backgroundColor: ["rgba(234, 179, 8, 0.3)", "rgba(234, 179, 8, 1)", "rgba(234, 179, 8, 0.3)"]
                    }}
                    transition={{ 
                        duration: 1, 
                        delay: i * 0.05, // Linear delay creates the "scanning" wave
                        repeat: Infinity,
                        repeatDelay: (Math.min(n, 100) * 0.05) 
                    }}
                />
             ))}
            </div>
            <div className="text-center text-xs text-muted-foreground mt-2">
                Scanning N items one by one...
            </div>
        </div>
    );
};

// --- O(log n) Binary Search Animation ---
export const LogarithmicAnim = ({ n }: { n: number }) => {
    // Only show visualization for reasonable N
    const maxItems = Math.min(n, 32); 
    const steps = Math.ceil(Math.log2(maxItems));
    
    return (
       <div className="flex flex-col items-center gap-4">
          <div className="flex gap-0.5 items-end h-20">
             {Array.from({ length: maxItems }).map((_, i) => (
                 <motion.div 
                    key={i}
                    className="w-1.5 bg-blue-500/40"
                    style={{ height: `${(i+1)/maxItems * 100}%` }}
                 />
             ))}
          </div>
          <div className="flex flex-col gap-1 items-center">
             {Array.from({ length: steps }).map((_, step) => (
                <motion.div 
                    key={step}
                    className="h-1 bg-blue-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 / Math.pow(2, step)}%` }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                />
             ))}
          </div>
          <div className="text-xs text-muted-foreground">
             Problem space halves each step ({steps} steps for {maxItems} items)
          </div>
       </div>
    );
}

// --- O(n^2) Quadratic Animation ---
export const QuadraticAnim = ({ n }: { n: number }) => {
    // Clamp N for grid rendering to avoid crashing interaction
    const size = Math.min(n, 10);
    
    return (
        <div className="flex flex-col items-center">
            <div 
                className="grid gap-0.5 mb-2" 
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
                {Array.from({ length: size * size }).map((_, i) => {
                    const row = Math.floor(i / size);
                    const col = i % size;
                    return (
                        <motion.div
                            key={i}
                            className="w-3 h-3 bg-red-500/20 rounded-sm"
                            animate={{ 
                                scale: [1, 1.2, 1],
                                backgroundColor: ["rgba(239, 68, 68, 0.2)", "rgba(239, 68, 68, 0.8)", "rgba(239, 68, 68, 0.2)"]
                            }}
                            transition={{
                                duration: 0.5,
                                delay: (row * size + col) * 0.1, // Sequential delay across entire grid
                                repeat: Infinity,
                                repeatDelay: size * size * 0.1
                            }}
                        />
                    )
                })}
            </div>
            <div className="text-xs text-muted-foreground">
                Checking {size}x{size} = {size * size} pairs
            </div>
        </div>
    );
};

// --- O(n log n) Merge Sort / Linearithmic ---
export const LinearithmicAnim = ({ n }: { n: number }) => {
    // Simplified visualisation: multiple layers of splitting/merging
    const width = Math.min(n * 5, 200);

    return (
        <div className="flex flex-col items-center gap-2 overflow-hidden">
             {/* Level 1 */}
             <motion.div 
                className="h-2 bg-orange-500 rounded-full" 
                style={{ width }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
             />
             {/* Level 2 (Split) */}
             <div className="flex gap-2">
                <motion.div className="h-2 bg-orange-500/80 rounded-full" style={{ width: width/2 }} />
                <motion.div className="h-2 bg-orange-500/80 rounded-full" style={{ width: width/2 }} />
             </div>
             {/* Level 3 (Split more) */}
             <div className="flex gap-1">
                <motion.div className="h-2 bg-orange-500/60 rounded-full" style={{ width: width/4 }} />
                <motion.div className="h-2 bg-orange-500/60 rounded-full" style={{ width: width/4 }} />
                <motion.div className="h-2 bg-orange-500/60 rounded-full" style={{ width: width/4 }} />
                <motion.div className="h-2 bg-orange-500/60 rounded-full" style={{ width: width/4 }} />
             </div>
             
             <div className="mt-2 text-xs text-muted-foreground text-center">
                Dividing N items (log n times) <br/> + Merging them back (N times)
             </div>
        </div>
    );
};
