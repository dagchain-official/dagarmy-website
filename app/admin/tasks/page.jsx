"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import TasksManagement from "@/components/admin/TasksManagement";

export default function AdminTasksPage() {
  return (
    <AdminLayout>
      <TasksManagement />
    </AdminLayout>
  );
}
