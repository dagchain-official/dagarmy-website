"use client";
import React, { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const API_ENDPOINTS = [
  // ─── Admin Auth ───
  {
    category: "Admin Auth",
    method: "POST",
    path: "/api/admin/auth/login",
    description: "Authenticate admin user with email and password. Returns session token via cookie. Includes brute-force protection (5 attempts, 30min lockout).",
    auth: "None",
    body: '{ email, password }',
    response: '{ success, admin: { id, email, full_name, role } }'
  },
  {
    category: "Admin Auth",
    method: "POST",
    path: "/api/admin/auth/logout",
    description: "Invalidate admin session. Deletes session from DB and clears cookie.",
    auth: "Admin Session Cookie",
    body: "None",
    response: '{ success, message }'
  },
  {
    category: "Admin Auth",
    method: "GET",
    path: "/api/admin/auth/verify-session",
    description: "Verify current admin session validity. Checks session token from cookie against database.",
    auth: "Admin Session Cookie",
    body: "None",
    response: '{ valid, admin: { id, email, full_name, role } }'
  },
  {
    category: "Admin Auth",
    method: "POST",
    path: "/api/admin/auth/create-admin",
    description: "Create a new sub-admin account with specified permissions. Generates a temporary password. Master admin only.",
    auth: "Master Admin",
    body: '{ email, full_name, role_name, permissions, created_by_id }',
    response: '{ success, admin, temporaryPassword }'
  },
  {
    category: "Admin Auth",
    method: "POST",
    path: "/api/admin/auth/change-password",
    description: "Change admin password. Validates password strength (12+ chars, uppercase, lowercase, numbers, special chars).",
    auth: "Admin Session Cookie",
    body: '{ admin_id, current_password, new_password }',
    response: '{ success, message }'
  },

  // ─── Admin Courses ───
  {
    category: "Admin Courses",
    method: "GET",
    path: "/api/admin/courses/all",
    description: "Fetch all courses with creators, modules, and lessons. Supports filtering by status, creatorId, and category.",
    auth: "Admin",
    body: "None",
    response: '{ courses: [{ id, title, modules: [...], creator: {...} }] }',
    params: "?status=published&creatorId=uuid&category=Technology"
  },
  {
    category: "Admin Courses",
    method: "POST",
    path: "/api/admin/courses/all",
    description: "Create a new course entry in the database.",
    auth: "Admin",
    body: '{ title, slug, description, category, level, ... }',
    response: '{ course: { id, title, ... } }'
  },
  {
    category: "Admin Courses",
    method: "PUT",
    path: "/api/admin/courses/all",
    description: "Update an existing course by ID.",
    auth: "Admin",
    body: '{ id, title, description, status, ... }',
    response: '{ course: { id, ... } }'
  },
  {
    category: "Admin Courses",
    method: "DELETE",
    path: "/api/admin/courses/all",
    description: "Delete a course by ID.",
    auth: "Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },
  {
    category: "Admin Courses",
    method: "POST",
    path: "/api/admin/courses/create-full",
    description: "Create a complete course with modules and lessons in a single request. Requires title and at least one module.",
    auth: "Admin",
    body: '{ course: { title, slug, ... }, modules: [{ title, lessons: [...] }] }',
    response: '{ course, modules, lessons }'
  },
  {
    category: "Admin Courses",
    method: "POST",
    path: "/api/admin/courses",
    description: "Add a course to the local file-based courses data (legacy). Writes to data/dagarmy-courses.js.",
    auth: "Admin",
    body: '{ title, instructor, ... }',
    response: '{ success, course }'
  },
  {
    category: "Admin Courses",
    method: "POST",
    path: "/api/admin/courses/seed-multi",
    description: "Seed the database with the Next-Gen program data including creator, course, modules, and lessons.",
    auth: "Admin",
    body: "None",
    response: '{ success, creator, course, modules, lessons }'
  },

  // ─── Admin Creators ───
  {
    category: "Admin Creators",
    method: "GET",
    path: "/api/admin/creators",
    description: "Fetch all course creators. Filter by role (organization, trainer, mentor, instructor) and active status.",
    auth: "Admin",
    body: "None",
    response: '{ creators: [...] }',
    params: "?role=trainer&isActive=true"
  },
  {
    category: "Admin Creators",
    method: "POST",
    path: "/api/admin/creators",
    description: "Create a new course creator profile.",
    auth: "Admin",
    body: '{ name, role, bio, ... }',
    response: '{ creator: { id, ... } }'
  },
  {
    category: "Admin Creators",
    method: "PUT",
    path: "/api/admin/creators",
    description: "Update an existing course creator.",
    auth: "Admin",
    body: '{ id, name, role, ... }',
    response: '{ creator: { id, ... } }'
  },
  {
    category: "Admin Creators",
    method: "DELETE",
    path: "/api/admin/creators",
    description: "Delete a course creator by ID.",
    auth: "Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Admin Modules ───
  {
    category: "Admin Modules",
    method: "GET",
    path: "/api/admin/modules",
    description: "Fetch all modules for a specific program, ordered by order_index.",
    auth: "Admin",
    body: "None",
    response: '{ modules: [...] }',
    params: "?programId=uuid"
  },
  {
    category: "Admin Modules",
    method: "POST",
    path: "/api/admin/modules",
    description: "Create a new module within a program.",
    auth: "Admin",
    body: '{ program_id, title, order_index, ... }',
    response: '{ module: { id, ... } }'
  },
  {
    category: "Admin Modules",
    method: "PUT",
    path: "/api/admin/modules",
    description: "Update an existing module.",
    auth: "Admin",
    body: '{ id, title, order_index, ... }',
    response: '{ module: { id, ... } }'
  },
  {
    category: "Admin Modules",
    method: "DELETE",
    path: "/api/admin/modules",
    description: "Delete a module by ID.",
    auth: "Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Admin Lessons ───
  {
    category: "Admin Lessons",
    method: "GET",
    path: "/api/admin/lessons",
    description: "Fetch all lessons for a specific module, ordered by order_index.",
    auth: "Admin",
    body: "None",
    response: '{ lessons: [...] }',
    params: "?moduleId=uuid"
  },
  {
    category: "Admin Lessons",
    method: "POST",
    path: "/api/admin/lessons",
    description: "Create a new lesson within a module.",
    auth: "Admin",
    body: '{ module_id, title, content, order_index, ... }',
    response: '{ lesson: { id, ... } }'
  },
  {
    category: "Admin Lessons",
    method: "PUT",
    path: "/api/admin/lessons",
    description: "Update an existing lesson.",
    auth: "Admin",
    body: '{ id, title, content, ... }',
    response: '{ lesson: { id, ... } }'
  },
  {
    category: "Admin Lessons",
    method: "DELETE",
    path: "/api/admin/lessons",
    description: "Delete a lesson by ID.",
    auth: "Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Admin Programs ───
  {
    category: "Admin Programs",
    method: "GET",
    path: "/api/admin/programs",
    description: "Fetch all active programs ordered by creation date.",
    auth: "Admin",
    body: "None",
    response: '{ programs: [...] }'
  },
  {
    category: "Admin Programs",
    method: "POST",
    path: "/api/admin/programs/seed",
    description: "Seed the Next-Gen program data into the database. Checks for existing program before creating.",
    auth: "Admin",
    body: "None",
    response: '{ success, program, modules, lessons }'
  },

  // ─── Admin Users ───
  {
    category: "Admin Users",
    method: "GET",
    path: "/api/admin/users",
    description: "Fetch all users with profile data, stats (totalUsers, activeUsers, newUsersThisWeek, weeklyGrowth, growthRate).",
    auth: "Admin",
    body: "None",
    response: '{ users: [...], stats: { totalUsers, activeUsers, ... } }'
  },
  {
    category: "Admin Users",
    method: "PUT",
    path: "/api/admin/users/update",
    description: "Update a user's profile data (name, email, role, country, etc.).",
    auth: "Admin",
    body: '{ id, full_name, first_name, last_name, user_provided_email, wallet_address, role, country_code, ... }',
    response: '{ user: { id, ... } }'
  },

  // ─── Admin Roles ───
  {
    category: "Admin Roles",
    method: "GET",
    path: "/api/admin/roles",
    description: "Fetch all admin roles with user details and assigned_by info.",
    auth: "Admin",
    body: "None",
    response: '{ roles: [{ id, role_name, user: {...}, assigned_by_user: {...} }] }'
  },
  {
    category: "Admin Roles",
    method: "POST",
    path: "/api/admin/roles",
    description: "Assign a new admin role to a user.",
    auth: "Master Admin",
    body: '{ user_id, role_name, permissions, assigned_by }',
    response: '{ role: { id, ... } }'
  },
  {
    category: "Admin Roles",
    method: "PUT",
    path: "/api/admin/roles",
    description: "Update an existing admin role's permissions.",
    auth: "Master Admin",
    body: '{ id, role_name, permissions }',
    response: '{ role: { id, ... } }'
  },
  {
    category: "Admin Roles",
    method: "DELETE",
    path: "/api/admin/roles",
    description: "Revoke an admin role by ID.",
    auth: "Master Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Admin Custom Permissions ───
  {
    category: "Admin Permissions",
    method: "GET",
    path: "/api/admin/custom-permissions",
    description: "Fetch all active custom permissions.",
    auth: "Admin",
    body: "None",
    response: '{ permissions: [...] }'
  },
  {
    category: "Admin Permissions",
    method: "POST",
    path: "/api/admin/custom-permissions",
    description: "Create a new custom permission.",
    auth: "Master Admin",
    body: '{ name, description, module, ... }',
    response: '{ permission: { id, ... } }'
  },
  {
    category: "Admin Permissions",
    method: "DELETE",
    path: "/api/admin/custom-permissions",
    description: "Delete a custom permission by ID.",
    auth: "Master Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Admin Events ───
  {
    category: "Admin Events",
    method: "GET",
    path: "/api/admin/events",
    description: "Fetch all events (including unpublished drafts). Supports pagination.",
    auth: "Admin",
    body: "None",
    response: '{ events: [...], total, page, totalPages }',
    params: "?page=1&limit=50"
  },
  {
    category: "Admin Events",
    method: "POST",
    path: "/api/admin/events",
    description: "Create a new event. Requires title and event_date. Supports event types: workshop, quiz, project, meeting, deadline.",
    auth: "Admin",
    body: '{ title, description, event_date, event_time, end_time, event_type, location, is_online, meeting_link, is_published }',
    response: '{ success, event: { id, title, ... } }'
  },
  {
    category: "Admin Events",
    method: "PUT",
    path: "/api/admin/events",
    description: "Update an existing event by ID. Supports partial updates (only send fields to change).",
    auth: "Admin",
    body: '{ id, title?, description?, event_date?, event_time?, end_time?, event_type?, location?, is_online?, meeting_link?, is_published? }',
    response: '{ success, event: { id, ... } }'
  },
  {
    category: "Admin Events",
    method: "DELETE",
    path: "/api/admin/events",
    description: "Permanently delete an event by ID.",
    auth: "Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Events (Public) ───
  {
    category: "Events",
    method: "GET",
    path: "/api/events",
    description: "Fetch published events for a given month. Used by the Student Dashboard calendar. Returns events within a +/-7 day window around the requested month.",
    auth: "None",
    body: "None",
    response: '{ events: [{ id, title, description, event_date, event_time, end_time, event_type, color, location, is_online, meeting_link }] }',
    params: "?year=2026&month=2"
  },

  // ─── User Auth ───
  {
    category: "User Auth",
    method: "POST",
    path: "/api/auth/user",
    description: "Create or update user profile after wallet/social authentication. Handles Reown Auth integration.",
    auth: "None",
    body: '{ wallet_address, email, full_name, avatar_url, ... }',
    response: '{ user: { id, ... } }'
  },
  {
    category: "User Auth",
    method: "GET",
    path: "/api/auth/user",
    description: "Get user profile by wallet address or email.",
    auth: "None",
    body: "None",
    response: '{ user: { id, ... } }',
    params: "?wallet=0x...&email=user@example.com"
  },
  {
    category: "User Auth",
    method: "POST",
    path: "/api/auth/check-admin",
    description: "Check if a user has admin access (master admin or assigned role).",
    auth: "None",
    body: '{ userId }',
    response: '{ isAdmin, isMasterAdmin, role }'
  },
  {
    category: "User Auth",
    method: "POST",
    path: "/api/auth/check-master-admin",
    description: "Check if an email belongs to a master admin.",
    auth: "None",
    body: '{ email }',
    response: '{ isMasterAdmin }'
  },
  {
    category: "User Auth",
    method: "POST",
    path: "/api/auth/check-role",
    description: "Check admin access level and permissions for an email address.",
    auth: "None",
    body: '{ email }',
    response: '{ success, isAdmin, isMasterAdmin, permissions }'
  },
  {
    category: "User Auth",
    method: "POST",
    path: "/api/auth/complete-profile",
    description: "Complete user profile during onboarding (first-time setup after wallet/social login).",
    auth: "Authenticated User",
    body: '{ wallet_address, email, first_name, last_name, country_code, ... }',
    response: '{ user: { id, ... } }'
  },
  {
    category: "User Auth",
    method: "POST",
    path: "/api/auth/update-profile",
    description: "Update existing user profile fields (name, email, avatar, etc.).",
    auth: "Authenticated User",
    body: '{ wallet_address, first_name, last_name, ... }',
    response: '{ user: { id, ... } }'
  },

  // ─── Reown ───
  {
    category: "Reown",
    method: "GET",
    path: "/api/reown/user-profile",
    description: "Fetch user profile from Reown Auth API. Needed because Reown doesn't expose social login email/name in client SDK.",
    auth: "None",
    body: "None",
    response: '{ address, email, name, ... }',
    params: "?address=0x..."
  },

  // ─── Assignments ───
  {
    category: "Assignments",
    method: "POST",
    path: "/api/assignments/create",
    description: "Create a new assignment for a course/module.",
    auth: "Admin / Trainer",
    body: '{ title, description, module_id, due_date, ... }',
    response: '{ assignment: { id, ... } }'
  },
  {
    category: "Assignments",
    method: "GET",
    path: "/api/assignments/student",
    description: "Fetch assignments for a student by email.",
    auth: "Authenticated User",
    body: "None",
    response: '{ assignments: [...] }',
    params: "?email=student@example.com"
  },
  {
    category: "Assignments",
    method: "POST",
    path: "/api/assignments/submit",
    description: "Submit an assignment answer/solution.",
    auth: "Authenticated User",
    body: '{ assignment_id, student_email, submission_url, ... }',
    response: '{ submission: { id, ... } }'
  },
  {
    category: "Assignments",
    method: "POST",
    path: "/api/assignments/upload",
    description: "Upload a file for assignment submission. Accepts FormData with file.",
    auth: "Authenticated User",
    body: "FormData: { file }",
    response: '{ url, filename }'
  },
  {
    category: "Assignments",
    method: "GET",
    path: "/api/assignments/trainer/submissions",
    description: "Fetch all submissions for a trainer to review.",
    auth: "Trainer",
    body: "None",
    response: '{ submissions: [...] }',
    params: "?email=trainer@example.com"
  },
  {
    category: "Assignments",
    method: "POST",
    path: "/api/assignments/trainer/submissions",
    description: "Grade a student's submission (approve/reject with feedback).",
    auth: "Trainer",
    body: '{ submission_id, grade, feedback, status }',
    response: '{ submission: { id, ... } }'
  },

  // ─── Batches ───
  {
    category: "Batches",
    method: "GET",
    path: "/api/batches",
    description: "Fetch all batches, optionally filtered by courseId.",
    auth: "Admin",
    body: "None",
    response: '{ batches: [...] }',
    params: "?courseId=uuid"
  },
  {
    category: "Batches",
    method: "POST",
    path: "/api/batches",
    description: "Create a new batch for a course.",
    auth: "Admin",
    body: '{ course_id, name, start_date, end_date, ... }',
    response: '{ batch: { id, ... } }'
  },

  // ─── Courses (Public) ───
  {
    category: "Courses",
    method: "GET",
    path: "/api/courses/modules",
    description: "Fetch modules for a specific course (public-facing).",
    auth: "None",
    body: "None",
    response: '{ modules: [...] }',
    params: "?courseId=uuid"
  },

  // ─── Blog ───
  {
    category: "Blog",
    method: "GET",
    path: "/api/blog/medium",
    description: "Fetch latest blog posts from Medium RSS feed (@dagchain).",
    auth: "None",
    body: "None",
    response: '{ posts: [{ title, link, pubDate, ... }] }'
  },

  // ─── Emails ───
  {
    category: "Emails",
    method: "POST",
    path: "/api/emails/welcome",
    description: "Send a welcome email to a new user. Triggered automatically after profile completion.",
    auth: "Internal",
    body: '{ email, name }',
    response: '{ success, id }'
  },
  {
    category: "Emails",
    method: "POST",
    path: "/api/emails/send",
    description: "Send custom emails to one or more recipients. Supports HTML body, CTA buttons, and bulk sending. Used by admin for announcements.",
    auth: "Admin",
    body: '{ recipients: ["email@..."], subject, title, body, ctaText?, ctaUrl?, senderName?, senderEmail? }',
    response: '{ success, results: [...] }'
  },
  {
    category: "Emails",
    method: "GET",
    path: "/api/emails/verify",
    description: "Verify SMTP connection is working. Returns connection status for email service health check.",
    auth: "Admin",
    body: "None",
    response: '{ connected, message }'
  },

  // ─── Leaderboard ───
  {
    category: "Leaderboard",
    method: "GET",
    path: "/api/leaderboard",
    description: "Fetch the platform leaderboard with user rankings.",
    auth: "None",
    body: "None",
    response: '{ leaderboard: [...] }'
  },

  // ─── Notifications ───
  {
    category: "Notifications",
    method: "POST",
    path: "/api/notifications/send",
    description: "Send a notification to one or more users.",
    auth: "Admin",
    body: '{ title, message, type, recipients, ... }',
    response: '{ success, notification }'
  },
  {
    category: "Notifications",
    method: "GET",
    path: "/api/notifications/user",
    description: "Fetch notifications for a specific user by email.",
    auth: "Authenticated User",
    body: "None",
    response: '{ notifications: [...] }',
    params: "?email=user@example.com"
  },
  {
    category: "Notifications",
    method: "POST",
    path: "/api/notifications/user",
    description: "Mark notification as read or dismissed.",
    auth: "Authenticated User",
    body: '{ recipient_id, action, user_email }',
    response: '{ success }'
  },
  {
    category: "Notifications",
    method: "GET",
    path: "/api/notifications/admin",
    description: "Fetch all notifications (admin view). Supports filtering.",
    auth: "Admin",
    body: "None",
    response: '{ notifications: [...] }',
    params: "?adminEmail=admin@example.com"
  },
  {
    category: "Notifications",
    method: "PUT",
    path: "/api/notifications/admin",
    description: "Update notification status (activate/deactivate).",
    auth: "Admin",
    body: '{ notification_id, is_active, admin_email }',
    response: '{ notification: { id, ... } }'
  },
  {
    category: "Notifications",
    method: "DELETE",
    path: "/api/notifications/admin",
    description: "Delete a notification by ID.",
    auth: "Admin",
    body: "None",
    response: '{ success }',
    params: "?id=uuid"
  },

  // ─── Referral ───
  {
    category: "Referral",
    method: "GET",
    path: "/api/referral/get-code",
    description: "Get or create a referral code for the authenticated user.",
    auth: "Authenticated User",
    body: "None",
    response: '{ code, ... }',
    params: "?userId=uuid"
  },
  {
    category: "Referral",
    method: "POST",
    path: "/api/referral/validate",
    description: "Validate a referral code to check if it's valid and active.",
    auth: "None",
    body: '{ code }',
    response: '{ valid, referrer }'
  },
  {
    category: "Referral",
    method: "POST",
    path: "/api/referral/track",
    description: "Track a referral when a new user signs up with a referral code.",
    auth: "None",
    body: '{ referralCode, userId }',
    response: '{ success }'
  },
  {
    category: "Referral",
    method: "GET",
    path: "/api/referral/stats",
    description: "Get referral statistics for the authenticated user (total referrals, rewards earned, etc.).",
    auth: "Authenticated User",
    body: "None",
    response: '{ stats: { totalReferrals, ... } }',
    params: "?userId=uuid"
  },
  {
    category: "Referral",
    method: "POST",
    path: "/api/referral/complete",
    description: "Complete a referral and award rewards. Called when referred user completes onboarding.",
    auth: "Internal",
    body: '{ userId }',
    response: '{ success, rewards }'
  },

  // ─── Rewards ───
  {
    category: "Rewards",
    method: "GET",
    path: "/api/rewards/user",
    description: "Fetch reward data for a specific user by email.",
    auth: "Authenticated User",
    body: "None",
    response: '{ rewards: { points, tier, ... } }',
    params: "?email=user@example.com"
  },
  {
    category: "Rewards",
    method: "GET",
    path: "/api/rewards/points",
    description: "Fetch user's points balance and transaction history.",
    auth: "Authenticated User",
    body: "None",
    response: '{ points, transactions: [...] }'
  },
  {
    category: "Rewards",
    method: "POST",
    path: "/api/rewards/points",
    description: "Add points to a user (admin manual adjustment).",
    auth: "Admin",
    body: '{ user_id, points, reason }',
    response: '{ success, newBalance }'
  },
  {
    category: "Rewards",
    method: "GET",
    path: "/api/rewards/config",
    description: "Fetch all rewards configuration (point values, tier thresholds, etc.).",
    auth: "Admin",
    body: "None",
    response: '{ config: [...] }'
  },
  {
    category: "Rewards",
    method: "PUT",
    path: "/api/rewards/config",
    description: "Update rewards configuration. Master admin only.",
    auth: "Master Admin",
    body: '{ config_id, value, ... }',
    response: '{ config: { id, ... } }'
  },
  {
    category: "Rewards",
    method: "POST",
    path: "/api/rewards/upgrade",
    description: "Upgrade user tier to DAG LIEUTENANT.",
    auth: "Admin",
    body: '{ user_id }',
    response: '{ success, newTier }'
  },
  {
    category: "Rewards",
    method: "POST",
    path: "/api/rewards/rank-upgrade",
    description: "Burn DAG Points to upgrade user rank. Sequential progression: None -> INITIATOR -> ... -> MYTHIC. Fetches burn cost from rewards_config, validates balance, burns points via add_dag_points, updates current_rank.",
    auth: "Authenticated User",
    body: '{ user_email }',
    response: '{ success, previousRank, newRank, pointsBurned, availablePoints }'
  },

  // ─── Jobs ───
  {
    category: "Jobs",
    method: "GET",
    path: "/api/scrape-jobs",
    description: "Scrape job listings from external sources. Supports keyword and location filters.",
    auth: "None",
    body: "None",
    response: '{ jobs: [...] }',
    params: "?keywords=Python&location=United States"
  },

  // ─── Upload ───
  {
    category: "Upload",
    method: "POST",
    path: "/api/upload",
    description: "Upload a file to Supabase storage. Accepts FormData with file and optional folder name.",
    auth: "Authenticated User",
    body: "FormData: { file, folder? }",
    response: '{ url, filename }'
  },

  // ─── Social Tasks ───
  {
    category: "Social Tasks",
    method: "GET",
    path: "/api/social-tasks",
    description: "List all social tasks. By default returns only active tasks. Set active=false to include inactive.",
    auth: "None",
    body: "None",
    response: '{ success, tasks: [{ id, platform, task_type, title, description, points, target_url, is_active, ... }] }',
    params: "?active=false"
  },
  {
    category: "Social Tasks",
    method: "POST",
    path: "/api/social-tasks",
    description: "Create a new social media task with platform, type, points, and optional target URL and expiry.",
    auth: "Master Admin",
    body: '{ user_email, platform, task_type, title, description?, points, target_url?, max_completions_per_user?, expires_at? }',
    response: '{ success, task: { id, ... } }'
  },
  {
    category: "Social Tasks",
    method: "PUT",
    path: "/api/social-tasks/[id]",
    description: "Update an existing social task (title, points, active status, etc).",
    auth: "Master Admin",
    body: '{ user_email, platform?, task_type?, title?, points?, is_active?, ... }',
    response: '{ success, task: { id, ... } }'
  },
  {
    category: "Social Tasks",
    method: "DELETE",
    path: "/api/social-tasks/[id]",
    description: "Delete a social task and all its submissions.",
    auth: "Master Admin",
    body: "None",
    response: '{ success, message }',
    params: "?user_email=admin@example.com"
  },
  {
    category: "Social Tasks",
    method: "POST",
    path: "/api/social-tasks/submit",
    description: "User submits proof (URL or screenshot) for a social task. Validates task is active, not expired, and user hasn't exceeded max completions.",
    auth: "Authenticated User",
    body: '{ task_id, user_email, proof_url?, proof_screenshot_url? }',
    response: '{ success, submission: { id, status, ... } }'
  },
  {
    category: "Social Tasks",
    method: "GET",
    path: "/api/social-tasks/submissions",
    description: "Admin: fetch all submissions, optionally filtered by status (pending, approved, rejected).",
    auth: "Admin",
    body: "None",
    response: '{ success, submissions: [{ id, task, user, status, proof_url, ... }] }',
    params: "?user_email=admin@example.com&status=pending"
  },
  {
    category: "Social Tasks",
    method: "PUT",
    path: "/api/social-tasks/submissions/[id]",
    description: "Admin approves or rejects a submission. On approval, DAG points are awarded via add_dag_points (with 20% DAG LIEUTENANT bonus if applicable).",
    auth: "Admin",
    body: '{ user_email, status: "approved"|"rejected", admin_notes? }',
    response: '{ success, submission, points_awarded, message }'
  },
  {
    category: "Social Tasks",
    method: "GET",
    path: "/api/social-tasks/user",
    description: "Fetch all active tasks with the user's submission status (available, pending, completed, expired) and stats.",
    auth: "Authenticated User",
    body: "None",
    response: '{ success, tasks: [...], stats: { total_tasks, completed, pending, available, total_points_earned }, is_lieutenant, lt_bonus_rate }',
    params: "?user_email=user@example.com"
  }
];

const METHOD_COLORS = {
  GET: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  POST: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  PUT: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  DELETE: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  PATCH: { bg: '#f5f3ff', text: '#7c3aed', border: '#ddd6fe' }
};

const AUTH_COLORS = {
  'None': { bg: '#f1f5f9', text: '#64748b' },
  'Admin': { bg: '#ede9fe', text: '#6d28d9' },
  'Admin Session Cookie': { bg: '#ede9fe', text: '#6d28d9' },
  'Master Admin': { bg: '#fce7f3', text: '#be185d' },
  'Authenticated User': { bg: '#dbeafe', text: '#1d4ed8' },
  'Trainer': { bg: '#dcfce7', text: '#15803d' },
  'Admin / Trainer': { bg: '#fef3c7', text: '#a16207' },
  'Internal': { bg: '#f1f5f9', text: '#475569' }
};

export default function ApiDocsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [copiedPath, setCopiedPath] = useState(null);

  const categories = useMemo(() => {
    const cats = [...new Set(API_ENDPOINTS.map(e => e.category))];
    return ["All", ...cats];
  }, []);

  const methods = ["All", "GET", "POST", "PUT", "DELETE"];

  const filtered = useMemo(() => {
    return API_ENDPOINTS.filter(ep => {
      const matchesSearch = searchQuery === "" ||
        ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || ep.category === selectedCategory;
      const matchesMethod = selectedMethod === "All" || ep.method === selectedMethod;
      return matchesSearch && matchesCategory && matchesMethod;
    });
  }, [searchQuery, selectedCategory, selectedMethod]);

  const stats = useMemo(() => ({
    total: API_ENDPOINTS.length,
    get: API_ENDPOINTS.filter(e => e.method === 'GET').length,
    post: API_ENDPOINTS.filter(e => e.method === 'POST').length,
    put: API_ENDPOINTS.filter(e => e.method === 'PUT').length,
    delete: API_ENDPOINTS.filter(e => e.method === 'DELETE').length,
    categories: new Set(API_ENDPOINTS.map(e => e.category)).size
  }), []);

  const groupedFiltered = useMemo(() => {
    const groups = {};
    filtered.forEach(ep => {
      if (!groups[ep.category]) groups[ep.category] = [];
      groups[ep.category].push(ep);
    });
    return groups;
  }, [filtered]);

  const svgIcon = (paths, color) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {paths}
    </svg>
  );

  const CATEGORY_META = {
    'Admin Auth': { icon: svgIcon(<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>, '#6366f1'), color: '#6366f1', bg: '#ede9fe' },
    'Admin Courses': { icon: svgIcon(<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>, '#8b5cf6'), color: '#8b5cf6', bg: '#f5f3ff' },
    'Admin Creators': { icon: svgIcon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, '#7c3aed'), color: '#7c3aed', bg: '#ede9fe' },
    'Admin Modules': { icon: svgIcon(<><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>, '#6d28d9'), color: '#6d28d9', bg: '#f5f3ff' },
    'Admin Lessons': { icon: svgIcon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>, '#5b21b6'), color: '#5b21b6', bg: '#ede9fe' },
    'Admin Programs': { icon: svgIcon(<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></>, '#4c1d95'), color: '#4c1d95', bg: '#f5f3ff' },
    'Admin Users': { icon: svgIcon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>, '#2563eb'), color: '#2563eb', bg: '#dbeafe' },
    'Admin Roles': { icon: svgIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>, '#1d4ed8'), color: '#1d4ed8', bg: '#dbeafe' },
    'Admin Permissions': { icon: svgIcon(<><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></>, '#1e40af'), color: '#1e40af', bg: '#dbeafe' },
    'Admin Events': { icon: svgIcon(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="12" cy="15" r="2"/></>, '#6366f1'), color: '#6366f1', bg: '#ede9fe' },
    'Events': { icon: svgIcon(<><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>, '#10b981'), color: '#10b981', bg: '#dcfce7' },
    'User Auth': { icon: svgIcon(<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>, '#059669'), color: '#059669', bg: '#ecfdf5' },
    'Reown': { icon: svgIcon(<><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>, '#0891b2'), color: '#0891b2', bg: '#cffafe' },
    'Assignments': { icon: svgIcon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></>, '#d97706'), color: '#d97706', bg: '#fef3c7' },
    'Batches': { icon: svgIcon(<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>, '#ea580c'), color: '#ea580c', bg: '#fff7ed' },
    'Courses': { icon: svgIcon(<><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>, '#16a34a'), color: '#16a34a', bg: '#dcfce7' },
    'Blog': { icon: svgIcon(<><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></>, '#0d9488'), color: '#0d9488', bg: '#ccfbf1' },
    'Emails': { icon: svgIcon(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, '#e11d48'), color: '#e11d48', bg: '#ffe4e6' },
    'Leaderboard': { icon: svgIcon(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>, '#ca8a04'), color: '#ca8a04', bg: '#fef9c3' },
    'Notifications': { icon: svgIcon(<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>, '#9333ea'), color: '#9333ea', bg: '#f3e8ff' },
    'Referral': { icon: svgIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></>, '#0284c7'), color: '#0284c7', bg: '#e0f2fe' },
    'Rewards': { icon: svgIcon(<><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>, '#c026d3'), color: '#c026d3', bg: '#fae8ff' },
    'Jobs': { icon: svgIcon(<><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>, '#475569'), color: '#475569', bg: '#f1f5f9' },
    'Upload': { icon: svgIcon(<><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>, '#64748b'), color: '#64748b', bg: '#f1f5f9' },
    'Social Tasks': { icon: svgIcon(<><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>, '#f59e0b'), color: '#f59e0b', bg: '#fef3c7' }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedPath(index);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <AdminLayout>
      <div style={{ padding: '32px 36px', width: '100%', background: '#f6f8fb', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>API Reference</h1>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, fontWeight: '450' }}>Complete list of all API endpoints for the development team</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total APIs', value: stats.total, color: '#6366f1', bg: '#ede9fe' },
            { label: 'GET', value: stats.get, color: '#059669', bg: '#ecfdf5' },
            { label: 'POST', value: stats.post, color: '#2563eb', bg: '#eff6ff' },
            { label: 'PUT', value: stats.put, color: '#d97706', bg: '#fef3c7' },
            { label: 'DELETE', value: stats.delete, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Categories', value: stats.categories, color: '#8b5cf6', bg: '#f5f3ff' }
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '14px', padding: '16px 18px',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: s.color, letterSpacing: '-0.5px', marginBottom: '4px' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{
          background: '#fff', borderRadius: '16px', padding: '18px 22px',
          border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 300px', minWidth: '200px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search APIs by path, description, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px',
                border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: '500',
                color: '#0f172a', outline: 'none', background: '#f8fafc',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
              fontSize: '13px', fontWeight: '600', color: '#475569', background: '#f8fafc',
              cursor: 'pointer', outline: 'none', minWidth: '160px'
            }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Method Filter */}
          <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '10px', padding: '3px' }}>
            {methods.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                style={{
                  padding: '7px 14px', borderRadius: '8px', border: 'none',
                  fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                  background: selectedMethod === m ? '#fff' : 'transparent',
                  color: selectedMethod === m ? '#0f172a' : '#94a3b8',
                  boxShadow: selectedMethod === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s'
                }}
              >{m}</button>
            ))}
          </div>

          {/* Count */}
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', marginLeft: 'auto' }}>
            {filtered.length} endpoint{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* API List - Grouped by Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {Object.entries(groupedFiltered).map(([category, endpoints]) => {
            const meta = CATEGORY_META[category] || { icon: svgIcon(<><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>, '#64748b'), color: '#64748b', bg: '#f1f5f9' };
            return (
              <div key={category}>
                {/* Category Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  marginBottom: '12px', padding: '0 4px'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0
                  }}>
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '750', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>{category}</h2>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '100px',
                    background: meta.bg, color: meta.color,
                    fontSize: '11px', fontWeight: '700', flexShrink: 0
                  }}>
                    {endpoints.length} endpoint{endpoints.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Endpoints in this category */}
                <div style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  overflow: 'hidden'
                }}>
                  {endpoints.map((ep, idx) => {
                    const mc = METHOD_COLORS[ep.method] || METHOD_COLORS.GET;
                    const ac = AUTH_COLORS[ep.auth] || AUTH_COLORS['None'];
                    const uniqueKey = `${category}-${ep.method}-${ep.path}`;
                    const isExpanded = expandedIndex === uniqueKey;
                    const globalIndex = API_ENDPOINTS.indexOf(ep);

                    return (
                      <div key={uniqueKey}>
                        {/* Divider between items */}
                        {idx > 0 && <div style={{ height: '1px', background: '#f1f5f9', margin: '0 20px' }} />}

                        {/* Row Header */}
                        <div
                          onClick={() => setExpandedIndex(isExpanded ? null : uniqueKey)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '14px',
                            padding: '13px 20px', cursor: 'pointer',
                            transition: 'background 0.2s',
                            background: isExpanded ? '#fafbfc' : 'transparent'
                          }}
                          onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = '#fafbfc'; }}
                          onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {/* Method Badge */}
                          <span style={{
                            padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '800',
                            background: mc.bg, color: mc.text, border: `1px solid ${mc.border}`,
                            letterSpacing: '0.5px', minWidth: '64px', textAlign: 'center', flexShrink: 0
                          }}>
                            {ep.method}
                          </span>

                          {/* Path */}
                          <code style={{
                            fontSize: '13px', fontWeight: '600', color: '#0f172a',
                            fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                            flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                          }}>
                            {ep.path}
                          </code>

                          {/* Auth Badge */}
                          <span style={{
                            padding: '4px 10px', borderRadius: '100px', fontSize: '10px', fontWeight: '700',
                            background: ac.bg, color: ac.text, flexShrink: 0, letterSpacing: '0.3px'
                          }}>
                            {ep.auth}
                          </span>

                          {/* Copy Button */}
                          <button
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(ep.path, globalIndex); }}
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #e2e8f0',
                              background: copiedPath === globalIndex ? '#ecfdf5' : '#f8fafc',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, transition: 'all 0.2s'
                            }}
                            title="Copy path"
                          >
                            {copiedPath === globalIndex ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            )}
                          </button>

                          {/* Expand Arrow */}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                            style={{ transition: 'transform 0.3s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div style={{
                            padding: '0 20px 16px 20px', borderTop: '1px solid #f1f5f9',
                            background: '#fafbfc', animation: 'fadeIn 0.2s ease'
                          }}>
                            <div style={{ paddingTop: '14px' }}>
                              <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', margin: '0 0 14px 0', fontWeight: '450' }}>
                                {ep.description}
                              </p>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                                {ep.params && (
                                  <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                                    <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Query Params</div>
                                    <code style={{ fontSize: '12px', color: '#0f172a', fontFamily: "'SF Mono', 'Fira Code', monospace", wordBreak: 'break-all' }}>{ep.params}</code>
                                  </div>
                                )}
                                <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Request Body</div>
                                  <code style={{ fontSize: '12px', color: '#0f172a', fontFamily: "'SF Mono', 'Fira Code', monospace", wordBreak: 'break-all' }}>{ep.body}</code>
                                </div>
                                <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>Response</div>
                                  <code style={{ fontSize: '12px', color: '#0f172a', fontFamily: "'SF Mono', 'Fira Code', monospace", wordBreak: 'break-all' }}>{ep.response}</code>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px', background: '#fff',
            borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <div style={{ marginBottom: '12px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>No endpoints found</div>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Try adjusting your search or filters</div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}
