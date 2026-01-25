"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AddCourseWizard from "@/components/admin/AddCourseWizard";

export default function AddCoursePage() {
  return (
    <AdminLayout>
      <AddCourseWizard />
    </AdminLayout>
  );
}
