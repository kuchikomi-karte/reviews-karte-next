import { notFound } from "next/navigation";
import { CustomerTaskPage } from "@/components/admin/CustomerTaskPage";
import { getCustomerById } from "@/lib/mock-data";

type CustomerConsultationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerConsultationPage({
  params,
}: CustomerConsultationPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <CustomerTaskPage
      title="経営相談"
      storeName={customer.storeName}
      status={customer.consultationStatus}
      description="経営相談の対応状況、相談履歴、回答メモを管理する想定の画面です。"
    />
  );
}
