import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BENEFIT_KEYS = [
  // Tier bonuses
  'soldier_signup_bonus',
  'lieutenant_upgrade_price_usd',
  // Referral bonuses (new flat values - no rank multiplier)
  'soldier_refers_soldier_join',
  'soldier_refers_soldier_upgrade',
  'lieutenant_refers_soldier_join',
  'lieutenant_refers_soldier_upgrade',
  // Sales commissions - new tier-based flat rates
  'soldier_direct_sales_commission',
  'soldier_level2_sales_commission',
  'soldier_level3_sales_commission',
  'lieutenant_direct_sales_commission_default',
  'lieutenant_level2_sales_commission',
  'lieutenant_level3_sales_commission',
  // Spend-based DAG Points (new)
  'spend_pts_per_dollar_soldier',
  'spend_pts_per_dollar_lieutenant',
  // Task multiplier (new)
  'task_multiplier_lieutenant',
  // DAG Points per $ sale
  'self_sale_dag_points_per_dollar',
  'referral_sale_dag_points_per_dollar',
  // Social tasks
  'social_task_lt_bonus_rate',
  'social_task_like_share',
  'social_task_comments_watch',
  'social_task_create_shorts',
  'social_task_explainer_video',
  'social_task_subscribe',
  // Fortune 500 pool
  'fortune500_pool_pct',
  'fortune500_enrollment_open',
  // Elite pool
  'elite_pool_active',
  'elite_pool_blockchain_pct',
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
      lieutenant_upgrade_price_usd: 149,
      soldier_refers_soldier_join: 500,
      soldier_refers_soldier_upgrade: 500,
      lieutenant_refers_soldier_join: 1000,
      lieutenant_refers_soldier_upgrade: 1000,
      // Sales commissions - new flat tier rates
      soldier_direct_sales_commission: 15,
      soldier_level2_sales_commission: 3,
      soldier_level3_sales_commission: 2,
      lieutenant_direct_sales_commission_default: 20,
      lieutenant_level2_sales_commission: 3,
      lieutenant_level3_sales_commission: 2,
      // Spend-based pts
      spend_pts_per_dollar_soldier: 25,
      spend_pts_per_dollar_lieutenant: 50,
      // Task multiplier
      task_multiplier_lieutenant: 2,
      // DAG Points per $ sale
      self_sale_dag_points_per_dollar: 25,
      referral_sale_dag_points_per_dollar: 25,
      // Social tasks
      social_task_lt_bonus_rate: 20,
      social_task_like_share: 10,
      social_task_comments_watch: 10,
      social_task_create_shorts: 50,
      social_task_explainer_video: 100,
      social_task_subscribe: 150,
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
