"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AssignmentManagement from "@/components/admin/AssignmentManagement";

export default function AdminAssignmentsPage() {
  return (
    <AdminLayout>
      <AssignmentManagement />
    </AdminLayout>
  );
}
