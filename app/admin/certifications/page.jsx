"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CertificationsManagement from "@/components/admin/CertificationsManagement";

export default function AdminCertificationsPage() {
  return (
    <AdminLayout>
      <CertificationsManagement />
    </AdminLayout>
  );
}
