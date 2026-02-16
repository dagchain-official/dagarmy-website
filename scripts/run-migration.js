// Script to run database migrations via Supabase REST SQL endpoint
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runSQL(sql) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  });
  return res;
}

async function runMigration() {
  const migrationFile = process.argv[2] || '002_events_table.sql';
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);

  if (!fs.existsSync(migrationPath)) {
    console.error(`Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  console.log(`Running migration: ${migrationFile}`);
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split into individual statements (handle multi-line statements properly)
  const statements = sql
    .split(/;\s*$/m)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.replace(/\s+/g, ' ').substring(0, 80);
    console.log(`[${i + 1}/${statements.length}] ${preview}...`);

    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql_query: stmt });
      if (error) {
        // If RPC doesn't exist, fall back to direct fetch
        console.log('  RPC not available, trying direct SQL endpoint...');
        const res = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({})
        });
        console.log('  Note: DDL via REST may not be supported. Use Supabase Dashboard SQL Editor.');
        console.log(`  Error: ${error.message}`);
      } else {
        console.log('  OK');
      }
    } catch (err) {
      console.error(`  Failed: ${err.message}`);
    }
  }

  console.log('\nMigration script finished.');
  console.log('If any statements failed, please run them manually in the Supabase Dashboard SQL Editor.');
  console.log(`File: ${migrationPath}`);
}

runMigration();
