"use client";
import AdminLayout from "@/components/admin/AdminLayout";
import FAQManagement from "@/components/admin/FAQManagement";

export default function AdminFAQPage() {
  return (
    <AdminLayout>
      <div style={{ maxWidth: "1200px" }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px" }}>
            FAQ Management
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            Manage FAQ sections, questions and answers shown on the public FAQ page
          </p>
        </div>
        <FAQManagement />
      </div>
    </AdminLayout>
  );
}
