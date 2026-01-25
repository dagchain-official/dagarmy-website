// Authentication utilities for admin access control

// Master admin email whitelist
export const MASTER_ADMIN_EMAILS = [
  'admin@dagchain.network',
  'answervinod@gmail.com',
  'answervinod07@outlook.com'
];

// Check if email is master admin
export function isMasterAdmin(email) {
  if (!email) return false;
  return MASTER_ADMIN_EMAILS.includes(email.toLowerCase());
}

// Check if user has master admin access
export function checkMasterAdminAccess(user) {
  if (!user || !user.email) return false;
  return isMasterAdmin(user.email);
}

// Check if user has any admin access (master admin or assigned role)
export function hasAdminAccess(user) {
  if (!user) return false;
  
  // Master admins always have access
  if (isMasterAdmin(user.email)) return true;
  
  // Check if user has admin role assigned
  return user.is_admin === true;
}
