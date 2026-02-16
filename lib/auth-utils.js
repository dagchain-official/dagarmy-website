// Authentication utilities for admin access control

// Master admin email whitelist — loaded from env var (comma-separated)
export const MASTER_ADMIN_EMAILS = (process.env.MASTER_ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);

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

// Check if user has any admin access (master admin or assigned role via admin_roles table)
export function hasAdminAccess(user) {
  if (!user) return false;
  
  // Master admins always have access
  if (isMasterAdmin(user.email)) return true;
  
  // For non-master admins, admin access is determined by check-role API (admin_roles table)
  // Do NOT trust is_admin flag from users table alone
  return false;
}
