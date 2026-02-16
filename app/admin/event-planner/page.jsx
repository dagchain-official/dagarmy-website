"use client";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EventPlanner from "@/components/admin/EventPlanner";

export default function EventPlannerPage() {
  return (
    <AdminLayout>
      <EventPlanner />
    </AdminLayout>
  );
}
