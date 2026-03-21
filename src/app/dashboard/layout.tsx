import type { ReactNode } from "react";
import { requireUserSession } from "@/rebuild/user-guard";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUserSession();

  return <>{children}</>;
}
