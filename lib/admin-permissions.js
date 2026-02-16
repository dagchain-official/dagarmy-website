// Comprehensive Admin Permission System
// Structure: Module -> Actions (Read, Write, Overwrite/Delete)

export const ADMIN_MODULES = {
  users: {
    label: 'User Management',
    description: 'Manage platform users, profiles, and enrollments',
    actions: {
      read: 'View users, profiles, and activity logs',
      write: 'Create users, edit profiles, manage enrollments',
      overwrite: 'Delete users, suspend accounts, reset passwords'
    }
  },
  courses: {
    label: 'Course Management',
    description: 'Manage courses, modules, and content',
    actions: {
      read: 'View courses, modules, lessons, and content',
      write: 'Create/edit courses, add modules, upload content',
      overwrite: 'Delete courses, remove modules, archive content'
    }
  },
  assignments: {
    label: 'Assignment Management',
    description: 'Manage assignments, submissions, and grading',
    actions: {
      read: 'View assignments, submissions, and grades',
      write: 'Create assignments, grade submissions, provide feedback',
      overwrite: 'Delete assignments, modify grades, reset submissions'
    }
  },
  certifications: {
    label: 'Certification Management',
    description: 'Manage certificates, templates, and issuance',
    actions: {
      read: 'View certificates, templates, and issuance records',
      write: 'Issue certificates, create templates, customize designs',
      overwrite: 'Revoke certificates, delete templates, bulk operations'
    }
  },
  notifications: {
    label: 'Notification Management',
    description: 'Manage notifications, announcements, and emails',
    actions: {
      read: 'View notifications, email logs, and delivery status',
      write: 'Send notifications, create announcements, schedule emails',
      overwrite: 'Delete notifications, cancel scheduled emails, bulk delete'
    }
  },
  rewards: {
    label: 'Rewards & Incentives',
    description: 'Manage rewards, points, badges, and leaderboards',
    actions: {
      read: 'View rewards, points, badges, and leaderboard',
      write: 'Award points, assign badges, create reward programs',
      overwrite: 'Revoke rewards, adjust points, reset leaderboards'
    }
  },
  analytics: {
    label: 'Analytics & Reports',
    description: 'Access analytics, reports, and data exports',
    actions: {
      read: 'View analytics, dashboards, and reports',
      write: 'Create custom reports, schedule exports, save filters',
      overwrite: 'Delete reports, modify analytics settings, bulk exports'
    }
  },
  content: {
    label: 'Content Management',
    description: 'Manage media, files, and content library',
    actions: {
      read: 'View media library, files, and content',
      write: 'Upload files, organize content, create folders',
      overwrite: 'Delete files, bulk operations, manage storage'
    }
  },
  payments: {
    label: 'Payment Management',
    description: 'Manage payments, transactions, and refunds',
    actions: {
      read: 'View transactions, payment history, and invoices',
      write: 'Process refunds, generate invoices, update payment methods',
      overwrite: 'Delete transactions, cancel payments, bulk refunds'
    }
  },
  settings: {
    label: 'Platform Settings',
    description: 'Manage platform configuration and settings',
    actions: {
      read: 'View platform settings and configurations',
      write: 'Update settings, configure features, manage integrations',
      overwrite: 'Reset settings, delete configurations, system-wide changes'
    }
  },
  roles: {
    label: 'Role & Permission Management',
    description: 'Manage admin roles and permissions',
    actions: {
      read: 'View admin roles and permissions',
      write: 'Create admins, assign roles, modify permissions',
      overwrite: 'Delete admins, revoke access, change master permissions'
    }
  },
  support: {
    label: 'Support & Help Desk',
    description: 'Manage support tickets and user inquiries',
    actions: {
      read: 'View support tickets, messages, and history',
      write: 'Respond to tickets, create internal notes, assign tickets',
      overwrite: 'Close tickets, delete conversations, bulk operations'
    }
  },
  marketing: {
    label: 'Marketing & Campaigns',
    description: 'Manage marketing campaigns and promotions',
    actions: {
      read: 'View campaigns, promotions, and performance metrics',
      write: 'Create campaigns, send promotions, manage coupons',
      overwrite: 'Delete campaigns, cancel promotions, bulk operations'
    }
  },
  logs: {
    label: 'System Logs & Audit',
    description: 'Access system logs and audit trails',
    actions: {
      read: 'View system logs, audit trails, and activity history',
      write: 'Export logs, create audit reports, flag activities',
      overwrite: 'Delete logs, clear audit trails, archive old data'
    }
  },
};

// Helper function to get all permission keys
export function getAllPermissionKeys() {
  const keys = [];
  Object.entries(ADMIN_MODULES).forEach(([moduleKey, module]) => {
    keys.push(`${moduleKey}.read`);
    keys.push(`${moduleKey}.write`);
    keys.push(`${moduleKey}.overwrite`);
  });
  return keys;
}

// Helper function to check if user has permission
export function hasPermission(userPermissions, requiredPermission) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
}

// Helper function to get module permissions
export function getModulePermissions(userPermissions, moduleKey) {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return { read: false, write: false, overwrite: false };
  }
  
  return {
    read: userPermissions.includes(`${moduleKey}.read`),
    write: userPermissions.includes(`${moduleKey}.write`),
    overwrite: userPermissions.includes(`${moduleKey}.overwrite`)
  };
}

// Role templates with predefined permissions
export const ADMIN_ROLE_TEMPLATES = {
  content_manager: {
    name: 'Content Manager',
    description: 'Manage courses, content, and media',
    permissions: [
      'courses.read', 'courses.write', 'courses.overwrite',
      'content.read', 'content.write', 'content.overwrite',
      'assignments.read', 'assignments.write',
      'analytics.read'
    ]
  },
  user_manager: {
    name: 'User Manager',
    description: 'Manage users and enrollments',
    permissions: [
      'users.read', 'users.write', 'users.overwrite',
      'courses.read',
      'certifications.read', 'certifications.write',
      'support.read', 'support.write',
      'analytics.read'
    ]
  },
  support_admin: {
    name: 'Support Admin',
    description: 'Handle support tickets and user inquiries',
    permissions: [
      'users.read',
      'support.read', 'support.write', 'support.overwrite',
      'notifications.read', 'notifications.write',
      'logs.read'
    ]
  },
  marketing_manager: {
    name: 'Marketing Manager',
    description: 'Manage marketing campaigns and promotions',
    permissions: [
      'marketing.read', 'marketing.write', 'marketing.overwrite',
      'notifications.read', 'notifications.write',
      'users.read',
      'analytics.read', 'analytics.write'
    ]
  },
  operations_manager: {
    name: 'Operations Manager',
    description: 'Full operational access except system settings',
    permissions: [
      'users.read', 'users.write',
      'courses.read', 'courses.write', 'courses.overwrite',
      'assignments.read', 'assignments.write', 'assignments.overwrite',
      'certifications.read', 'certifications.write', 'certifications.overwrite',
      'notifications.read', 'notifications.write',
      'rewards.read', 'rewards.write', 'rewards.overwrite',
      'analytics.read', 'analytics.write',
      'content.read', 'content.write', 'content.overwrite',
      'support.read', 'support.write',
      'marketing.read', 'marketing.write',
      'logs.read'
    ]
  },
  super_admin: {
    name: 'Super Admin',
    description: 'Full access to all modules (except master admin functions)',
    permissions: getAllPermissionKeys().filter(key => !key.startsWith('roles.overwrite'))
  }
};
