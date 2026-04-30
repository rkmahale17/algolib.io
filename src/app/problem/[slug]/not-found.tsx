'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileSearch, Home, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlgorithmNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-12 rounded-3xl max-w-lg w-full border-primary/20 shadow-glow"
      >
        <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileSearch className="w-10 h-10 text-primary animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          Algorithm Not Found
        </h1>
        
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          The algorithm you're looking for doesn't exist in our library yet. 
          It might be under development or located in another category.
        </p>

        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="w-full rounded-xl h-12 text-base font-medium">
            <Link href="/dsa/problems">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Browse Algorithms
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full rounded-xl h-12 text-base font-medium">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
