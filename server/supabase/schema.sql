create table if not exists public.campus_zones (
  id text primary key,
  name text not null,
  short_name text not null,
  status text not null default 'nominal',
  active_sources integer not null default 0,
  recent_events_count integer not null default 0,
  occupancy_state text not null default 'low',
  last_update text not null default '00:00',
  coordinates jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.scenarios (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  signal_types jsonb not null default '[]'::jsonb,
  expected_outcome text not null,
  duration integer not null,
  events jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.incidents (
  id text primary key,
  title text not null,
  category text not null,
  zone text not null,
  location text not null,
  severity text not null,
  confidence numeric not null,
  confidence_trajectory jsonb not null default '[]'::jsonb,
  status text not null,
  created_at text not null,
  created_relative_time integer not null default 0,
  updated_at text not null,
  summary text not null,
  event_ids jsonb not null default '[]'::jsonb,
  events jsonb not null default '[]'::jsonb,
  evidence_summary jsonb not null default '{}'::jsonb,
  explanation jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  operator_notes jsonb not null default '[]'::jsonb,
  audit_entries jsonb not null default '[]'::jsonb,
  inserted_at timestamptz not null default now()
);

create table if not exists public.safety_events (
  id text primary key,
  source text not null,
  source_type text not null,
  zone text not null,
  location text not null,
  relative_time integer not null default 0,
  timestamp text not null,
  simulated_clock text not null,
  event_type text not null,
  severity text not null,
  confidence numeric not null,
  evidence text not null,
  evidence_category text not null,
  metadata jsonb,
  incident_id text references public.incidents(id) on delete set null,
  inserted_at timestamptz not null default now()
);

create table if not exists public.audit_entries (
  id text primary key,
  timestamp text not null,
  relative_time integer not null default 0,
  actor text not null,
  actor_name text,
  action text not null,
  details text not null,
  incident_id text references public.incidents(id) on delete set null,
  event_id text references public.safety_events(id) on delete set null,
  inserted_at timestamptz not null default now()
);

create index if not exists incidents_status_idx on public.incidents(status);
create index if not exists incidents_zone_idx on public.incidents(zone);
create index if not exists events_incident_id_idx on public.safety_events(incident_id);
create index if not exists events_zone_idx on public.safety_events(zone);

alter table public.campus_zones enable row level security;
alter table public.scenarios enable row level security;
alter table public.incidents enable row level security;
alter table public.safety_events enable row level security;
alter table public.audit_entries enable row level security;

alter table public.incidents add column if not exists events jsonb not null default '[]'::jsonb;
alter table public.incidents add column if not exists metrics jsonb not null default '{}'::jsonb;

-- The backend uses the service-role key. Do not expose that key in the client.
