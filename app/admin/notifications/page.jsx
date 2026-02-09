"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import NotificationManagement from "@/components/admin/NotificationManagement";

export default function AdminNotificationsPage() {
  return (
    <AdminLayout>
      <NotificationManagement />
    </AdminLayout>
  );
}
