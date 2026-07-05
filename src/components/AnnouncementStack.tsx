"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Announcement, AnnouncementBanner } from "./AnnouncementBanner";
import { AnimatePresence } from "framer-motion";

export const AnnouncementStack: React.FC = () => {
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load dismissed IDs from local storage
    const storedDismissed = localStorage.getItem("dismissed_announcements");
    if (storedDismissed) {
      try {
        setDismissedIds(new Set(JSON.parse(storedDismissed)));
      } catch (e) {
        console.error("Failed to parse dismissed announcements", e);
      }
    }

    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching announcements:", error);
        return;
      }

      if (data) {
        setActiveAnnouncements(data);
      }
    };

    fetchAnnouncements();

    // Optionally set up realtime listener
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "announcements",
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(id);
      localStorage.setItem("dismissed_announcements", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const visibleAnnouncements = activeAnnouncements.filter(
    (announcement) => !dismissedIds.has(announcement.id)
  );

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {visibleAnnouncements.map((announcement) => (
          <AnnouncementBanner
            key={announcement.id}
            announcement={announcement}
            onDismiss={handleDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
