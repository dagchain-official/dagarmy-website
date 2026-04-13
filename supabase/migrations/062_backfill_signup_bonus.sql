-- Migration 062: One-time signup bonus backfill for all existing users
-- Grants 2 DGCC to every user who has not yet received the signup bonus.
-- Safe to run multiple times (idempotent via WHERE NOT EXISTS / DO NOTHING).
-- Run in: Supabase Dashboard → SQL Editor (project: xqmicsufkvuzfrgtcapy)

DO $$
DECLARE
  r RECORD;
  bonus_amount CONSTANT NUMERIC := 2.0;
BEGIN
  -- Loop over every user in the shared users table
  FOR r IN SELECT id FROM public.users LOOP

    -- ── Case 1: user has NO credit row yet ──────────────────────────────
    IF NOT EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = r.id) THEN

      INSERT INTO public.user_credits (user_id, balance, total_purchased, total_spent, total_bonus)
      VALUES (r.id, bonus_amount, 0, 0, bonus_amount);

      INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
      VALUES (r.id, 'bonus', bonus_amount, bonus_amount, 'Welcome bonus — 2 DGCC (retroactive signup grant)');

    -- ── Case 2: user has a credit row but total_bonus = 0 (no bonus yet) ─
    ELSIF EXISTS (SELECT 1 FROM public.user_credits WHERE user_id = r.id AND (total_bonus IS NULL OR total_bonus = 0)) THEN

      UPDATE public.user_credits
      SET
        balance     = balance     + bonus_amount,
        total_bonus = COALESCE(total_bonus, 0) + bonus_amount,
        updated_at  = NOW()
      WHERE user_id = r.id;

      INSERT INTO public.credit_transactions (user_id, type, amount, balance_after, description)
      SELECT
        r.id,
        'bonus',
        bonus_amount,
        uc.balance,
        'Welcome bonus — 2 DGCC (retroactive signup grant)'
      FROM public.user_credits uc
      WHERE uc.user_id = r.id;

    -- ── Case 3: already has bonus → skip ────────────────────────────────
    ELSE
      -- Do nothing — user already received their signup bonus
      NULL;
    END IF;

  END LOOP;
END
$$;
