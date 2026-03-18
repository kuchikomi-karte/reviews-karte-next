export function getAuthCallbackUrl(
  searchParams?: Record<string, string | undefined>,
) {
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

  const queryString = buildQueryString(searchParams);

  if (!baseUrl) {
    return `/auth/callback${queryString}`;
  }

  const callbackUrl = new URL("/auth/callback", baseUrl);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) {
      callbackUrl.searchParams.set(key, value);
    }
  }

  return callbackUrl.toString();
}

function buildQueryString(searchParams?: Record<string, string | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
