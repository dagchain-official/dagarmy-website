"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AddCourseForm from "@/components/admin/AddCourseForm";

export default function AddCoursePage() {
  return (
    <AdminLayout>
      <AddCourseForm />
    </AdminLayout>
  );
}
