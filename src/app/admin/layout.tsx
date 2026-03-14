import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ADMIN_AUTH_COOKIE, isAdminAuthenticated } from "@/lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = isAdminAuthenticated(
    cookieStore.get(ADMIN_AUTH_COOKIE)?.value,
  );

  if (!isLoggedIn) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f6f1ea] text-stone-900 lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-5 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          {children}
        </div>
      </main>
    </div>
  );
}
