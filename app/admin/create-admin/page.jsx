"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CreateSubAdmin from "@/components/admin/CreateSubAdmin";
import { useRouter } from "next/navigation";

export default function CreateAdminPage() {
  const router = useRouter();

  return (
    <AdminLayout>
      <CreateSubAdmin
        onClose={() => router.push('/admin/users')}
        onSuccess={() => {
          router.push('/admin/users');
        }}
      />
    </AdminLayout>
  );
}
