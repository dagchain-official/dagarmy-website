/**
 * DAGARMY + DAGGPT Supabase Full Backup Script
 * Exports ALL table data to JSON files — free, no PITR needed.
 * Run: node scripts/backup-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── CONFIG — manually parse .env.local (no dotenv needed) ──────────────────
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && key.trim() && !key.trim().startsWith('#')) {
    process.env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ─── ALL TABLES TO BACK UP ────────────────────────────────────────────────────
// These are all the tables from your 51+ migrations
const TABLES = [
  'users',
  'courses',
  'enrollments',
  'lessons',
  'lesson_progress',
  'certifications',
  'reviews',
  'activity_log',
  'events',
  'referrals',
  'dag_rewards',
  'points_transactions',
  'reward_configs',
  'assignments',
  'notifications',
  'admin_roles',
  'admin_permissions',
  'admin_sessions',
  'master_admin_whitelist',
  'social_tasks',
  'social_task_completions',
  'support_tickets',
  'withdrawal_requests',
  'sales_commissions',
  'incentive_pools',
  'activity_logs',
  'user_events',
  'career_applications',
  'ambassador_applications',
  'job_postings',
  'faq_items',
  'user_ranks',
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function exportTable(tableName) {
  let allRows = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) {
      // Table might not exist — skip gracefully
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { skipped: true };
      }
      throw new Error(`Table ${tableName}: ${error.message}`);
    }

    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < pageSize) break;
    page++;
  }

  return { rows: allRows, count: allRows.length };
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, `../backup_${timestamp}`);

  fs.mkdirSync(backupDir, { recursive: true });

  console.log('\n🛡️  DAGARMY Supabase Full Backup');
  console.log(`📁 Output: ${backupDir}`);
  console.log(`⏱️  Started: ${new Date().toLocaleTimeString()}\n`);

  const summary = {
    timestamp,
    supabaseProject: supabaseUrl,
    tables: {}
  };

  let totalRows = 0;
  let skippedCount = 0;

  for (const table of TABLES) {
    process.stdout.write(`  ⏳ ${table.padEnd(40)}`);

    try {
      const result = await exportTable(table);

      if (result.skipped) {
        process.stdout.write(`⬜ skipped (table not found)\n`);
        summary.tables[table] = { status: 'skipped' };
        skippedCount++;
        continue;
      }

      // Save table data to JSON file
      const filePath = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(filePath, JSON.stringify(result.rows, null, 2), 'utf8');

      totalRows += result.count;
      summary.tables[table] = { status: 'ok', rows: result.count };
      process.stdout.write(`✅ ${result.count} rows\n`);

    } catch (err) {
      process.stdout.write(`❌ ERROR: ${err.message}\n`);
      summary.tables[table] = { status: 'error', error: err.message };
    }
  }

  // Save summary manifest
  const manifestPath = path.join(backupDir, '_backup_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(summary, null, 2), 'utf8');

  console.log('\n─────────────────────────────────────────────');
  console.log(`✅ Backup complete!`);
  console.log(`📊 Total rows exported: ${totalRows.toLocaleString()}`);
  console.log(`⬜ Tables skipped:      ${skippedCount}`);
  console.log(`📁 Backup folder:       ${backupDir}`);
  console.log(`📋 Manifest:            ${manifestPath}`);
  console.log('─────────────────────────────────────────────\n');
  console.log('💾 ZIP this folder and store it somewhere safe before proceeding!\n');
}

runBackup().catch(err => {
  console.error('\n❌ Backup failed:', err.message);
  process.exit(1);
});
