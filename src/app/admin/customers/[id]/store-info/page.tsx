import { notFound } from "next/navigation";
import { CustomerTaskPage } from "@/components/admin/CustomerTaskPage";
import { getCustomerById } from "@/lib/mock-data";

type CustomerStoreInfoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerStoreInfoPage({
  params,
}: CustomerStoreInfoPageProps) {
  const { id } = await params;
  const customer = getCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <CustomerTaskPage
      title="店舗情報"
      storeName={customer.storeName}
      status={customer.storeInfoStatus}
      description="店舗情報、基本プロフィール、運用前提の更新状況を管理する想定の画面です。"
    />
  );
}
