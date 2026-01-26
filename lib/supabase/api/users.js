import { supabase } from '../client'
import { supabaseAdmin } from '../server'

/**
 * Create or update user profile
 * @param {Object} userData - User data including wallet_address, email, role, etc.
 * @returns {Object} User profile
 */
export async function createOrUpdateUser(userData) {
  try {
    const { wallet_address, email, role, full_name, avatar_url, auth_provider, is_admin, is_master_admin } = userData

    // Check if user exists by wallet address
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', wallet_address)
      .maybeSingle()

    if (existingUser) {
      // Update existing user - include email in case it wasn't captured before
      const { data, error } = await supabase
        .from('users')
        .update({
          email: email || existingUser.email,
          full_name: full_name || existingUser.full_name,
          avatar_url: avatar_url || existingUser.avatar_url,
          role: role || existingUser.role,
          auth_provider: auth_provider || existingUser.auth_provider,
          is_admin: is_admin !== undefined ? is_admin : existingUser.is_admin,
          is_master_admin: is_master_admin !== undefined ? is_master_admin : existingUser.is_master_admin,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      if (error) throw error
      return { user: data, isNewUser: false }
    } else {
      // Create new user
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            wallet_address,
            email,
            role: role || 'student',
            full_name,
            avatar_url,
            auth_provider: auth_provider || 'wallet',
            is_admin: is_admin || false,
            is_master_admin: is_master_admin || false,
            last_login: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) throw error
      return { user: data, isNewUser: true }
    }
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}

/**
 * Get user profile by wallet address
 * @param {string} walletAddress - User's wallet address
 * @returns {Object} User profile
 */
export async function getUserByWallet(walletAddress) {
  try {
    // Convert wallet address to lowercase for case-insensitive comparison
    const normalizedAddress = walletAddress?.toLowerCase();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('wallet_address', normalizedAddress)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error fetching user by wallet:', error)
    throw error
  }
}

/**
 * Get user profile by email
 * @param {string} email - User's email
 * @returns {Object} User profile
 */
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error fetching user by email:', error)
    throw error
  }
}

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Fields to update
 * @returns {Object} Updated user profile
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

/**
 * Get user's enrolled courses
 * @param {string} userId - User ID
 * @returns {Array} List of enrolled courses with progress
 */
export async function getUserEnrollments(userId) {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          slug,
          description,
          image_url,
          instructor_id,
          category,
          level,
          lessons,
          hours,
          rating
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user enrollments:', error)
    throw error
  }
}

/**
 * Enroll user in a course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Object} Enrollment record
 */
export async function enrollUserInCourse(userId, courseId) {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          user_id: userId,
          course_id: courseId,
          status: 'active',
          progress: 0,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error enrolling user in course:', error)
    throw error
  }
}

/**
 * Update course progress
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {number} progress - Progress percentage (0-100)
 * @returns {Object} Updated enrollment
 */
export async function updateCourseProgress(userId, courseId, progress) {
  try {
    const updates = {
      progress,
      last_accessed: new Date().toISOString(),
    }

    // If progress is 100%, mark as completed
    if (progress >= 100) {
      updates.status = 'completed'
      updates.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('enrollments')
      .update(updates)
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating course progress:', error)
    throw error
  }
}

/**
 * Get user's certifications
 * @param {string} userId - User ID
 * @returns {Array} List of certifications
 */
export async function getUserCertifications(userId) {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select(`
        *,
        courses (
          id,
          title,
          slug,
          image_url
        )
      `)
      .eq('user_id', userId)
      .order('issued_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user certifications:', error)
    throw error
  }
}

/**
 * Log user activity
 * @param {string} userId - User ID
 * @param {string} activityType - Type of activity
 * @param {Object} activityData - Additional activity data
 */
export async function logUserActivity(userId, activityType, activityData = {}) {
  try {
    const { error } = await supabase
      .from('activity_log')
      .insert([
        {
          user_id: userId,
          activity_type: activityType,
          activity_data: activityData,
        },
      ])

    if (error) throw error
  } catch (error) {
    console.error('Error logging user activity:', error)
  }
}
