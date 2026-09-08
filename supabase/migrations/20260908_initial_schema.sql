-- ==========================================================
-- ASTRAL SYNASTRY & ASTROLOGICAL SAAS - DATABASE SCHEMA
-- PostgreSQL / Supabase with Row Level Security (RLS)
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 3. BIRTH PROFILES (Stores birth data for individuals)
CREATE TABLE IF NOT EXISTS public.birth_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    birth_utc TIMESTAMPTZ NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timezone_iana TEXT NOT NULL,
    utc_offset_minutes INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 4. ASTROLOGICAL CHARTS (Computed deterministic chart for a birth profile)
CREATE TABLE IF NOT EXISTS public.astrological_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    birth_profile_id UUID UNIQUE NOT NULL REFERENCES public.birth_profiles(id) ON DELETE CASCADE,
    house_system TEXT NOT NULL DEFAULT 'placidus',
    planets JSONB NOT NULL,
    houses JSONB NOT NULL,
    angles JSONB NOT NULL,
    aspects JSONB NOT NULL,
    elements JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 5. RELATIONSHIPS (Pairs two birth profiles together)
CREATE TABLE IF NOT EXISTS public.relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    person_a_id UUID NOT NULL REFERENCES public.birth_profiles(id) ON DELETE CASCADE,
    person_b_id UUID NOT NULL REFERENCES public.birth_profiles(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT check_distinct_persons CHECK (person_a_id <> person_b_id)
);

-- 6. SYNASTRY ANALYSES (Inter-chart aspects and compatibility matrix)
CREATE TABLE IF NOT EXISTS public.synastry_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relationship_id UUID UNIQUE NOT NULL REFERENCES public.relationships(id) ON DELETE CASCADE,
    inter_aspects JSONB NOT NULL,
    house_overlays_a_in_b JSONB NOT NULL,
    house_overlays_b_in_a JSONB NOT NULL,
    compatibility_scores JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 7. COMPOSITE CHARTS (Midpoint relationship chart)
CREATE TABLE IF NOT EXISTS public.composite_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relationship_id UUID UNIQUE NOT NULL REFERENCES public.relationships(id) ON DELETE CASCADE,
    midpoint_planets JSONB NOT NULL,
    midpoint_houses JSONB NOT NULL,
    midpoint_angles JSONB NOT NULL,
    internal_aspects JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 8. AI REPORTS (In-depth structured interpretive reports)
CREATE TABLE IF NOT EXISTS public.ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relationship_id UUID UNIQUE NOT NULL REFERENCES public.relationships(id) ON DELETE CASCADE,
    model_version TEXT NOT NULL,
    section_encounter TEXT NOT NULL,
    section_person_a TEXT NOT NULL,
    section_person_b TEXT NOT NULL,
    section_relationship TEXT NOT NULL,
    section_hidden_patterns TEXT NOT NULL,
    section_composite_soul TEXT NOT NULL,
    section_compatibility_map TEXT NOT NULL,
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 9. CHAT CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relationship_id UUID NOT NULL REFERENCES public.relationships(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'Consulta Astrológica del Vínculo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 10. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.astrological_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.synastry_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.composite_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Birth Profiles: Users can CRUD their own created birth profiles
CREATE POLICY "Users can manage own birth profiles" ON public.birth_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Astrological charts: accessible if user owns the associated birth profile
CREATE POLICY "Users can view own astrological charts" ON public.astrological_charts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.birth_profiles bp
            WHERE bp.id = astrological_charts.birth_profile_id AND bp.user_id = auth.uid()
        )
    );

-- Relationships: accessible if user owns the relationship
CREATE POLICY "Users can manage own relationships" ON public.relationships
    FOR ALL USING (auth.uid() = user_id);

-- Synastry analyses: accessible if user owns the relationship
CREATE POLICY "Users can manage own synastry analyses" ON public.synastry_analyses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.relationships r
            WHERE r.id = synastry_analyses.relationship_id AND r.user_id = auth.uid()
        )
    );

-- Composite charts: accessible if user owns the relationship
CREATE POLICY "Users can manage own composite charts" ON public.composite_charts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.relationships r
            WHERE r.id = composite_charts.relationship_id AND r.user_id = auth.uid()
        )
    );

-- AI Reports: accessible if user owns the relationship
CREATE POLICY "Users can manage own ai reports" ON public.ai_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.relationships r
            WHERE r.id = ai_reports.relationship_id AND r.user_id = auth.uid()
        )
    );

-- Chat conversations & messages
CREATE POLICY "Users can manage own chat conversations" ON public.chat_conversations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat messages" ON public.chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.chat_conversations c
            WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
        )
    );

-- ==========================================================
-- INDEXES FOR PERFORMANCE
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_birth_profiles_user_id ON public.birth_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_relationships_user_id ON public.relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_relationships_persons ON public.relationships(person_a_id, person_b_id);
CREATE INDEX IF NOT EXISTS idx_synastry_rel_id ON public.synastry_analyses(relationship_id);
CREATE INDEX IF NOT EXISTS idx_composite_rel_id ON public.composite_charts(relationship_id);
CREATE INDEX IF NOT EXISTS idx_ai_reports_rel_id ON public.ai_reports(relationship_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_id ON public.chat_messages(conversation_id);
