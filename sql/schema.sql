create table if not exists newsletter_subscribers (
  id text primary key,
  email text not null unique,
  status text not null default 'active' check (status in ('active', 'pending_confirmation', 'unsubscribed')),
  source text not null default 'site',
  postal_code_hint text,
  weekend_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  last_sent_issue_slug text
);

create index if not exists newsletter_subscribers_active_idx
  on newsletter_subscribers (status)
  where status = 'active';
