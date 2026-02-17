import React, { useState, useEffect } from 'react';
import { X, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MigrationBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('migration-banner-dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('migration-banner-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="relative z-[100] bg-gradient-to-r from-amber-500/90 via-orange-600/90 to-amber-500/90 text-white backdrop-blur-md overflow-hidden shadow-lg border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex-1 flex items-center min-w-0">
                <span className="flex p-2 rounded-lg bg-white/20 mr-3">
                  <AlertTriangle className="h-5 w-5 text-white animate-pulse" aria-hidden="true" />
                </span>
                <p className="font-medium text-sm md:text-base leading-tight">
                  <span className="md:hidden">Database migrated. Re-register if email/pw.</span>
                  <span className="hidden md:inline">
                    We've migrated our database! <strong>Email/Password users</strong> need to re-register. 
                    <span className="opacity-90 ml-1">Google sign-in users are not impacted.</span>
                  </span>
                </p>
              </div>
              
              <div className="flex-shrink-0 flex items-center gap-4">
                <button
                  onClick={handleDismiss}
                  className="flex p-2 rounded-md hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-5 w-5 text-white" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MigrationBanner;
