const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = 'Admin@123456';
  const hash = await bcrypt.hash(password, 12);
  
  console.log('\n=================================');
  console.log('Password Hash Generated');
  console.log('=================================');
  console.log('Password:', password);
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
WHERE email = 'admin@dagchain.network';
  `);
  console.log('=================================\n');
}

generatePasswordHash();
