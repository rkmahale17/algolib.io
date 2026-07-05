"use client";

import React, { useEffect } from "react";

import { X } from "lucide-react";
import { motion } from "framer-motion";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type AnnouncementBannerProps = {
  announcement: Announcement;
  onDismiss: (id: string) => void;
};

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  announcement,
  onDismiss,
}) => {
  // Auto-dismiss after 60 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(announcement.id);
    }, 240000); // 4 minutes

    return () => clearTimeout(timer);
  }, [announcement.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      className="relative w-54 sm:w-[250px] h-[200px] flex flex-col rounded-xl border border-[#C0C0C0] bg-background shadow-lg text-foreground overflow-hidden group pointer-events-auto"
    >
      {/* Header section */}
      <div className="flex justify-between items-center px-4 py-2 border-b border-border">
        <h3
          className="font-semibold text-sm pr-2 truncate text-orange-500"
          dangerouslySetInnerHTML={{ __html: announcement.title }}
        />
        <button
          onClick={() => onDismiss(announcement.id)}
          className="p-1.5 shrink-0 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Close announcement"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Content section */}
      <div className="p-4 flex-1 overflow-y-auto">
        {announcement.image_url && (
          <img
            src={announcement.image_url}
            alt={announcement.title}
            className="w-full max-h-[150px] object-cover mb-4 rounded-lg border border-border shadow-sm"
          />
        )}
        <div
          className="text-sm text-muted-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: announcement.body }}
        />
      </div>
    </motion.div>
  );
};
