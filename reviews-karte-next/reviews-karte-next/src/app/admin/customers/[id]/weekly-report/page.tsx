import { notFound } from "next/navigation";
import { CustomerTaskPage } from "@/components/admin/CustomerTaskPage";
import { getCustomerById } from "@/lib/mock-data";

type CustomerWeeklyReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerWeeklyReportPage({
  params,
}: CustomerWeeklyReportPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <CustomerTaskPage
      title="週次レポート"
      storeName={customer.storeName}
      status={customer.weeklyReportStatus}
      description="週ごとの進捗確認や要点整理を管理する想定の画面です。"
    />
  );
}
