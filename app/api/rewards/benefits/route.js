import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BENEFIT_KEYS = [
  // Tier bonuses
  'soldier_signup_bonus',
  'lieutenant_upgrade_base',
  'lieutenant_bonus_rate',
  'lieutenant_upgrade_price_usd',
  'lieutenant_self_upgrade_bonus',
  // Referral bonuses
  'soldier_refers_soldier_join',
  'soldier_refers_soldier_upgrade',
  'lieutenant_refers_soldier_join',
  'lieutenant_refers_soldier_upgrade',
  // Sales commissions
  'soldier_direct_sales_commission',
  'soldier_level2_sales_commission',
  'soldier_level3_sales_commission',
  // DAG Points per $ sale
  'self_sale_dag_points_per_dollar',
  'referral_sale_dag_points_per_dollar',
  'sale_dag_points_lieutenant_bonus',
  // Social tasks
  'social_task_lt_bonus_rate',
  'social_task_like_share',
  'social_task_comments_watch',
  'social_task_create_shorts',
  'social_task_explainer_video',
  'social_task_subscribe',
  // Rank burn requirements
  'rank_burn_initiator', 'rank_burn_vanguard', 'rank_burn_guardian',
  'rank_burn_striker', 'rank_burn_invoker', 'rank_burn_commander',
  'rank_burn_champion', 'rank_burn_conqueror', 'rank_burn_paragon', 'rank_burn_mythic',
  // Rank point bonuses
  'rank_upgrade_bonus_initiator', 'rank_upgrade_bonus_vanguard', 'rank_upgrade_bonus_guardian',
  'rank_upgrade_bonus_striker', 'rank_upgrade_bonus_invoker', 'rank_upgrade_bonus_commander',
  'rank_upgrade_bonus_champion', 'rank_upgrade_bonus_conqueror', 'rank_upgrade_bonus_paragon', 'rank_upgrade_bonus_mythic',
  // Rank L1 commission overrides
  'rank_commission_initiator', 'rank_commission_vanguard', 'rank_commission_guardian',
  'rank_commission_striker', 'rank_commission_invoker', 'rank_commission_commander',
  'rank_commission_champion', 'rank_commission_conqueror', 'rank_commission_paragon', 'rank_commission_mythic',
];

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('rewards_config')
      .select('config_key, config_value')
      .in('config_key', BENEFIT_KEYS);

    if (error) throw error;

    const cfg = {};
    (data || []).forEach(r => { cfg[r.config_key] = parseFloat(r.config_value) || 0; });

    // Apply defaults for any missing keys
    const defaults = {
      soldier_signup_bonus: 500,
      lieutenant_upgrade_base: 2500,
      lieutenant_bonus_rate: 20,
      lieutenant_upgrade_price_usd: 149,
      lieutenant_self_upgrade_bonus: 3000,
      soldier_refers_soldier_join: 500,
      soldier_refers_soldier_upgrade: 2500,
      lieutenant_refers_soldier_join: 600,
      lieutenant_refers_soldier_upgrade: 3000,
      soldier_direct_sales_commission: 7,
      soldier_level2_sales_commission: 3,
      soldier_level3_sales_commission: 2,
      self_sale_dag_points_per_dollar: 25,
      referral_sale_dag_points_per_dollar: 25,
      sale_dag_points_lieutenant_bonus: 20,
      social_task_lt_bonus_rate: 20,
      social_task_like_share: 10,
      social_task_comments_watch: 10,
      social_task_create_shorts: 50,
      social_task_explainer_video: 100,
      social_task_subscribe: 150,
      rank_burn_initiator: 1000, rank_burn_vanguard: 3000, rank_burn_guardian: 6000,
      rank_burn_striker: 10000, rank_burn_invoker: 15000, rank_burn_commander: 21000,
      rank_burn_champion: 28000, rank_burn_conqueror: 36000, rank_burn_paragon: 45000, rank_burn_mythic: 55000,
      rank_upgrade_bonus_initiator: 10, rank_upgrade_bonus_vanguard: 20, rank_upgrade_bonus_guardian: 30,
      rank_upgrade_bonus_striker: 40, rank_upgrade_bonus_invoker: 50, rank_upgrade_bonus_commander: 60,
      rank_upgrade_bonus_champion: 70, rank_upgrade_bonus_conqueror: 80, rank_upgrade_bonus_paragon: 90, rank_upgrade_bonus_mythic: 100,
      rank_commission_initiator: 10, rank_commission_vanguard: 11, rank_commission_guardian: 12,
      rank_commission_striker: 14, rank_commission_invoker: 15, rank_commission_commander: 16,
      rank_commission_champion: 17, rank_commission_conqueror: 18, rank_commission_paragon: 19, rank_commission_mythic: 20,
    };

    Object.keys(defaults).forEach(k => {
      if (!cfg[k] && cfg[k] !== 0) cfg[k] = defaults[k];
    });

    return NextResponse.json({ success: true, config: cfg });
  } catch (error) {
    console.error('Error fetching benefits config:', error);
    return NextResponse.json({ error: 'Failed to fetch benefits' }, { status: 500 });
  }
}
