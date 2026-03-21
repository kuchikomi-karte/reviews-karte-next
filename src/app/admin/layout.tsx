import type { ReactNode } from "react";
import { RebuildAdminLayout } from "@/rebuild/admin-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <RebuildAdminLayout>{children}</RebuildAdminLayout>;
}
