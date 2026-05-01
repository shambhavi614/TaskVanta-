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
  orderBy,
  Timestamp
} from '@/lib/firebase/firestore'
import { getCurrentUser } from '@/lib/firebase/auth'

export async function createTask(
  projectId: string,
  title: string,
  description: string,
  priority: string,
  dueDate: string | null,
  assignedTo: string | null
) {
  const user = await getCurrentUser()
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

  revalidatePath(`/dashboard/projects/${projectId}`)
  
  const { data } = await getDocument(COLLECTIONS.TASKS, taskId)
  return { data }
}

export async function getTasks(projectId: string) {
  const user = await getCurrentUser()
  if (!user) return []

  const { data: tasks } = await queryDocuments(
    COLLECTIONS.TASKS,
    [where('projectId', '==', projectId)]
  )

  if (!tasks) return []

  // Enrich with user profiles
  const enrichedTasks = await Promise.all(
    tasks.map(async (task: any) => {
      const assignedUser = task.assignedTo 
        ? (await getDocument(COLLECTIONS.USERS, task.assignedTo)).data 
        : null
      
      const createdUser = task.createdBy
        ? (await getDocument(COLLECTIONS.USERS, task.createdBy)).data
        : null

      return {
        ...task,
        assigned_user: assignedUser,
        created_user: createdUser
      }
    })
  )

  return enrichedTasks
}

export async function updateTaskStatus(taskId: string, status: string, projectId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await updateDocument(COLLECTIONS.TASKS, taskId, { status })

  if (error) {
    return { error }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function updateTask(
  taskId: string,
  projectId: string,
  updates: {
    title?: string
    description?: string | null
    priority?: string
    due_date?: string | null
    assigned_to?: string | null
    status?: string
  }
) {
  const user = await getCurrentUser()
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

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function deleteTask(taskId: string, projectId: string) {
  const user = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await deleteDocument(COLLECTIONS.TASKS, taskId)

  if (error) {
    return { error }
  }

  revalidatePath(`/dashboard/projects/${projectId}`)
  return { success: true }
}

export async function getDashboardStats() {
  const user = await getCurrentUser()
  
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

  // Get user's projects
  const { data: memberships } = await queryDocuments(
    COLLECTIONS.PROJECT_MEMBERS,
    [where('userId', '==', user.uid)]
  )

  if (!memberships || memberships.length === 0) {
    return { 
      totalTasks: 0, 
      todoTasks: 0, 
      inProgressTasks: 0, 
      doneTasks: 0, 
      overdueTasks: 0, 
      totalProjects: 0 
    }
  }

  const projectIds = memberships.map((m: any) => m.projectId)

  // Get all tasks for these projects
  const tasksPromises = projectIds.map((projectId: string) =>
    queryDocuments(COLLECTIONS.TASKS, [where('projectId', '==', projectId)])
  )

  const tasksResults = await Promise.all(tasksPromises)
  const allTasks = tasksResults.flatMap(result => result.data || [])

  const now = new Date()

  return {
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
}
