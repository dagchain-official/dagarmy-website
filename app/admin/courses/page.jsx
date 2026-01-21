"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CoursesManagement from "@/components/admin/CoursesManagement";

export default function AdminCoursesPage() {
  return (
    <AdminLayout>
      <CoursesManagement />
    </AdminLayout>
  );
}
