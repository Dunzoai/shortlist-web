-- ============================================================
-- Teacher Dashboard: Lead Capture + CRM + Lesson Plans
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Enums
do $$ begin
  create type lead_source as enum ('website_form', 'instagram_dm', 'shortlistpass', 'manual', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type lead_status as enum ('new', 'contacted', 'booked', 'done', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type service_type as enum ('tutoring', 'babysitting', 'test_prep', 'homework_help', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type session_mode as enum ('in_person', 'virtual', 'either');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type contact_method as enum ('email', 'sms', 'phone', 'instagram');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type event_kind as enum (
    'lead_received','lead_reply_sent','lead_status_changed','note_added',
    'session_booked','session_completed','plan_sent','sms_sent','call_logged'
  );
exception when duplicate_object then null;
end $$;

-- Contacts (parents)
create table if not exists contacts (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null,
  parent_name   text not null,
  email         citext,
  phone         text,
  instagram     text,
  preferred_contact contact_method default 'email',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Children
create table if not exists children (
  id            uuid primary key default gen_random_uuid(),
  contact_id    uuid not null references contacts(id) on delete cascade,
  name          text not null,
  age           smallint,
  grade         text,
  notes         text,
  created_at    timestamptz not null default now()
);

-- Leads
create table if not exists leads (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null,
  contact_id       uuid references contacts(id) on delete set null,
  source           lead_source not null default 'website_form',
  source_ref       text,
  status           lead_status not null default 'new',
  service          service_type,
  child_name       text,
  child_age        smallint,
  child_grade      text,
  subjects         text[] default '{}',
  preferred_schedule text,
  location         session_mode default 'either',
  budget_note      text,
  message          text,
  parent_name      text,
  email            text,
  phone            text,
  notes            text,
  tags             text[] default '{}',
  unread           boolean not null default true,
  client_slug      text,
  received_at      timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists leads_status_idx on leads(status, received_at desc);
create index if not exists leads_source_idx on leads(source);

-- Lead notes
create table if not exists lead_notes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads(id) on delete cascade,
  owner_id    uuid not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

-- Clients (promoted from leads)
create table if not exists clients (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null,
  contact_id  uuid not null references contacts(id) on delete cascade,
  lead_id     uuid references leads(id) on delete set null,
  service     service_type,
  rate_cents  integer,
  created_at  timestamptz not null default now()
);

-- Sessions (scheduler)
create table if not exists sessions (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null,
  client_id   uuid references clients(id) on delete cascade,
  lead_id     uuid references leads(id) on delete set null,
  service     service_type,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  location    session_mode default 'either',
  notes       text,
  completed   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists sessions_range_idx on sessions(starts_at);

-- Lesson plans
create table if not exists lesson_plans (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null,
  title         text not null,
  subject       text,
  grade_level   text,
  body_markdown text,
  pdf_path      text,
  tags          text[] default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Plan sends
create table if not exists plan_sends (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null,
  plan_id       uuid not null references lesson_plans(id) on delete cascade,
  contact_id    uuid references contacts(id) on delete set null,
  lead_id       uuid references leads(id) on delete set null,
  via           contact_method not null,
  sent_at       timestamptz not null default now()
);

-- Activity events
create table if not exists activity_events (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null,
  lead_id     uuid references leads(id) on delete cascade,
  client_id   uuid references clients(id) on delete cascade,
  kind        event_kind not null,
  payload     jsonb default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists activity_lead_idx on activity_events(lead_id, created_at desc);

-- Message templates
create table if not exists message_templates (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null,
  name        text not null,
  via         contact_method not null,
  subject     text,
  body        text not null,
  created_at  timestamptz not null default now()
);

-- Enable RLS on all tables
alter table contacts         enable row level security;
alter table children         enable row level security;
alter table leads            enable row level security;
alter table lead_notes       enable row level security;
alter table clients          enable row level security;
alter table sessions         enable row level security;
alter table lesson_plans     enable row level security;
alter table plan_sends       enable row level security;
alter table activity_events  enable row level security;
alter table message_templates enable row level security;

-- Public insert policy for leads (website form submissions)
do $$ begin
  create policy "public_insert_leads" on leads for insert with check (true);
exception when duplicate_object then null;
end $$;

-- Public select for leads (so API can return the inserted row)
do $$ begin
  create policy "public_select_leads" on leads for select using (true);
exception when duplicate_object then null;
end $$;

-- Public update for leads
do $$ begin
  create policy "public_update_leads" on leads for update using (true);
exception when duplicate_object then null;
end $$;

-- Public policies for other tables (simplified for single-tenant)
do $$ begin create policy "all_contacts" on contacts for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_children" on children for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_lead_notes" on lead_notes for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_clients" on clients for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_sessions" on sessions for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_lesson_plans" on lesson_plans for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_plan_sends" on plan_sends for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_activity_events" on activity_events for all using (true) with check (true); exception when duplicate_object then null; end $$;
do $$ begin create policy "all_message_templates" on message_templates for all using (true) with check (true); exception when duplicate_object then null; end $$;

-- Seed sample leads
insert into leads (source, status, child_name, child_grade, subjects, parent_name, email, phone, message, location, client_slug)
values
  ('website_form', 'new', 'Emma', '2nd', '{"Math","Reading"}', 'Sarah Mitchell', 'sarah.m@email.com', '(843) 555-0101', 'Emma needs help with reading fluency and basic math. Available Tues/Thurs after school.', 'in_person', 'growwithgia'),
  ('website_form', 'new', 'Jayden', '4th', '{"Writing","Science"}', 'Marcus Thompson', 'marcus.t@email.com', '(843) 555-0102', 'Jayden struggles with essay writing and science projects. Looking for 2x/week.', 'either', 'growwithgia'),
  ('instagram_dm', 'contacted', 'Olivia', 'K', '{"Reading","Social Emotional Learning"}', 'Amanda Chen', null, '(843) 555-0103', 'Saw your page on IG! My daughter is starting K and needs reading readiness help.', 'in_person', 'growwithgia'),
  ('website_form', 'new', 'Liam', '6th', '{"Math","Test Preparation"}', 'David Rodriguez', 'david.r@email.com', null, 'Liam has a big state test coming up. Need someone who can make test prep not boring.', 'virtual', 'growwithgia'),
  ('manual', 'booked', 'Ava', '3rd', '{"Math","Writing","Reading"}', 'Jennifer Park', 'jen.park@email.com', '(843) 555-0105', 'Referred by another parent. Ava needs help across the board. Starting next week!', 'in_person', 'growwithgia'),
  ('shortlistpass', 'new', 'Noah', '1st', '{"Reading"}', 'Lisa Gomez', 'lisa.g@email.com', '(843) 555-0106', 'Found you through ShortlistPass. Noah is behind on reading. Need Orton-Gillingham approach.', 'either', 'growwithgia');
