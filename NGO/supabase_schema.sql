-- =========================================================
-- Helping Hands NGO — Supabase schema
-- Supabase dashboard -> SQL Editor -> paste & Run
-- Safe to re-run: uses IF NOT EXISTS everywhere.
-- =========================================================

-- ---------------------------------------------------------
-- 0) Admin check helper
--    IMPORTANT: keep this list identical to ADMIN_EMAILS in
--    js/supabase-config.js
-- ---------------------------------------------------------
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'theboy952077@gmail.com'
  );
$$;

-- ---------------------------------------------------------
-- 1) USERS  (profile row created right after signUp)
-- ---------------------------------------------------------
create table if not exists users (
    id          uuid primary key default gen_random_uuid(),
    name        text,
    email       text unique,
    phone       text,
    city        text,
    state       text,
    gender      text,
    about       text,
    role        text default 'user' check (role in ('user','volunteer')),
    created_at  timestamptz default now()
);

alter table users add column if not exists state  text;
alter table users add column if not exists gender text;
alter table users add column if not exists about  text;
alter table users add column if not exists role   text default 'user';

alter table users enable row level security;

drop policy if exists "users insert own row"      on users;
drop policy if exists "users select own or admin" on users;
drop policy if exists "users update own or admin" on users;
drop policy if exists "users delete admin only"   on users;

create policy "users insert own row" on users
    for insert with check (true); -- signup runs before a session exists

create policy "users select own or admin" on users
    for select using (email = auth.jwt() ->> 'email' or is_admin());

create policy "users update own or admin" on users
    for update using (email = auth.jwt() ->> 'email' or is_admin());

create policy "users delete admin only" on users
    for delete using (is_admin());

-- ---------------------------------------------------------
-- 2) HELP REQUESTS  (need-help.html)
-- ---------------------------------------------------------
create table if not exists help_requests (
    id           bigint generated always as identity primary key,
    full_name    text not null,
    phone        text not null,
    email        text,
    age          int,
    state        text,
    city         text,
    pincode      text,
    map_link     text,                       -- optional
    address      text,
    category     text,
    urgency      text,
    amount       numeric,
    family       int,
    description  text not null,
    images       text[] default '{}',        -- optional evidence
    video        text,                       -- optional evidence
    id_proof     text,                       -- optional evidence
    document     text,                       -- optional evidence
    status       text default 'Pending Verification',
    user_id      uuid references auth.users(id),
    created_at   timestamptz default now()
);

alter table help_requests enable row level security;

drop policy if exists "help_requests public insert" on help_requests;
drop policy if exists "help_requests public read"   on help_requests;
drop policy if exists "help_requests admin update"  on help_requests;
drop policy if exists "help_requests admin delete"  on help_requests;

create policy "help_requests public insert" on help_requests
    for insert with check (true);            -- guests can also request help

create policy "help_requests public read" on help_requests
    for select using (true);                 -- shown on homepage / search

create policy "help_requests admin update" on help_requests
    for update using (is_admin());

create policy "help_requests admin delete" on help_requests
    for delete using (is_admin());

-- ---------------------------------------------------------
-- 3) VOLUNTEER OFFERS  (provide-help.html)
-- ---------------------------------------------------------
create table if not exists volunteer_offers (
    id              bigint generated always as identity primary key,
    helper_name     text not null,
    phone           text not null,
    email           text,
    city            text,
    help_types      text[] default '{}',
    available_date  date,
    available_time  time,
    message         text,
    status          text default 'Pending',
    created_at      timestamptz default now()
);

alter table volunteer_offers enable row level security;

drop policy if exists "volunteer_offers public insert" on volunteer_offers;
drop policy if exists "volunteer_offers public read"   on volunteer_offers;
drop policy if exists "volunteer_offers admin update"  on volunteer_offers;
drop policy if exists "volunteer_offers admin delete"  on volunteer_offers;

create policy "volunteer_offers public insert" on volunteer_offers
    for insert with check (true);

create policy "volunteer_offers public read" on volunteer_offers
    for select using (true);

create policy "volunteer_offers admin update" on volunteer_offers
    for update using (is_admin());

create policy "volunteer_offers admin delete" on volunteer_offers
    for delete using (is_admin());

-- ---------------------------------------------------------
-- 4) DONATIONS  (donate.html)
-- ---------------------------------------------------------
create table if not exists donations (
    id          bigint generated always as identity primary key,
    donor_name  text not null,
    phone       text,
    email       text,
    city        text,
    type        text,               -- Money / Food / Clothes / Books / ...
    amount      numeric,
    message     text,
    status      text default 'Pending',
    created_at  timestamptz default now()
);

alter table donations enable row level security;

drop policy if exists "donations public insert" on donations;
drop policy if exists "donations public read"   on donations;
drop policy if exists "donations admin update"  on donations;
drop policy if exists "donations admin delete"  on donations;

create policy "donations public insert" on donations
    for insert with check (true);

create policy "donations public read" on donations
    for select using (true);

create policy "donations admin update" on donations
    for update using (is_admin());

create policy "donations admin delete" on donations
    for delete using (is_admin());

-- ---------------------------------------------------------
-- 5) STORAGE (optional evidence uploads on need-help.html)
--    Storage buckets can't be created from SQL editor on all
--    plans, so do this step manually:
--    Dashboard -> Storage -> New bucket -> name it "evidence"
--    -> toggle "Public bucket" ON -> Save.
-- =========================================================
