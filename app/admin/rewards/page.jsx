import AdminLayout from "@/components/admin/AdminLayout";
import RewardsManagement from "@/components/admin/RewardsManagement";

export const metadata = {
  title: "Rewards Management | DAGARMY Admin",
  description: "Manage DAG Points and tier rewards for DAGARMY members",
};

export default function RewardsPage() {
  return (
    <AdminLayout>
      <RewardsManagement />
    </AdminLayout>
  );
}
