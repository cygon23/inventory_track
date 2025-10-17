-- Notifications schema for role/user-targeted in-app notifications
-- Run this with the Supabase CLI or in the SQL editor

-- Enable required extensions (usually enabled by default on Supabase)
create extension if not exists pgcrypto;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  title text not null,
  message text not null,
  type text not null default 'info', -- info | success | warning | error
  event text not null,               -- e.g., booking.created, payment.completed
  target_user_id uuid not null references public.users(id) on delete cascade,
  actor_user_id uuid null references public.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamp with time zone null,
  dismissed_at timestamp with time zone null
);

-- Helpful indexes
create index if not exists idx_notifications_target_user on public.notifications(target_user_id, created_at desc);
create index if not exists idx_notifications_unread on public.notifications(target_user_id) where read_at is null and dismissed_at is null;

-- RLS: each user can only read and modify their own notifications
alter table public.notifications enable row level security;

-- Allow target user to read their notifications
drop policy if exists "read_own_notifications" on public.notifications;
create policy "read_own_notifications" on public.notifications
  for select using (auth.uid() = target_user_id);

-- Allow target user to mark as read/dismiss
drop policy if exists "update_own_notifications" on public.notifications;
create policy "update_own_notifications" on public.notifications
  for update using (auth.uid() = target_user_id);

-- Allow target user to delete their notifications (optional)
drop policy if exists "delete_own_notifications" on public.notifications;
create policy "delete_own_notifications" on public.notifications
  for delete using (auth.uid() = target_user_id);

-- Allow any authenticated user to insert notifications (so app users can notify others)
drop policy if exists "insert_notifications_authenticated" on public.notifications;
create policy "insert_notifications_authenticated" on public.notifications
  for insert with check (auth.role() = 'authenticated');
