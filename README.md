## reviews-karte

`reviews-karte` is a Next.js application for the public landing page, user registration/login, the user dashboard, and the admin console.

## Setup

Create `.env.local` from `.env.example` and fill in the required values.

```bash
npm run check:auth-config
npm run dev
```

## Required Auth Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

`npm run check:auth-config` validates that these values exist locally and prints the exact callback URLs that must match the external auth configuration.

## Supabase Auth Checklist

- Site URL: `https://reviews-karte.vercel.app`
- Redirect URLs must include:
  - `https://reviews-karte.vercel.app/auth/callback`
  - `https://reviews-karte-next.vercel.app/auth/callback`
- Email provider must be enabled.
- Google provider must be enabled.
- Google Cloud OAuth redirect URI must include:
  - `https://hsiavhnteqivpbztwpdq.supabase.co/auth/v1/callback`

## Vercel Checklist

- Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in both Production and Preview.
- If the production URL changes, update Supabase Site URL and Redirect URLs before deployment.
- Pull envs locally when auditing:

```bash
vercel env pull .vercel.production.env --environment production --yes
vercel env pull .vercel.preview.env --environment preview --yes
```

## Verification

```bash
npm run check:auth-config
npm run build
```

When validating auth flows manually, verify:

- `/register` email signup reaches `/dashboard`
- `/login` email login reaches `/dashboard`
- Google auth redirects to Google and returns to `/auth/callback`
- Failures emit `console.error` details in the browser or server logs
