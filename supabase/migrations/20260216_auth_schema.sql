-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- This triggers a reaction whenever a new user is signed up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add user_id to payments and downloads tables
alter table public.payments 
add column if not exists user_id uuid references auth.users(id);

alter table public.downloads 
add column if not exists user_id uuid references auth.users(id);

-- Update RLS policies for payments
-- Allow users to view their own payments
create policy "Users can view their own payments" on public.payments
  for select using (auth.uid() = user_id);

-- Update RLS policies for downloads
-- Allow users to view their own downloads
create policy "Users can view their own downloads" on public.downloads
  for select using (auth.uid() = user_id);

-- Function to link existing records by email when a user registers
create or replace function public.link_records_on_signup()
returns trigger as $$
begin
  -- Update payments
  update public.payments
  set user_id = new.id
  where email = new.email and user_id is null;

  -- Update downloads
  update public.downloads
  set user_id = new.id
  where email = new.email and user_id is null;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger to link records on signup
create trigger link_records_after_signup
  after insert on auth.users
  for each row execute procedure public.link_records_on_signup();
