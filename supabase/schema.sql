-- Command Center Database Schema
-- Run this in your Supabase SQL Editor

-- Briefs (OpenClaw daily summaries)
create table if not exists briefs (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('tech_news', 'morning_briefing', 'evening_review')),
  title text not null,
  content text not null,
  date date not null default current_date,
  created_at timestamptz default now()
);

create index idx_briefs_date on briefs (date desc);
create index idx_briefs_type_date on briefs (type, date desc);

-- Meal Plans
create table if not exists meal_plans (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  plan jsonb not null,
  cook_instructions text,
  created_at timestamptz default now()
);

create index idx_meal_plans_date on meal_plans (date desc);

-- Meal Logs
create table if not exists meal_logs (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  meal_type text not null,
  description text not null,
  created_at timestamptz default now()
);

create index idx_meal_logs_date on meal_logs (date desc);

-- Exercise Logs
create table if not exists exercise_logs (
  id uuid default gen_random_uuid() primary key,
  date date not null default current_date,
  type text not null check (type in ('morning_stretch', 'gym', 'walk', 'yoga')),
  duration_minutes integer not null check (duration_minutes > 0),
  notes text default '',
  created_at timestamptz default now()
);

create index idx_exercise_logs_date on exercise_logs (date desc);

-- Reading Logs
create table if not exists reading_logs (
  id uuid default gen_random_uuid() primary key,
  book_title text not null,
  pages_read integer not null check (pages_read > 0),
  date date not null default current_date,
  notes text default '',
  created_at timestamptz default now()
);

create index idx_reading_logs_date on reading_logs (date desc);

-- Habits
create table if not exists habits (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  icon text not null default '◉',
  color text not null default '#8b5cf6',
  created_at timestamptz default now()
);

-- Habit Logs
create table if not exists habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid not null references habits (id) on delete cascade,
  date date not null default current_date,
  completed boolean not null default false,
  created_at timestamptz default now(),
  unique (habit_id, date)
);

create index idx_habit_logs_date on habit_logs (date desc);
create index idx_habit_logs_habit_date on habit_logs (habit_id, date desc);

-- Notes
create table if not exists notes (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  created_at timestamptz default now()
);

create index idx_notes_created on notes (created_at desc);
