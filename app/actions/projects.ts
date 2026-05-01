'use server'

import { revalidatePath } from 'next/cache'
import { 
  createDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  COLLECTIONS,
  where,
  orderBy
} from '@/lib/firebase/firestore'
import { getCurrentUser } from '@/lib/firebase/auth'

export async function createProject(name: string, description: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Create user profile if doesn't exist
  const { data: existingProfile } = await getDocument(COLLECTIONS.USERS, user.uid)
  if (!existingProfile) {
    await createDocument(COLLECTIONS.USERS, {
      email: user.email || '',
      fullName: user.displayName || 'User',
      avatarUrl: user.photoURL || null
    }, user.uid)
  }

  // Create project
  const { id: projectId, error: projectError } = await createDocument(COLLECTIONS.PROJECTS, {
    name,
    description: description || '',
    createdBy: user.uid
  })

  if (projectError || !projectId) {
    return { error: projectError || 'Failed to create project' }
  }

  // Add creator as admin member
  const { error: memberError } = await createDocument(COLLECTIONS.PROJECT_MEMBERS, {
    projectId,
    userId: user.uid,
    role: 'admin'
  })

  if (memberError) {
    // Rollback: delete the project
    await deleteDocument(COLLECTIONS.PROJECTS, projectId)
    return { error: memberError }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  
  const { data: project } = await getDocument(COLLECTIONS.PROJECTS, projectId)
  return { data: project }
}

export async function getProjects() {
  const user = await getCurrentUser()
  if (!user) return []

  // Get user's project memberships
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [where('userId', '==', user.uid)]
  )

  if (!memberships || memberships.length === 0) return []

  const projectIds = memberships.map((m: any) => m.projectId)

  // Get all projects (Firebase doesn't support 'in' with more than 10 items, so we'll fetch individually)
  const projectsPromises = projectIds.map((id: string) => getDocument(COLLECTIONS.PROJECTS, id))
  const projectsResults = await Promise.all(projectsPromises)
  
  const projects = projectsResults
    .filter(result => result.data !== null)
    .map(result => result.data)

  // Enrich with stats
  const enrichedProjects = await Promise.all(
    projects.map(async (project: any) => {
      const membership = memberships.find((m: any) => m.projectId === project.id)
      
      const [tasksResult, membersResult, doneTasksResult] = await Promise.all([
        queryDocuments(COLLECTIONS.TASKS, [where('projectId', '==', project.id)]),
        queryDocuments(COLLECTIONS.PROJECT_MEMBERS, [where('projectId', '==', project.id)]),
        queryDocuments(COLLECTIONS.TASKS, [
          where('projectId', '==', project.id),
          where('status', '==', 'done')
        ])
      ])

      return {
        ...project,
        user_role: membership?.role || 'member',
        task_count: tasksResult.data?.length || 0,
        member_count: membersResult.data?.length || 0,
        done_count: doneTasksResult.data?.length || 0
      }
    })
  )

  return enrichedProjects
}

export async function getProject(id: string) {
  const user = await getCurrentUser()
  if (!user) return null

  // Check membership
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', id),
      where('userId', '==', user.uid)
    ]
  )

  if (!memberships || memberships.length === 0) return null

  const membership = memberships[0]

  // Get project
  const { data: project } = await getDocument(COLLECTIONS.PROJECTS, id)
  if (!project) return null

  // Get members with profiles
  const { data: projectMembers } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [where('projectId', '==', id)]
  )

  const membersWithProfiles = await Promise.all(
    (projectMembers || []).map(async (member: any) => {
      const { data: profile } = await getDocument(COLLECTIONS.USERS, member.userId)
      return {
        ...member,
        profiles: profile
      }
    })
  )

  return {
    ...project,
    project_members: membersWithProfiles,
    user_role: membership.role
  }
}

export async function addProjectMember(projectId: string, email: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  // Check admin role
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', projectId),
      where('userId', '==', user.uid)
    ]
  )

  if (!memberships || memberships.length === 0 || memberships[0].role !== 'admin') {
    return { error: 'Only admins can add members' }
  }

  // Find user by email
  const { data: users } = await queryDocuments(
    COLLECTIONS.USERS,
    [where('email', '==', email)]
  )

  if (!users || users.length === 0) {
    return { error: 'User not found with that email' }
  }

  const targetUser = users[0]

  // Check if already a member
  const { data: existingMembership } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', projectId),
      where('userId', '==', targetUser.id)
    ]
  )

  if (existingMembership && existingMembership.length > 0) {
    return { error: 'User is already a member' }
  }

  // Add to project
  const { error } = await createDocument(COLLECTIONS.PROJECT_MEMBERS, {
    projectId,
    userId: targetUser.id,
    role: 'member'
  })

  if (error) return { error }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function removeProjectMember(projectId: string, userId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  // Check admin role
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', projectId),
      where('userId', '==', user.uid)
    ]
  )

  if (!memberships || memberships.length === 0 || memberships[0].role !== 'admin') {
    return { error: 'Only admins can remove members' }
  }

  // Don't allow removing the creator
  const { data: project } = await getDocument(COLLECTIONS.PROJECTS, projectId)
  if (project?.createdBy === userId) {
    return { error: 'Cannot remove the project creator' }
  }

  // Find and delete membership
  const { data: targetMemberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', projectId),
      where('userId', '==', userId)
    ]
  )

  if (!targetMemberships || targetMemberships.length === 0) {
    return { error: 'Membership not found' }
  }

  const { error } = await deleteDocument(COLLECTIONS.PROJECT_MEMBERS, targetMemberships[0].id)
  if (error) return { error }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function deleteProject(projectId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  // Check admin role
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', projectId),
      where('userId', '==', user.uid)
    ]
  )

  if (!memberships || memberships.length === 0 || memberships[0].role !== 'admin') {
    return { error: 'Only admins can delete projects' }
  }

  // Delete all tasks
  const { data: tasks } = await queryDocuments(
    COLLECTIONS.TASKS,
    [where('projectId', '==', projectId)]
  )
  
  if (tasks) {
    await Promise.all(tasks.map((task: any) => deleteDocument(COLLECTIONS.TASKS, task.id)))
  }

  // Delete all memberships
  const { data: allMemberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [where('projectId', '==', projectId)]
  )
  
  if (allMemberships) {
    await Promise.all(allMemberships.map((m: any) => deleteDocument(COLLECTIONS.PROJECT_MEMBERS, m.id)))
  }

  // Delete project
  const { error } = await deleteDocument(COLLECTIONS.PROJECTS, projectId)
  if (error) return { error }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/projects')
  return { success: true }
}
