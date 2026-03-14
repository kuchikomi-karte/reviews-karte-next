import { notFound } from "next/navigation";
import { CustomerTaskPage } from "@/components/admin/CustomerTaskPage";
import { getCustomerById } from "@/lib/mock-data";

type CustomerMonthlyReportPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerMonthlyReportPage({
  params,
}: CustomerMonthlyReportPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <CustomerTaskPage
      title="月次レポート"
      storeName={customer.storeName}
      status={customer.monthlyReportStatus}
      description="月次の報告内容、成果まとめ、次月の提案内容を扱う想定の画面です。"
    />
  );
}
