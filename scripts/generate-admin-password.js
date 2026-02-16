const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('\nUsage: node scripts/generate-admin-password.js <email> <password>');
    console.error('Example: node scripts/generate-admin-password.js admin@example.com "MyStr0ng!Pass"\n');
    process.exit(1);
  }

  if (password.length < 12) {
    console.error('\nPassword must be at least 12 characters long.\n');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  
  console.log('\n=================================');
  console.log('Password Hash Generated');
  console.log('=================================');
  console.log('Email:', email);
  console.log('Hash:', hash);
  console.log('\n=================================');
  console.log('Run this SQL in Supabase:');
  console.log('=================================');
  console.log(`
UPDATE users 
SET 
  password_hash = '${hash}',
  auth_method = 'both',
  is_admin = true,
  is_master_admin = true,
  role = 'admin',
  force_password_change = false,
  failed_login_attempts = 0,
  account_locked_until = NULL
WHERE email = '${email}';
  `);
  console.log('=================================\n');
}

generatePasswordHash();
