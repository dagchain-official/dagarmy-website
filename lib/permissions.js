// Comprehensive permission definitions for admin panel
export const PERMISSIONS = {
  // Dashboard & Analytics
  dashboard: {
    label: 'Dashboard & Analytics',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard', description: 'Access main dashboard' },
      { key: 'dashboard.stats.users', label: 'View User Stats', description: 'View user statistics' },
      { key: 'dashboard.stats.courses', label: 'View Course Stats', description: 'View course statistics' },
      { key: 'dashboard.stats.revenue', label: 'View Revenue Stats', description: 'View revenue statistics' },
      { key: 'dashboard.stats.engagement', label: 'View Engagement Stats', description: 'View engagement metrics' },
      { key: 'dashboard.export', label: 'Export Dashboard', description: 'Export dashboard reports' },
      { key: 'analytics.view', label: 'View Analytics', description: 'Access analytics section' },
      { key: 'analytics.users', label: 'User Analytics', description: 'View user behavior analytics' },
      { key: 'analytics.courses', label: 'Course Analytics', description: 'View course performance analytics' },
      { key: 'analytics.revenue', label: 'Revenue Analytics', description: 'View revenue analytics' },
      { key: 'analytics.export', label: 'Export Analytics', description: 'Export analytics data' }
    ]
  },

  // User Management
  users: {
    label: 'User Management',
    permissions: [
      { key: 'users.view', label: 'View Users', description: 'View user list' },
      { key: 'users.view_details', label: 'View User Details', description: 'View full user profiles' },
      { key: 'users.create', label: 'Create Users', description: 'Create new users' },
      { key: 'users.edit', label: 'Edit Users', description: 'Edit user information' },
      { key: 'users.edit_profile', label: 'Edit User Profiles', description: 'Edit user profiles' },
      { key: 'users.edit_role', label: 'Change User Roles', description: 'Change user roles' },
      { key: 'users.delete', label: 'Delete Users', description: 'Delete users' },
      { key: 'users.suspend', label: 'Suspend Users', description: 'Suspend or ban users' },
      { key: 'users.export', label: 'Export Users', description: 'Export user data' },
      { key: 'users.import', label: 'Import Users', description: 'Import users in bulk' },
      { key: 'users.impersonate', label: 'Impersonate Users', description: 'Login as user (support)' },
      { key: 'users.send_email', label: 'Send Emails', description: 'Send emails to users' },
      { key: 'users.view_activity', label: 'View Activity', description: 'View user activity logs' },
      { key: 'users.manage_enrollments', label: 'Manage Enrollments', description: 'Manage course enrollments' }
    ]
  },

  // Course Management
  courses: {
    label: 'Course Management',
    permissions: [
      { key: 'courses.view', label: 'View Courses', description: 'View course list' },
      { key: 'courses.view_details', label: 'View Course Details', description: 'View full course details' },
      { key: 'courses.create', label: 'Create Courses', description: 'Create new courses' },
      { key: 'courses.edit', label: 'Edit Courses', description: 'Edit course information' },
      { key: 'courses.edit_content', label: 'Edit Course Content', description: 'Edit course content/modules' },
      { key: 'courses.delete', label: 'Delete Courses', description: 'Delete courses' },
      { key: 'courses.publish', label: 'Publish Courses', description: 'Publish/unpublish courses' },
      { key: 'courses.duplicate', label: 'Duplicate Courses', description: 'Duplicate courses' },
      { key: 'courses.export', label: 'Export Courses', description: 'Export course data' },
      { key: 'courses.import', label: 'Import Courses', description: 'Import courses' },
      { key: 'courses.manage_pricing', label: 'Manage Pricing', description: 'Set course pricing' },
      { key: 'courses.manage_access', label: 'Manage Access', description: 'Control course access' },
      { key: 'courses.view_analytics', label: 'View Analytics', description: 'View course analytics' },
      { key: 'courses.manage_reviews', label: 'Manage Reviews', description: 'Moderate course reviews' },
      { key: 'courses.manage_certificates', label: 'Manage Certificates', description: 'Manage certificates' }
    ]
  },

  // Content Management
  content: {
    label: 'Content Management',
    permissions: [
      { key: 'content.view', label: 'View Content', description: 'View all content' },
      { key: 'content.create', label: 'Create Content', description: 'Create content' },
      { key: 'content.edit', label: 'Edit Content', description: 'Edit content' },
      { key: 'content.delete', label: 'Delete Content', description: 'Delete content' },
      { key: 'content.publish', label: 'Publish Content', description: 'Publish content' },
      { key: 'content.media.upload', label: 'Upload Media', description: 'Upload media files' },
      { key: 'content.media.delete', label: 'Delete Media', description: 'Delete media files' },
      { key: 'content.blog.manage', label: 'Manage Blog', description: 'Manage blog posts' },
      { key: 'content.pages.manage', label: 'Manage Pages', description: 'Manage static pages' },
      { key: 'content.seo.manage', label: 'Manage SEO', description: 'Manage SEO settings' }
    ]
  },

  // Role & Permission Management
  roles: {
    label: 'Role & Permission Management',
    permissions: [
      { key: 'roles.view', label: 'View Roles', description: 'View roles list' },
      { key: 'roles.view_permissions', label: 'View Permissions', description: 'View role permissions' },
      { key: 'roles.create', label: 'Create Roles', description: 'Create new roles' },
      { key: 'roles.edit', label: 'Edit Roles', description: 'Edit role details' },
      { key: 'roles.edit_permissions', label: 'Edit Permissions', description: 'Modify permissions' },
      { key: 'roles.delete', label: 'Delete Roles', description: 'Delete roles' },
      { key: 'roles.assign', label: 'Assign Roles', description: 'Assign roles to users' },
      { key: 'roles.revoke', label: 'Revoke Access', description: 'Revoke admin access' }
    ]
  },

  // Marketing & Communications
  marketing: {
    label: 'Marketing & Communications',
    permissions: [
      { key: 'marketing.view', label: 'View Marketing', description: 'View marketing dashboard' },
      { key: 'marketing.campaigns.view', label: 'View Campaigns', description: 'View campaigns' },
      { key: 'marketing.campaigns.create', label: 'Create Campaigns', description: 'Create campaigns' },
      { key: 'marketing.campaigns.edit', label: 'Edit Campaigns', description: 'Edit campaigns' },
      { key: 'marketing.campaigns.delete', label: 'Delete Campaigns', description: 'Delete campaigns' },
      { key: 'marketing.email.send', label: 'Send Emails', description: 'Send marketing emails' },
      { key: 'marketing.email.templates', label: 'Manage Templates', description: 'Manage email templates' },
      { key: 'marketing.notifications.send', label: 'Send Notifications', description: 'Send notifications' },
      { key: 'marketing.promotions.manage', label: 'Manage Promotions', description: 'Manage promotions/discounts' },
      { key: 'marketing.affiliates.manage', label: 'Manage Affiliates', description: 'Manage affiliate program' },
      { key: 'marketing.analytics', label: 'Marketing Analytics', description: 'View marketing analytics' }
    ]
  },

  // Financial Management
  finance: {
    label: 'Financial Management',
    permissions: [
      { key: 'finance.view', label: 'View Finance', description: 'View financial dashboard' },
      { key: 'finance.transactions.view', label: 'View Transactions', description: 'View transactions' },
      { key: 'finance.transactions.export', label: 'Export Transactions', description: 'Export transaction data' },
      { key: 'finance.revenue.view', label: 'View Revenue', description: 'View revenue reports' },
      { key: 'finance.payouts.view', label: 'View Payouts', description: 'View payout information' },
      { key: 'finance.payouts.process', label: 'Process Payouts', description: 'Process payouts' },
      { key: 'finance.refunds.view', label: 'View Refunds', description: 'View refund requests' },
      { key: 'finance.refunds.process', label: 'Process Refunds', description: 'Process refunds' },
      { key: 'finance.invoices.view', label: 'View Invoices', description: 'View invoices' },
      { key: 'finance.invoices.generate', label: 'Generate Invoices', description: 'Generate invoices' },
      { key: 'finance.pricing.manage', label: 'Manage Pricing', description: 'Manage pricing' }
    ]
  },

  // Support & Help Desk
  support: {
    label: 'Support & Help Desk',
    permissions: [
      { key: 'support.view', label: 'View Support', description: 'View support dashboard' },
      { key: 'support.tickets.view', label: 'View Tickets', description: 'View support tickets' },
      { key: 'support.tickets.respond', label: 'Respond to Tickets', description: 'Respond to tickets' },
      { key: 'support.tickets.assign', label: 'Assign Tickets', description: 'Assign tickets' },
      { key: 'support.tickets.close', label: 'Close Tickets', description: 'Close tickets' },
      { key: 'support.chat.access', label: 'Access Chat', description: 'Access live chat' },
      { key: 'support.users.impersonate', label: 'Impersonate Users', description: 'Login as user for support' },
      { key: 'support.refunds.request', label: 'Request Refunds', description: 'Request refunds' },
      { key: 'support.knowledge_base.manage', label: 'Manage Knowledge Base', description: 'Manage help articles' }
    ]
  },

  // HR & Team Management
  hr: {
    label: 'HR & Team Management',
    permissions: [
      { key: 'hr.view', label: 'View HR', description: 'View HR dashboard' },
      { key: 'hr.team.view', label: 'View Team', description: 'View team members' },
      { key: 'hr.team.add', label: 'Add Team Members', description: 'Add team members' },
      { key: 'hr.team.edit', label: 'Edit Team', description: 'Edit team information' },
      { key: 'hr.team.remove', label: 'Remove Team Members', description: 'Remove team members' },
      { key: 'hr.attendance.view', label: 'View Attendance', description: 'View attendance' },
      { key: 'hr.attendance.manage', label: 'Manage Attendance', description: 'Manage attendance' },
      { key: 'hr.payroll.view', label: 'View Payroll', description: 'View payroll' },
      { key: 'hr.payroll.process', label: 'Process Payroll', description: 'Process payroll' },
      { key: 'hr.performance.view', label: 'View Performance', description: 'View performance reviews' },
      { key: 'hr.performance.manage', label: 'Manage Performance', description: 'Manage performance reviews' }
    ]
  },

  // Settings & Configuration
  settings: {
    label: 'Settings & Configuration',
    permissions: [
      { key: 'settings.view', label: 'View Settings', description: 'View settings' },
      { key: 'settings.general.edit', label: 'Edit General Settings', description: 'Edit general settings' },
      { key: 'settings.security.view', label: 'View Security', description: 'View security settings' },
      { key: 'settings.security.edit', label: 'Edit Security', description: 'Edit security settings (Master only)' },
      { key: 'settings.integrations.view', label: 'View Integrations', description: 'View integrations' },
      { key: 'settings.integrations.manage', label: 'Manage Integrations', description: 'Manage integrations' },
      { key: 'settings.api.view', label: 'View API', description: 'View API settings' },
      { key: 'settings.api.manage', label: 'Manage API', description: 'Manage API keys' },
      { key: 'settings.backup.create', label: 'Create Backups', description: 'Create backups' },
      { key: 'settings.backup.restore', label: 'Restore Backups', description: 'Restore backups' }
    ]
  },

  // Reports & Exports
  reports: {
    label: 'Reports & Exports',
    permissions: [
      { key: 'reports.view', label: 'View Reports', description: 'View reports section' },
      { key: 'reports.users', label: 'User Reports', description: 'Generate user reports' },
      { key: 'reports.courses', label: 'Course Reports', description: 'Generate course reports' },
      { key: 'reports.revenue', label: 'Revenue Reports', description: 'Generate revenue reports' },
      { key: 'reports.engagement', label: 'Engagement Reports', description: 'Generate engagement reports' },
      { key: 'reports.custom', label: 'Custom Reports', description: 'Create custom reports' },
      { key: 'reports.schedule', label: 'Schedule Reports', description: 'Schedule automated reports' },
      { key: 'reports.export', label: 'Export Reports', description: 'Export all reports' }
    ]
  },

  // System & Logs
  system: {
    label: 'System & Logs',
    permissions: [
      { key: 'system.logs.view', label: 'View Logs', description: 'View system logs' },
      { key: 'system.logs.export', label: 'Export Logs', description: 'Export logs' },
      { key: 'system.audit.view', label: 'View Audit Trail', description: 'View audit trail' },
      { key: 'system.errors.view', label: 'View Errors', description: 'View error logs' },
      { key: 'system.performance.view', label: 'View Performance', description: 'View performance metrics' },
      { key: 'system.maintenance.access', label: 'Maintenance Access', description: 'Access maintenance mode' }
    ]
  }
};

// Role templates for quick selection
export const ROLE_TEMPLATES = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full access except master security settings',
    permissions: Object.values(PERMISSIONS)
      .flatMap(module => module.permissions.map(p => p.key))
      .filter(key => key !== 'settings.security.edit')
  },
  content_manager: {
    name: 'Content Manager',
    description: 'Manage courses and content',
    permissions: [
      'dashboard.view',
      'dashboard.stats.courses',
      'courses.view', 'courses.view_details', 'courses.create', 'courses.edit', 
      'courses.edit_content', 'courses.delete', 'courses.publish', 'courses.duplicate',
      'courses.export', 'courses.manage_pricing', 'courses.view_analytics',
      'content.view', 'content.create', 'content.edit', 'content.delete', 
      'content.publish', 'content.media.upload', 'content.media.delete',
      'content.blog.manage', 'content.seo.manage',
      'users.view'
    ]
  },
  marketing_manager: {
    name: 'Marketing Manager',
    description: 'Manage marketing campaigns and communications',
    permissions: [
      'dashboard.view',
      'marketing.view', 'marketing.campaigns.view', 'marketing.campaigns.create',
      'marketing.campaigns.edit', 'marketing.campaigns.delete', 'marketing.email.send',
      'marketing.email.templates', 'marketing.notifications.send', 
      'marketing.promotions.manage', 'marketing.affiliates.manage', 'marketing.analytics',
      'users.view', 'users.send_email',
      'courses.view', 'courses.view_analytics',
      'content.blog.manage', 'content.seo.manage',
      'analytics.users', 'analytics.courses'
    ]
  },
  user_manager: {
    name: 'User Manager',
    description: 'Manage users and enrollments',
    permissions: [
      'dashboard.view',
      'dashboard.stats.users',
      'users.view', 'users.view_details', 'users.create', 'users.edit',
      'users.edit_profile', 'users.delete', 'users.suspend', 'users.export',
      'users.import', 'users.send_email', 'users.view_activity', 'users.manage_enrollments',
      'courses.view'
    ]
  },
  support_admin: {
    name: 'Support Admin',
    description: 'Handle support tickets and user issues',
    permissions: [
      'dashboard.view',
      'support.view', 'support.tickets.view', 'support.tickets.respond',
      'support.tickets.assign', 'support.tickets.close', 'support.chat.access',
      'support.users.impersonate', 'support.refunds.request', 'support.knowledge_base.manage',
      'users.view', 'users.view_details', 'users.edit', 'users.impersonate',
      'courses.view', 'courses.view_details',
      'finance.refunds.view', 'finance.refunds.process'
    ]
  },
  data_analyst: {
    name: 'Data Analyst',
    description: 'View analytics and generate reports',
    permissions: [
      'dashboard.view', 'dashboard.stats.users', 'dashboard.stats.courses',
      'dashboard.stats.revenue', 'dashboard.stats.engagement', 'dashboard.export',
      'analytics.view', 'analytics.users', 'analytics.courses', 'analytics.revenue', 'analytics.export',
      'reports.view', 'reports.users', 'reports.courses', 'reports.revenue',
      'reports.engagement', 'reports.custom', 'reports.schedule', 'reports.export',
      'users.view', 'courses.view', 'finance.view'
    ]
  },
  hr_manager: {
    name: 'HR Manager',
    description: 'Manage team and HR operations',
    permissions: [
      'dashboard.view',
      'dashboard.stats.users',
      'hr.view', 'hr.team.view', 'hr.team.add', 'hr.team.edit', 'hr.team.remove',
      'hr.attendance.view', 'hr.attendance.manage', 'hr.payroll.view', 'hr.payroll.process',
      'hr.performance.view', 'hr.performance.manage',
      'users.view', 'users.view_details', 'users.edit_profile',
      'reports.users'
    ]
  },
  finance_manager: {
    name: 'Finance Manager',
    description: 'Manage financial operations',
    permissions: [
      'dashboard.view',
      'dashboard.stats.revenue',
      'finance.view', 'finance.transactions.view', 'finance.transactions.export',
      'finance.revenue.view', 'finance.payouts.view', 'finance.payouts.process',
      'finance.refunds.view', 'finance.refunds.process', 'finance.invoices.view',
      'finance.invoices.generate', 'finance.pricing.manage',
      'users.view', 'courses.view', 'courses.manage_pricing',
      'reports.revenue'
    ]
  }
};

// Helper function to check if user has permission
export function hasPermission(userPermissions, requiredPermission) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
}

// Helper function to check if user has any of the permissions
export function hasAnyPermission(userPermissions, requiredPermissions) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.some(perm => userPermissions.includes(perm));
}

// Helper function to check if user has all permissions
export function hasAllPermissions(userPermissions, requiredPermissions) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.every(perm => userPermissions.includes(perm));
}
