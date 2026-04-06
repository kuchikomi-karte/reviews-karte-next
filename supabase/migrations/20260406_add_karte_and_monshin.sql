create extension if not exists pgcrypto;

create table if not exists public.karte (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  file_id text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  period text
);

alter table public.karte enable row level security;

drop policy if exists "ユーザーは自分の公開カルテのみ参照可" on public.karte;

create policy "ユーザーは自分の公開カルテのみ参照可"
  on public.karte
  for select
  using (auth.uid() = user_id and status = 'published');

create table if not exists public.monshin (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null unique references public.users(id) on delete cascade,
  q1 text,
  q2 text,
  q3 text,
  q4 text,
  q5 text,
  q6 text,
  q7 text,
  updated_at timestamptz not null default now()
);

alter table public.monshin enable row level security;

drop policy if exists "ユーザーは自分の回答を参照可" on public.monshin;
drop policy if exists "ユーザーは自分の回答を追加可" on public.monshin;
drop policy if exists "ユーザーは自分の回答を更新可" on public.monshin;
drop policy if exists "ユーザーは自分の回答を削除可" on public.monshin;

create policy "ユーザーは自分の回答を参照可"
  on public.monshin
  for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分の回答を追加可"
  on public.monshin
  for insert
  with check (auth.uid() = user_id);

create policy "ユーザーは自分の回答を更新可"
  on public.monshin
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "ユーザーは自分の回答を削除可"
  on public.monshin
  for delete
  using (auth.uid() = user_id);
