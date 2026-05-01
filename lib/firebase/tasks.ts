import { auth } from './config'
import {
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
  COLLECTIONS,
  where,
  Timestamp
} from './firestore'
import { cache, cacheKeys } from './cache'

export async function createTask(
  projectId: string,
  title: string,
  description: string,
  priority: string,
  dueDate: string | null,
  assignedTo: string | null
) {
  const user = auth.currentUser
  if (!user) return { error: 'Not authenticated' }

  const taskData: any = {
    title,
    description: description || '',
    priority,
    status: 'todo',
    projectId,
    createdBy: user.uid,
    assignedTo: assignedTo || null
  }

  if (dueDate) {
    taskData.dueDate = Timestamp.fromDate(new Date(dueDate))
  }

  const { id: taskId, error } = await createDocument(COLLECTIONS.TASKS, taskData)

  if (error || !taskId) {
    return { error: error || 'Failed to create task' }
  }

  // Invalidate caches
  cache.invalidate(cacheKeys.tasks(projectId))
  cache.invalidate(cacheKeys.dashboardStats(user.uid))
  cache.invalidate(cacheKeys.projects(user.uid))
  cache.invalidatePattern(`project-stats:${projectId}`)

  const { data } = await getDocument(COLLECTIONS.TASKS, taskId)
  return { data }
}

export async function getTasks(projectId: string) {
  const user = auth.currentUser
  if (!user) return []

  // Check cache
  const cached = cache.get<any[]>(cacheKeys.tasks(projectId))
  if (cached) return cached

  const { data: tasks } = await queryDocuments(
    COLLECTIONS.TASKS,
    [where('projectId', '==', projectId)]
  )

  if (!tasks) {
    cache.set(cacheKeys.tasks(projectId), [], 30000)
    return []
  }

  // Batch fetch user profiles
  const userIds = new Set<string>()
  tasks.forEach((t: any) => {
    if (t.assignedTo) userIds.add(t.assignedTo)
    if (t.createdBy) userIds.add(t.createdBy)
  })

  const userProfiles = new Map<string, any>()
  await Promise.all(
    Array.from(userIds).map(async (userId) => {
      const cachedUser = cache.get(cacheKeys.user(userId))
      if (cachedUser) {
        userProfiles.set(userId, cachedUser)
      } else {
        const { data } = await getDocument(COLLECTIONS.USERS, userId)
        if (data) {
          userProfiles.set(userId, data)
          cache.set(cacheKeys.user(userId), data, 300000) // 5 min
        }
      }
    })
  )

  // Enrich tasks with cached user data
  const enrichedTasks = tasks.map((t: any) => ({
    ...t,
    assigned_user: t.assignedTo ? userProfiles.get(t.assignedTo) : null,
    created_user: t.createdBy ? userProfiles.get(t.createdBy) : null
  }))

  // Cache for 30 seconds
  cache.set(cacheKeys.tasks(projectId), enrichedTasks, 30000)

  return enrichedTasks
}

export async function updateTaskStatus(taskId: string, status: string) {
  const user = auth.currentUser
  if (!user) return { error: 'Not authenticated' }

  const { error } = await updateDocument(COLLECTIONS.TASKS, taskId, { status })

  if (error) {
    return { error }
  }

  // Invalidate relevant caches
  cache.invalidatePattern('tasks:')
  cache.invalidate(cacheKeys.dashboardStats(user.uid))
  cache.invalidate(cacheKeys.projects(user.uid))
  cache.invalidatePattern('project-stats:')

  return { success: true }
}

export async function updateTask(
  taskId: string,
  updates: {
    title?: string
    description?: string | null
    priority?: string
    due_date?: string | null
    assigned_to?: string | null
    status?: string
  }
) {
  const user = auth.currentUser
  if (!user) return { error: 'Not authenticated' }

  const updateData: any = {}

  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.priority !== undefined) updateData.priority = updates.priority
  if (updates.status !== undefined) updateData.status = updates.status
  if (updates.assigned_to !== undefined) updateData.assignedTo = updates.assigned_to

  if (updates.due_date !== undefined) {
    updateData.dueDate = updates.due_date
      ? Timestamp.fromDate(new Date(updates.due_date))
      : null
  }

  const { error } = await updateDocument(COLLECTIONS.TASKS, taskId, updateData)

  if (error) {
    return { error }
  }

  // Invalidate caches
  cache.invalidatePattern('tasks:')
  cache.invalidate(cacheKeys.dashboardStats(user.uid))
  cache.invalidate(cacheKeys.projects(user.uid))
  cache.invalidatePattern('project-stats:')

  return { success: true }
}

export async function deleteTask(taskId: string) {
  const user = auth.currentUser
  if (!user) return { error: 'Not authenticated' }

  const { error } = await deleteDocument(COLLECTIONS.TASKS, taskId)

  if (error) {
    return { error }
  }

  // Invalidate caches
  cache.invalidatePattern('tasks:')
  cache.invalidate(cacheKeys.dashboardStats(user.uid))
  cache.invalidate(cacheKeys.projects(user.uid))
  cache.invalidatePattern('project-stats:')

  return { success: true }
}

export async function getDashboardStats() {
  const user = auth.currentUser

  if (!user) {
    return {
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
      overdueTasks: 0,
      totalProjects: 0
    }
  }

  // Check cache
  const cached = cache.get<any>(cacheKeys.dashboardStats(user.uid))
  if (cached) return cached

  // Get user's projects
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [where('userId', '==', user.uid)]
  )

  if (!memberships || memberships.length === 0) {
    const emptyStats = {
      totalTasks: 0,
      todoTasks: 0,
      inProgressTasks: 0,
      doneTasks: 0,
      overdueTasks: 0,
      totalProjects: 0
    }
    cache.set(cacheKeys.dashboardStats(user.uid), emptyStats, 30000)
    return emptyStats
  }

  const projectIds = memberships.map((m: any) => m.projectId)

  // Get all tasks for these projects in parallel
  const tasksPromises = projectIds.map((projectId: string) =>
    queryDocuments(COLLECTIONS.TASKS, [where('projectId', '==', projectId)])
  )

  const tasksResults = await Promise.all(tasksPromises)
  const allTasks = tasksResults.flatMap(result => result.data || [])

  const now = new Date()

  const stats = {
    totalTasks: allTasks.length,
    todoTasks: allTasks.filter((t: any) => t.status === 'todo').length,
    inProgressTasks: allTasks.filter((t: any) => t.status === 'in_progress').length,
    doneTasks: allTasks.filter((t: any) => t.status === 'done').length,
    overdueTasks: allTasks.filter((t: any) => {
      if (!t.dueDate || t.status === 'done') return false
      const dueDate = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate)
      return dueDate < now
    }).length,
    totalProjects: projectIds.length
  }

  // Cache for 30 seconds
  cache.set(cacheKeys.dashboardStats(user.uid), stats, 30000)

  return stats
}
