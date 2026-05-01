import { auth } from './config'
import {
  createDocument,
  getDocument,
  deleteDocument,
  queryDocuments,
  COLLECTIONS,
  where
} from './firestore'
import { cache, cacheKeys } from './cache'

export async function createProject(name: string, description: string) {
  const user = auth.currentUser

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Create user profile if doesn't exist
  const cachedProfile = cache.get(cacheKeys.user(user.uid))
  let existingProfile = cachedProfile

  if (!existingProfile) {
    const { data } = await getDocument(COLLECTIONS.USERS, user.uid)
    existingProfile = data
    if (data) {
      cache.set(cacheKeys.user(user.uid), data, 300000) // 5 min
    }
  }

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

  // Invalidate cache
  cache.invalidate(cacheKeys.projects(user.uid))
  cache.invalidate(cacheKeys.dashboardStats(user.uid))

  const { data: project } = await getDocument(COLLECTIONS.PROJECTS, projectId)
  return { data: project }
}

export async function getProjects() {
  const user = auth.currentUser
  if (!user) return []

  // Check cache first
  const cached = cache.get<any[]>(cacheKeys.projects(user.uid))
  if (cached) return cached

  // Get user's project memberships
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [where('userId', '==', user.uid)]
  )

  if (!memberships || memberships.length === 0) {
    cache.set(cacheKeys.projects(user.uid), [], 30000) // 30 sec
    return []
  }

  const projectIds = memberships.map((m: any) => m.projectId)

  // Batch fetch projects and their stats
  const projectsPromises = projectIds.map(async (id: string) => {
    const cachedProject = cache.get(cacheKeys.project(id))
    if (cachedProject) return cachedProject

    const { data } = await getDocument(COLLECTIONS.PROJECTS, id)
    return data
  })

  const projects = (await Promise.all(projectsPromises)).filter(p => p !== null)

  // Enrich with stats in parallel
  const enrichedProjects = await Promise.all(
    projects.map(async (project: any) => {
      const membership = memberships.find((m: any) => m.projectId === project.id)

      // Use cached stats if available
      const cacheKey = `project-stats:${project.id}`
      const cachedStats = cache.get<any>(cacheKey)

      if (cachedStats) {
        return {
          ...project,
          user_role: (membership as any)?.role || 'member',
          ...cachedStats
        }
      }

      const [tasksResult, membersResult, doneTasksResult] = await Promise.all([
        queryDocuments(COLLECTIONS.TASKS, [where('projectId', '==', project.id)]),
        queryDocuments(COLLECTIONS.PROJECT_MEMBERS, [where('projectId', '==', project.id)]),
        queryDocuments(COLLECTIONS.TASKS, [
          where('projectId', '==', project.id),
          where('status', '==', 'done')
        ])
      ])

      const stats = {
        task_count: tasksResult.data?.length || 0,
        member_count: membersResult.data?.length || 0,
        done_count: doneTasksResult.data?.length || 0
      }

      // Cache stats for 30 seconds
      cache.set(cacheKey, stats, 30000)

      return {
        ...project,
        user_role: (membership as any)?.role || 'member',
        ...stats
      }
    })
  )

  // Cache the full result for 30 seconds
  cache.set(cacheKeys.projects(user.uid), enrichedProjects, 30000)

  return enrichedProjects
}

export async function deleteProject(projectId: string) {
  const user = auth.currentUser
  if (!user) return { error: 'Not authenticated' }

  // Check admin role
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [
      where('projectId', '==', projectId),
      where('userId', '==', user.uid)
    ]
  )

  if (!memberships || memberships.length === 0) {
    return { error: 'Only admins can delete projects' }
  }

  const membership = memberships[0] as any
  if (membership.role !== 'admin') {
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

  // Invalidate all related caches
  cache.invalidate(cacheKeys.projects(user.uid))
  cache.invalidate(cacheKeys.project(projectId))
  cache.invalidate(cacheKeys.tasks(projectId))
  cache.invalidate(cacheKeys.dashboardStats(user.uid))
  cache.invalidatePattern(`project-stats:${projectId}`)

  return { success: true }
}
