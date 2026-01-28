import AdminLayout from "@/components/admin/AdminLayout";
import RewardsManagementComprehensive from "@/components/admin/RewardsManagementComprehensive";

export const metadata = {
  title: "Comprehensive Rewards Management | DAGARMY Admin",
  description: "Manage MLM reward system: DAG Points, Referrals, Rankings, and Sales Commissions",
};

export default function RewardsPage() {
  return (
    <AdminLayout>
      <RewardsManagementComprehensive />
    </AdminLayout>
  );
}
