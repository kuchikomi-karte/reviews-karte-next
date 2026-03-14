import { notFound } from "next/navigation";
import { CustomerTaskPage } from "@/components/admin/CustomerTaskPage";
import { getCustomerById } from "@/lib/mock-data";

type CustomerAiReplyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerAiReplyPage({
  params,
}: CustomerAiReplyPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <CustomerTaskPage
      title="AI口コミ返信案"
      storeName={customer.storeName}
      status={customer.aiReplyStatus}
      description="AIで作成した口コミ返信案の下書きや提案内容を管理する想定の画面です。"
    />
  );
}
