-- Create algorithms table
create table if not exists public.algorithms (
    id text primary key,
    title text not null,
    name text not null,
    category text not null,
    difficulty text not null,
    description text,
    explanation jsonb,
    implementations jsonb,
    problems_to_solve jsonb,
    test_cases jsonb,
    input_schema jsonb,
    tutorials jsonb,
    metadata jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.algorithms enable row level security;

-- Create policy to allow public read access
create policy "Allow public read access"
    on public.algorithms
    for select
    to public
    using (true);

-- Create policy to allow authenticated users to insert/update (optional, for admin)
-- For now, we'll rely on service role key for seeding
