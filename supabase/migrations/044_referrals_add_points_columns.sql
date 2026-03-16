-- =====================================================
-- Migration 044: Add missing columns to referrals table
-- The referrals table was created by 007_referral_system.sql
-- Migration 017 was skipped (IF NOT EXISTS). Add the missing
-- bifurcation columns needed by the referral points API.
-- =====================================================

ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS points_earned_on_join     DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS points_earned_on_upgrade  DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_points_earned       DECIMAL(15,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referred_user_upgraded    BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS upgrade_date              TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS referral_tier             VARCHAR(50);
