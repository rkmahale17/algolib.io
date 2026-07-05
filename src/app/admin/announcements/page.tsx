import AdminAnnouncements from "@/admin/pages/AdminAnnouncements";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Announcements",
  description: "Manage global announcements",
};

export default function AnnouncementsAdminPage() {
  return <AdminAnnouncements />;
}
