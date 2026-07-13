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
      className={`relative h-[145px] flex rounded-2xl border border-white/10 bg-[#1c1c1c] shadow-2xl text-foreground overflow-hidden group pointer-events-auto ${
        announcement.image_url ? 'w-[350px]' : 'w-[280px]'
      }`}
    >
      {/* Left side: Image (if exists) */}
      {announcement.image_url && (
        <div className="w-[143px] h-full shrink-0 border-r border-white/5 bg-zinc-800">
          <img
            src={announcement.image_url}
            alt="Feature update"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Right side: Content */}
      <div className="flex-1 flex flex-col p-4 relative min-w-0">
        {/* Header: Label & Close Button */}
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold tracking-widest text-[#e45a33] uppercase">
            New Feature
          </span>
          <button
            onClick={() => onDismiss(announcement.id)}
            className="p-1 -mt-1 -mr-2 shrink-0 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close announcement"
          >
            <X size={14} />
          </button>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-[14px] leading-tight text-white mb-1.5 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: announcement.title }}
        />

        {/* Body */}
        <div
          className="text-[12px] leading-snug text-zinc-400 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: announcement.body }}
        />
      </div>
    </motion.div>
  );
};
