-- =====================================================
-- Enable rank progression for DAG SOLDIER tier
-- Client confirmed: rank progressions apply to soldiers too
-- =====================================================

UPDATE rewards_config
SET config_value = 1,
    description  = 'Enable ranking system for DAG SOLDIER (0=disabled, 1=enabled)',
    updated_at   = NOW()
WHERE config_key = 'ranking_system_enabled_for_soldier';
