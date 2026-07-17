-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions Table
CREATE TABLE public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    resume_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'created' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Interview Summaries Table
CREATE TABLE public.interview_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE UNIQUE,
    transcript TEXT,
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) configuration
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_summaries ENABLE ROW LEVEL SECURITY;

-- Create Policies for sessions
CREATE POLICY "Users can insert their own sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.sessions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create Policies for interview summaries
CREATE POLICY "Users can view their own interview summaries" ON public.interview_summaries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sessions
            WHERE sessions.id = interview_summaries.session_id
            AND sessions.user_id = auth.uid()
        )
    );

-- Allow the backend service role to bypass RLS to insert summaries after an interview
-- (assuming the backend uses the service_role key, it bypasses RLS automatically)

-- Grant required permissions to Supabase default roles
GRANT ALL ON public.sessions TO anon, authenticated, service_role;
GRANT ALL ON public.interview_summaries TO anon, authenticated, service_role;
