-- Migration: Referral System
-- Description: Creates tables for referral code generation, tracking, and rewards
-- Created: 2026-01-24

-- Table 1: referral_codes
-- Stores unique referral codes for each user
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Indexes for performance
    CONSTRAINT referral_codes_user_id_key UNIQUE(user_id)
);

-- Index for fast lookups by referral code
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_user_id ON public.referral_codes(user_id);

-- Table 2: referrals
-- Tracks referral relationships between users
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL REFERENCES public.referral_codes(referral_code) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rewarded')),
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Ensure a user can only be referred once
    CONSTRAINT referrals_referred_id_key UNIQUE(referred_id),
    -- Prevent self-referrals
    CONSTRAINT no_self_referral CHECK (referrer_id != referred_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);

-- Table 3: referral_rewards
-- Tracks rewards awarded for referrals
CREATE TABLE IF NOT EXISTS public.referral_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
    reward_type TEXT NOT NULL CHECK (reward_type IN ('points', 'course_access', 'badge', 'milestone')),
    reward_value INTEGER NOT NULL,
    reward_description TEXT,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referral_rewards_user_id ON public.referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referral_id ON public.referral_rewards(referral_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_type ON public.referral_rewards(reward_type);

-- Table 4: referral_stats
-- Aggregated statistics for quick dashboard display
CREATE TABLE IF NOT EXISTS public.referral_stats (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    total_referrals INTEGER DEFAULT 0,
    successful_referrals INTEGER DEFAULT 0,
    pending_referrals INTEGER DEFAULT 0,
    total_points_earned INTEGER DEFAULT 0,
    last_referral_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_referral_stats_user_id ON public.referral_stats(user_id);

-- Function: Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_hash TEXT;
    v_random TEXT;
    v_exists BOOLEAN;
    v_attempts INTEGER := 0;
    v_max_attempts INTEGER := 10;
BEGIN
    -- Generate code until we find a unique one
    LOOP
        -- Create 5-char hash from user_id (deterministic but not reversible)
        v_hash := UPPER(SUBSTRING(MD5(p_user_id::TEXT || v_attempts::TEXT) FROM 1 FOR 5));
        
        -- Generate 4-char random string (excluding confusing characters)
        v_random := UPPER(SUBSTRING(
            REPLACE(REPLACE(REPLACE(REPLACE(
                encode(gen_random_bytes(3), 'hex'),
                '0', ''), '1', ''), 'o', ''), 'l', '')
            FROM 1 FOR 4
        ));
        
        -- Construct final code
        v_code := 'DAG-' || v_hash || '-' || v_random;
        
        -- Check if code already exists
        SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_code = v_code) INTO v_exists;
        
        -- Exit loop if code is unique or max attempts reached
        EXIT WHEN NOT v_exists OR v_attempts >= v_max_attempts;
        
        v_attempts := v_attempts + 1;
    END LOOP;
    
    -- If we couldn't generate unique code after max attempts, add timestamp
    IF v_exists THEN
        v_code := v_code || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER;
    END IF;
    
    RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function: Get or create referral code for user
CREATE OR REPLACE FUNCTION get_or_create_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
BEGIN
    -- Try to get existing code
    SELECT referral_code INTO v_code
    FROM public.referral_codes
    WHERE user_id = p_user_id AND is_active = TRUE;
    
    -- If no code exists, generate one
    IF v_code IS NULL THEN
        v_code := generate_referral_code(p_user_id);
        
        INSERT INTO public.referral_codes (user_id, referral_code)
        VALUES (p_user_id, v_code)
        ON CONFLICT (user_id) DO UPDATE SET referral_code = v_code;
    END IF;
    
    RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function: Update referral stats
CREATE OR REPLACE FUNCTION update_referral_stats(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.referral_stats (
        user_id,
        total_referrals,
        successful_referrals,
        pending_referrals,
        total_points_earned,
        last_referral_at,
        updated_at
    )
    SELECT
        p_user_id,
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'rewarded'),
        COUNT(*) FILTER (WHERE status = 'pending'),
        COALESCE(SUM(reward_points) FILTER (WHERE status = 'rewarded'), 0),
        MAX(created_at),
        NOW()
    FROM public.referrals
    WHERE referrer_id = p_user_id
    ON CONFLICT (user_id) DO UPDATE SET
        total_referrals = EXCLUDED.total_referrals,
        successful_referrals = EXCLUDED.successful_referrals,
        pending_referrals = EXCLUDED.pending_referrals,
        total_points_earned = EXCLUDED.total_points_earned,
        last_referral_at = EXCLUDED.last_referral_at,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update referral stats when referral changes
CREATE OR REPLACE FUNCTION trigger_update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stats for the referrer
    PERFORM update_referral_stats(NEW.referrer_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referral_stats_trigger
AFTER INSERT OR UPDATE ON public.referrals
FOR EACH ROW
EXECUTE FUNCTION trigger_update_referral_stats();

-- Enable Row Level Security (RLS)
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referral_codes
CREATE POLICY "Users can view their own referral code"
    ON public.referral_codes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referral code"
    ON public.referral_codes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for referrals
CREATE POLICY "Users can view their referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can insert referrals"
    ON public.referrals FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update referrals"
    ON public.referrals FOR UPDATE
    USING (true);

-- RLS Policies for referral_rewards
CREATE POLICY "Users can view their own rewards"
    ON public.referral_rewards FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policies for referral_stats
CREATE POLICY "Users can view their own stats"
    ON public.referral_stats FOR SELECT
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT ON public.referral_codes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.referrals TO authenticated;
GRANT SELECT ON public.referral_rewards TO authenticated;
GRANT SELECT ON public.referral_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.referral_codes IS 'Stores unique referral codes for each user';
COMMENT ON TABLE public.referrals IS 'Tracks referral relationships and their status';
COMMENT ON TABLE public.referral_rewards IS 'Records rewards awarded for successful referrals';
COMMENT ON TABLE public.referral_stats IS 'Aggregated referral statistics for quick dashboard display';
COMMENT ON FUNCTION generate_referral_code IS 'Generates a unique referral code in format DAG-XXXXX-XXXX';
COMMENT ON FUNCTION get_or_create_referral_code IS 'Gets existing referral code or creates new one for user';
COMMENT ON FUNCTION update_referral_stats IS 'Updates aggregated referral statistics for a user';
