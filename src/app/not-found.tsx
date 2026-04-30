'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse delay-700" />
        
        {/* Abstract Grid/Nodes */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative inline-block"
        >
          <h1 className="text-[12rem] md:text-[16rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu className="w-24 h-24 text-primary animate-glow" />
          </div>
        </motion.div>

        <div className="mt-[-2rem] space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Logic Error: Path Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            The algorithm couldn't resolve this memory address. It seems you've wandered into an undefined segment of our library.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8 h-12 text-base font-medium shadow-elegant hover-lift">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-medium glass-card hover-lift">
            <Link href="/dsa/problems">
              <Search className="mr-2 h-4 w-4" />
              Browse Algorithms
            </Link>
          </Button>
        </motion.div>

        <motion.button
          onClick={() => window.history.back()}
          className="mt-8 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center mx-auto group"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft className="mr-2 h-3 w-3 transition-transform group-hover:-translate-x-1" />
          Return to previous page
        </motion.button>
      </motion.div>
      
      {/* Decorative Binary/Code Snippets floating around */}
      <div className="hidden lg:block absolute top-20 left-20 opacity-10 font-mono text-xs select-none pointer-events-none">
        <code>{`while(searching) {\n  if(found) break;\n  path = path.next;\n}`}</code>
      </div>
      <div className="hidden lg:block absolute bottom-20 right-20 opacity-10 font-mono text-xs select-none pointer-events-none text-right">
        <code>{`error 404:\n  status: NOT_FOUND\n  location: unknown\n  trace: null`}</code>
      </div>
    </div>
  );
}
