import { PremiumClientPage } from "@/rebuild/premium-page";
import { requireUserSession } from "@/rebuild/user-guard";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireUserSession();

  return <PremiumClientPage />;
}
