-- Sample data for Command Center
-- Run after schema.sql in Supabase SQL Editor

-- Sample briefs
insert into briefs (type, title, content, date) values
  ('morning_briefing', 'Your Friday Morning Brief', E'Good morning, Ananya!\n\nWeather: 28°C, partly cloudy in Bangalore\n\nToday''s Focus:\n- Complete dashboard MVP\n- Review nutrition plan for the week\n- 30 min morning stretch\n\nReminders:\n- Team standup at 10 AM\n- Grocery run for weekly meal prep\n- Evening reading session\n\nQuote of the day: "The secret of getting ahead is getting started." - Mark Twain', current_date),
  ('tech_news', 'Tech News Digest', E'Top Stories:\n\n1. Claude 4.6 Released - Anthropic launches new model family with enhanced reasoning capabilities and faster output.\n\n2. Next.js 16.1 Update - New features include improved App Router performance and better static analysis.\n\n3. Supabase Raises Series C - Database platform continues growth with new real-time features.\n\n4. India''s AI Push - Government announces new AI compute initiative for startups.\n\n5. React 19.3 Stable - React Compiler now production-ready with automatic memoization.', current_date),
  ('evening_review', 'Evening Review', E'Daily Summary:\n\nCompleted:\n✅ Morning stretch routine (20 min)\n✅ Reviewed project requirements\n✅ Healthy meals tracked\n\nIn Progress:\n🔄 Dashboard development\n🔄 Reading - 15 pages completed\n\nTomorrow''s Priorities:\n1. Deploy dashboard to Vercel\n2. Set up OpenClaw integrations\n3. Gym session (upper body)\n\nReflection: Productive day with good focus. Need to improve water intake.', current_date);

-- Sample habits
insert into habits (name, icon, color) values
  ('Morning Stretch', '🌅', 'blue'),
  ('Read 20 Pages', '📚', 'violet'),
  ('8 Glasses Water', '💧', 'cyan'),
  ('No Social Media before 12', '📵', 'amber'),
  ('Journal Entry', '✍️', 'emerald'),
  ('Meditate 10 min', '🧘', 'pink');

-- Sample habit logs (mark some as done for today)
insert into habit_logs (habit_id, date, completed)
select id, current_date, true
from habits
where name in ('Morning Stretch', 'No Social Media before 12');

-- Sample exercise logs
insert into exercise_logs (date, type, duration_minutes, notes) values
  (current_date, 'morning_stretch', 20, 'Full body stretch routine'),
  (current_date - interval '1 day', 'gym', 45, 'Upper body - chest and triceps'),
  (current_date - interval '1 day', 'walk', 30, 'Evening walk around the park'),
  (current_date - interval '2 days', 'morning_stretch', 15, 'Quick stretch'),
  (current_date - interval '2 days', 'yoga', 30, 'Surya namaskar');

-- Sample reading logs
insert into reading_logs (book_title, pages_read, date, notes) values
  ('Atomic Habits', 15, current_date, 'Chapter on habit stacking'),
  ('Atomic Habits', 20, current_date - interval '1 day', 'The 4 laws of behavior change'),
  ('Deep Work', 25, current_date - interval '2 days', 'Finished Part 1');

-- Sample notes
insert into notes (content) values
  ('Remember to set up OpenClaw webhook after deploying to Vercel'),
  ('Meal prep idea: make a big batch of dal on Sunday for the week'),
  ('Look into adding Spotify integration for focus music tracking');
