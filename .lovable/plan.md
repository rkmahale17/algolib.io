

# Consolidated Migration File

## What We'll Do

Replace all 44 existing migration files with a single consolidated migration that captures your entire current database schema. This makes the migration history clean and easier to manage.

## What the Consolidated Migration Will Include

Based on your current database state, the single file will contain:

1. **Enums**: `game_type`
2. **Tables** (12 total):
   - `algorithms`
   - `algorithm_implementations`
   - `blind75_problems`
   - `blind75_implementations`
   - `profiles`
   - `user_progress`
   - `user_algorithm_data`
   - `user_notes`
   - `user_whiteboards`
   - `feedback`
   - `feature_flags`
   - `game_sessions`
3. **Functions**: `is_algorithms_admin()`, `handle_new_user()`, `update_updated_at()`
4. **Triggers**: `handle_new_user` on `auth.users`, `update_updated_at` triggers
5. **RLS Policies**: All existing policies for every table
6. **Storage**: `feedback-images` bucket
7. **Realtime**: Any realtime publications

## Steps

1. Delete all 44 existing migration files
2. Create one new file: `supabase/migrations/20240101000000_consolidated_schema.sql` containing the complete schema
3. The file will use `CREATE TABLE IF NOT EXISTS` and `CREATE OR REPLACE` patterns for safety

## Important Notes

- This does **not** change your actual database -- it only reorganizes the migration files
- The database remains exactly as it is
- Future migrations will build on top of this single baseline

## Technical Details

The consolidated SQL file will be approximately 400-500 lines covering all DDL statements (CREATE TYPE, CREATE TABLE, ALTER TABLE ENABLE RLS, CREATE POLICY, CREATE FUNCTION, CREATE TRIGGER, storage bucket creation).

