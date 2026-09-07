-- StitchCraft Supabase schema.
-- How to apply: Supabase Dashboard -> your project -> SQL Editor -> paste ALL of this -> Run.
-- After that: create your account on the website once, then run the "MAKE YOURSELF ADMIN" query at the bottom.

-- ============ TABLES ============

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id bigint generated always as identity primary key,
  name text not null,
  brand text not null default 'StitchCraft',
  category text not null,
  gender text not null,
  price numeric not null,
  old_price numeric not null default 0,
  rating numeric not null default 4.5,
  reviews integer not null default 0,
  badge text not null default '',
  colors text[] not null default '{}',
  sizes text[] not null default '{One Size}',
  stock jsonb not null default '{}',
  description text not null default '',
  img text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete set null,
  order_code text not null,
  items jsonb not null,
  subtotal numeric not null default 0,
  shipping numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  name text not null default '',
  phone text not null default '',
  address text not null default '',
  city text not null default '',
  state text not null default '',
  pincode text not null default '',
  payment text not null default '',
  pickup_store text,
  status text not null default 'pending',
  status_history jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Add status columns if they don't exist (for existing tables)
do $$
begin
  if NOT exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'status') then
    alter table public.orders add column status text not null default 'pending';
  end if;
  if NOT exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'status_history') then
    alter table public.orders add column status_history jsonb not null default '[]';
  end if;
  if NOT exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'payment_screenshot') then
    alter table public.orders add column payment_screenshot text;
  end if;
  if NOT exists (select 1 from information_schema.columns where table_name = 'orders' and column_name = 'payment_verified') then
    alter table public.orders add column payment_verified boolean not null default false;
  end if;
end
$$;

-- Admin can update order status
drop policy if exists "admin update order status" on public.orders;
create policy "admin update order status" on public.orders
  for update using (public.is_admin());

-- ============ AUTO-CREATE PROFILE ON SIGNUP ============

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ ADMIN CHECK (used by RLS policies) ============

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- ============ ROW LEVEL SECURITY ============

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "users insert own profile" on public.profiles;
create policy "users insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "public read products" on public.products;
create policy "public read products" on public.products
  for select using (true);

drop policy if exists "admin insert products" on public.products;
create policy "admin insert products" on public.products
  for insert with check (public.is_admin());

drop policy if exists "admin update products" on public.products;
create policy "admin update products" on public.products
  for update using (public.is_admin());

drop policy if exists "admin delete products" on public.products;
create policy "admin delete products" on public.products
  for delete using (public.is_admin());

drop policy if exists "users read own orders" on public.orders;
create policy "users read own orders" on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "anyone can place an order" on public.orders;
create policy "anyone can place an order" on public.orders
  for insert with check (user_id = auth.uid() or (user_id is null and auth.uid() is null));

-- ============ MAKE YOURSELF ADMIN (run after you sign up once) ============
-- update public.profiles set is_admin = true where email = 'you@example.com';
