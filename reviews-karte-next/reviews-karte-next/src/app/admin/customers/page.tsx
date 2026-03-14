import { CustomerProgressTable } from "@/components/admin/CustomerProgressTable";
import { PageHeader } from "@/components/admin/PageHeader";

export default function AdminCustomersPage() {
  return (
    <>
      <PageHeader
        title="会員進行表"
        description="各会員の進行状況を検索しながら確認し、そのまま各管理画面へ移動できるダッシュボードです。"
      />

      <CustomerProgressTable />
    </>
  );
}
