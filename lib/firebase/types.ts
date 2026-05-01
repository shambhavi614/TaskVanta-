import { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Project {
  id: string
  name: string
  description?: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  role: 'admin' | 'member'
  joinedAt: Timestamp
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  projectId: string
  title: string
  description?: string
  dueDate?: Timestamp
  priority: TaskPriority
  status: TaskStatus
  assignedTo?: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ProjectWithStats extends Project {
  userRole: 'admin' | 'member'
  taskCount: number
  memberCount: number
  doneCount: number
}

export interface TaskWithUsers extends Task {
  assignedUser?: UserProfile
  createdUser?: UserProfile
}
