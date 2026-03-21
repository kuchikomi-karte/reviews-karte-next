import { RebuildAdminLoginPage } from "@/rebuild/admin-login-page";

type PageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default function Page(props: PageProps) {
  return <RebuildAdminLoginPage {...props} />;
}
