// DAGARMY-specific permission definitions for course platform
export const PERMISSIONS = {
  // Dashboard & Analytics
  dashboard: {
    label: 'Dashboard & Analytics',
    permissions: [
      { key: 'dashboard.view', label: 'View Dashboard', description: 'Access main admin dashboard' },
      { key: 'dashboard.stats.users', label: 'View User Statistics', description: 'View user enrollment and activity stats' },
      { key: 'dashboard.stats.courses', label: 'View Course Statistics', description: 'View course performance metrics' },
      { key: 'dashboard.stats.progress', label: 'View Progress Statistics', description: 'View student progress and completion rates' },
      { key: 'dashboard.export', label: 'Export Dashboard Data', description: 'Export dashboard reports and analytics' }
    ]
  },

  // User Management
  users: {
    label: 'User Management',
    permissions: [
      { key: 'users.view', label: 'View Users', description: 'View list of registered users' },
      { key: 'users.view_details', label: 'View User Details', description: 'View complete user profiles and progress' },
      { key: 'users.edit', label: 'Edit Users', description: 'Edit user information and profiles' },
      { key: 'users.delete', label: 'Delete Users', description: 'Remove users from platform' },
      { key: 'users.suspend', label: 'Suspend Users', description: 'Suspend or ban user accounts' },
      { key: 'users.export', label: 'Export User Data', description: 'Export user lists and data' },
      { key: 'users.send_notifications', label: 'Send Notifications', description: 'Send notifications to users' },
      { key: 'users.manage_enrollments', label: 'Manage Enrollments', description: 'Enroll or unenroll users from courses' },
      { key: 'users.view_activity', label: 'View Activity Logs', description: 'View user activity and login history' }
    ]
  },

  // Course Management
  courses: {
    label: 'Course Management',
    permissions: [
      { key: 'courses.view', label: 'View Courses', description: 'View course list and details' },
      { key: 'courses.create', label: 'Create Courses', description: 'Create new courses with modules and lessons' },
      { key: 'courses.edit', label: 'Edit Courses', description: 'Edit course information and content' },
      { key: 'courses.delete', label: 'Delete Courses', description: 'Remove courses from platform' },
      { key: 'courses.publish', label: 'Publish Courses', description: 'Publish or unpublish courses' },
      { key: 'courses.manage_modules', label: 'Manage Modules', description: 'Add, edit, or remove course modules' },
      { key: 'courses.manage_lessons', label: 'Manage Lessons', description: 'Add, edit, or remove lessons' },
      { key: 'courses.manage_content', label: 'Manage Content', description: 'Upload and manage course materials' },
      { key: 'courses.view_analytics', label: 'View Course Analytics', description: 'View course performance and engagement data' }
    ]
  },

  // Content & Media
  content: {
    label: 'Content & Media',
    permissions: [
      { key: 'content.view', label: 'View Content', description: 'View uploaded content and media' },
      { key: 'content.upload', label: 'Upload Content', description: 'Upload videos, documents, and media files' },
      { key: 'content.edit', label: 'Edit Content', description: 'Edit content metadata and details' },
      { key: 'content.delete', label: 'Delete Content', description: 'Remove content and media files' },
      { key: 'content.manage_library', label: 'Manage Library', description: 'Organize content library and folders' }
    ]
  },

  // Student Progress & Tracking
  progress: {
    label: 'Student Progress & Tracking',
    permissions: [
      { key: 'progress.view', label: 'View Progress', description: 'View student progress across courses' },
      { key: 'progress.view_details', label: 'View Detailed Progress', description: 'View lesson-by-lesson progress' },
      { key: 'progress.reset', label: 'Reset Progress', description: 'Reset student progress for courses' },
      { key: 'progress.export', label: 'Export Progress Data', description: 'Export progress reports' },
      { key: 'progress.manage_certificates', label: 'Manage Certificates', description: 'Issue and manage course certificates' }
    ]
  },

  // Trainers & Mentors
  trainers: {
    label: 'Trainers & Mentors',
    permissions: [
      { key: 'trainers.view', label: 'View Trainers', description: 'View list of trainers and mentors' },
      { key: 'trainers.create', label: 'Add Trainers', description: 'Add new trainers or mentors' },
      { key: 'trainers.edit', label: 'Edit Trainers', description: 'Edit trainer profiles and information' },
      { key: 'trainers.delete', label: 'Remove Trainers', description: 'Remove trainers from platform' },
      { key: 'trainers.assign_courses', label: 'Assign Courses', description: 'Assign courses to trainers' }
    ]
  },

  // Communications
  communications: {
    label: 'Communications',
    permissions: [
      { key: 'communications.view', label: 'View Communications', description: 'View communication history' },
      { key: 'communications.send_email', label: 'Send Emails', description: 'Send emails to users' },
      { key: 'communications.send_notifications', label: 'Send Notifications', description: 'Send platform notifications' },
      { key: 'communications.announcements', label: 'Manage Announcements', description: 'Create and manage announcements' },
      { key: 'communications.templates', label: 'Manage Templates', description: 'Create and edit email templates' }
    ]
  },

  // Reports & Analytics
  reports: {
    label: 'Reports & Analytics',
    permissions: [
      { key: 'reports.view', label: 'View Reports', description: 'Access reports section' },
      { key: 'reports.user_reports', label: 'User Reports', description: 'Generate user activity reports' },
      { key: 'reports.course_reports', label: 'Course Reports', description: 'Generate course performance reports' },
      { key: 'reports.progress_reports', label: 'Progress Reports', description: 'Generate student progress reports' },
      { key: 'reports.engagement', label: 'Engagement Reports', description: 'View engagement and retention metrics' },
      { key: 'reports.export', label: 'Export Reports', description: 'Export reports in various formats' }
    ]
  },

  // Role & Access Management
  roles: {
    label: 'Role & Access Management',
    permissions: [
      { key: 'roles.view', label: 'View Roles', description: 'View admin roles and permissions' },
      { key: 'roles.assign', label: 'Assign Roles', description: 'Grant admin access to users' },
      { key: 'roles.edit', label: 'Edit Roles', description: 'Modify role permissions' },
      { key: 'roles.revoke', label: 'Revoke Access', description: 'Remove admin access from users' },
      { key: 'roles.create_custom', label: 'Create Custom Permissions', description: 'Create custom permission types (Master only)' }
    ]
  },

  // Settings & Configuration
  settings: {
    label: 'Settings & Configuration',
    permissions: [
      { key: 'settings.view', label: 'View Settings', description: 'View platform settings' },
      { key: 'settings.general', label: 'Edit General Settings', description: 'Modify general platform settings' },
      { key: 'settings.platform', label: 'Platform Configuration', description: 'Configure platform features and options' },
      { key: 'settings.integrations', label: 'Manage Integrations', description: 'Manage third-party integrations' },
      { key: 'settings.security', label: 'Security Settings', description: 'Manage security and access settings (Master only)' }
    ]
  },

  // System & Audit
  system: {
    label: 'System & Audit',
    permissions: [
      { key: 'system.audit_logs', label: 'View Audit Logs', description: 'View system audit trail' },
      { key: 'system.activity_logs', label: 'View Activity Logs', description: 'View user and admin activity logs' },
      { key: 'system.errors', label: 'View Error Logs', description: 'View system errors and issues' },
      { key: 'system.maintenance', label: 'Maintenance Mode', description: 'Enable or disable maintenance mode' }
    ]
  }
};

// Role templates for DAGARMY platform
export const ROLE_TEMPLATES = {
  super_admin: {
    name: 'Super Admin',
    description: 'Full access to all features except master security',
    permissions: Object.values(PERMISSIONS)
      .flatMap(module => module.permissions.map(p => p.key))
      .filter(key => !['settings.security', 'roles.create_custom'].includes(key))
  },
  content_manager: {
    name: 'Content Manager',
    description: 'Manage courses, modules, lessons, and content',
    permissions: [
      'dashboard.view',
      'dashboard.stats.courses',
      'courses.view', 'courses.create', 'courses.edit', 'courses.delete', 
      'courses.publish', 'courses.manage_modules', 'courses.manage_lessons', 
      'courses.manage_content', 'courses.view_analytics',
      'content.view', 'content.upload', 'content.edit', 'content.delete', 'content.manage_library',
      'trainers.view', 'trainers.assign_courses',
      'users.view',
      'reports.course_reports'
    ]
  },
  student_manager: {
    name: 'Student Manager',
    description: 'Manage students, enrollments, and progress',
    permissions: [
      'dashboard.view',
      'dashboard.stats.users',
      'dashboard.stats.progress',
      'users.view', 'users.view_details', 'users.edit', 'users.manage_enrollments',
      'users.send_notifications', 'users.view_activity',
      'progress.view', 'progress.view_details', 'progress.export', 'progress.manage_certificates',
      'courses.view',
      'communications.send_email', 'communications.send_notifications',
      'reports.user_reports', 'reports.progress_reports'
    ]
  },
  trainer_coordinator: {
    name: 'Trainer Coordinator',
    description: 'Manage trainers and course assignments',
    permissions: [
      'dashboard.view',
      'trainers.view', 'trainers.create', 'trainers.edit', 'trainers.delete', 'trainers.assign_courses',
      'courses.view', 'courses.view_analytics',
      'users.view',
      'communications.send_email', 'communications.send_notifications',
      'reports.course_reports'
    ]
  },
  communications_manager: {
    name: 'Communications Manager',
    description: 'Manage all platform communications',
    permissions: [
      'dashboard.view',
      'communications.view', 'communications.send_email', 'communications.send_notifications',
      'communications.announcements', 'communications.templates',
      'users.view', 'users.send_notifications',
      'courses.view'
    ]
  },
  analyst: {
    name: 'Data Analyst',
    description: 'View analytics and generate reports',
    permissions: [
      'dashboard.view', 'dashboard.stats.users', 'dashboard.stats.courses', 
      'dashboard.stats.progress', 'dashboard.export',
      'reports.view', 'reports.user_reports', 'reports.course_reports', 
      'reports.progress_reports', 'reports.engagement', 'reports.export',
      'users.view', 'users.view_details',
      'courses.view', 'courses.view_analytics',
      'progress.view', 'progress.view_details'
    ]
  }
};

// Helper functions
export function hasPermission(userPermissions, requiredPermission) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(userPermissions, requiredPermissions) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.some(perm => userPermissions.includes(perm));
}

export function hasAllPermissions(userPermissions, requiredPermissions) {
  if (!userPermissions || !Array.isArray(userPermissions)) return false;
  return requiredPermissions.every(perm => userPermissions.includes(perm));
}
