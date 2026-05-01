'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback, memo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/firebase/AuthContext'
import {
  getDocument,
  queryDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  COLLECTIONS,
  where,
  Timestamp
} from '@/lib/firebase/firestore'
import { createTask, updateTaskStatus, deleteTask } from '@/lib/firebase/tasks'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: any
  assignedTo: string | null
  createdBy: string
  createdAt: any
  assigned_user?: { id: string; fullName?: string | null; email: string } | null
}

type Member = {
  id: string
  role: string
  userId: string
  profiles?: { id: string; fullName?: string | null; email: string; avatarUrl: string | null }
}

type Project = {
  id: string
  name: string
  description: string | null
  createdBy: string
}

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'var(--accent-red)',
  high: 'var(--accent-orange)',
  medium: 'var(--accent-blue)',
  low: 'var(--text-muted)',
}

function getDisplayName(fullName: string | null | undefined, email: string) {
  return fullName || email.split('@')[0] || 'User'
}

// Memoized task card component
const TaskCard = memo(({ 
  task, 
  userRole, 
  onStatusChange, 
  onDelete 
}: { 
  task: Task; 
  userRole: string; 
  onStatusChange: (taskId: string, status: string) => void;
  onDelete: (taskId: string) => void;
}) => {
  const dueDate = task.dueDate?.toDate ? task.dueDate.toDate() : null
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done'

  return (
    <div style={{
      background: 'var(--bg-card)', 
      border: '2px solid var(--border-subtle)',
      borderRadius: 10, 
      padding: 16,
      borderLeft: `4px solid ${PRIORITY_COLORS[task.priority] || 'var(--border-subtle)'}`,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 14, fontWeight: 600,
              textDecoration: task.status === 'done' ? 'line-through' : 'none',
              color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)',
            }}>
              {task.title}
            </span>
            {isOverdue && (
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                background: 'rgba(248,113,113,0.15)', color: 'var(--accent-red)',
              }}>
                OVERDUE
              </span>
            )}
          </div>
          {task.description && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.5 }}>
              {task.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 11 }}>
            <span style={{
              padding: '2px 8px', borderRadius: 4, fontWeight: 600, textTransform: 'capitalize',
              background: `color-mix(in srgb, ${PRIORITY_COLORS[task.priority]} 15%, transparent)`,
              color: PRIORITY_COLORS[task.priority],
            }}>
              {task.priority}
            </span>
            {dueDate && (
              <span style={{ color: isOverdue ? 'var(--accent-red)' : 'var(--text-muted)' }}>
                📅 {dueDate.toLocaleDateString()}
              </span>
            )}
            {task.assigned_user && (
              <span style={{ color: 'var(--text-muted)' }}>
                → {getDisplayName(task.assigned_user.fullName, task.assigned_user.email)}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            style={{
              padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500,
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              color: task.status === 'done' ? 'var(--accent-green)' : task.status === 'in_progress' ? 'var(--accent-orange)' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {userRole === 'admin' && (
            <button
              onClick={() => onDelete(task.id)}
              style={{
                padding: '4px 8px', borderRadius: 6, fontSize: 11,
                background: 'none', border: '1px solid var(--border-subtle)',
                color: 'var(--accent-red)', cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

TaskCard.displayName = 'TaskCard'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const { user } = useAuth()

  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [userRole, setUserRole] = useState<string>('member')
  const [loading, setLoading] = useState(true)
  const [showNewTask, setShowNewTask] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', due_date: '', assigned_to: '',
  })
  const [memberEmail, setMemberEmail] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const loadProject = useCallback(async () => {
    if (!user) { router.push('/auth/login'); return }

    // Check membership
    const { data: memberships } = await queryDocuments(
      COLLECTIONS.PROJECT_MEMBERS,
      [where('projectId', '==', projectId), where('userId', '==', user.uid)]
    )

    if (!memberships || memberships.length === 0) {
      router.push('/dashboard/projects')
      return
    }

    setUserRole(memberships[0].role)

    // Load project
    const { data: proj } = await getDocument(COLLECTIONS.PROJECTS, projectId)
    setProject(proj as Project)

    // Load members
    const { data: mems } = await queryDocuments(
      COLLECTIONS.PROJECT_MEMBERS,
      [where('projectId', '==', projectId)]
    )

    const membersWithProfiles = await Promise.all(
      (mems || []).map(async (m: any) => {
        const { data: profile } = await getDocument(COLLECTIONS.USERS, m.userId)
        return { ...m, profiles: profile }
      })
    )
    setMembers(membersWithProfiles)

    // Load tasks
    const { data: ts } = await queryDocuments(
      COLLECTIONS.TASKS,
      [where('projectId', '==', projectId)]
    )

    const tasksWithUsers = await Promise.all(
      (ts || []).map(async (t: any) => {
        const assignedUser = t.assignedTo
          ? (await getDocument(COLLECTIONS.USERS, t.assignedTo)).data
          : null
        return { ...t, assigned_user: assignedUser }
      })
    )
    setTasks(tasksWithUsers)

    setLoading(false)
  }, [projectId, user, router])

  useEffect(() => { if (user) loadProject() }, [user, loadProject])

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!taskForm.title.trim() || !user) return
    setActionLoading(true)
    setActionError('')

    const { error } = await createTask(
      projectId,
      taskForm.title.trim(),
      taskForm.description.trim(),
      taskForm.priority,
      taskForm.due_date || null,
      taskForm.assigned_to || null
    )

    if (error) {
      setActionError(error)
      setActionLoading(false)
      return
    }

    setTaskForm({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' })
    setShowNewTask(false)
    setActionLoading(false)
    loadProject()
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTaskStatus(taskId, newStatus)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return
    await deleteTask(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const handleAddMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError('')

    const { data: users } = await queryDocuments(
      COLLECTIONS.USERS,
      [where('email', '==', memberEmail.trim())]
    )

    if (!users || users.length === 0) {
      setActionError('No user found with that email')
      setActionLoading(false)
      return
    }

    const targetUser = users[0]

    // Check if already a member
    const { data: existing } = await queryDocuments(
      COLLECTIONS.PROJECT_MEMBERS,
      [where('projectId', '==', projectId), where('userId', '==', targetUser.id)]
    )

    if (existing && existing.length > 0) {
      setActionError('User is already a member')
      setActionLoading(false)
      return
    }

    const { error } = await createDocument(COLLECTIONS.PROJECT_MEMBERS, {
      projectId,
      userId: targetUser.id,
      role: 'member'
    })

    if (error) {
      setActionError(error)
      setActionLoading(false)
      return
    }

    setMemberEmail('')
    setShowAddMember(false)
    setActionLoading(false)
    loadProject()
  }

  const handleRemoveMember = async (membershipId: string) => {
    if (!confirm('Remove this member?')) return
    await deleteDocument(COLLECTIONS.PROJECT_MEMBERS, membershipId)
    loadProject()
  }

  const filteredTasks = statusFilter === 'all' ? tasks : tasks.filter(t => t.status === statusFilter)

  const todoCount = tasks.filter(t => t.status === 'todo').length
  const progressCount = tasks.filter(t => t.status === 'in_progress').length
  const doneCount = tasks.filter(t => t.status === 'done').length

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ width: 120, height: 14, borderRadius: 4, background: 'var(--bg-card)', marginBottom: 20 }} />
        <div style={{ width: 240, height: 24, borderRadius: 6, background: 'var(--bg-card)', marginBottom: 32 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 100, borderRadius: 10, background: 'var(--bg-card)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div>
      <Link href="/dashboard/projects" style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none', marginBottom: 20,
      }}>
        ← Back to Projects
      </Link>

      <div style={{
        background: 'var(--bg-card)', 
        border: '2px solid var(--border-subtle)',
        borderRadius: 12, 
        padding: 24, 
        marginBottom: 20,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{project.name}</h1>
            {project.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{project.description}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {userRole === 'admin' && (
              <button
                onClick={() => { setShowAddMember(true); setActionError('') }}
                style={{
                  padding: '10px 18px', 
                  borderRadius: 8, 
                  fontSize: 13, 
                  fontWeight: 500,
                  color: 'var(--accent-blue)', 
                  background: 'rgba(96,165,250,0.1)',
                  border: '2px solid rgba(96,165,250,0.3)', 
                  cursor: 'pointer',
                }}
              >
                + Add Member
              </button>
            )}
            <button
              onClick={() => { setShowNewTask(true); setActionError('') }}
              style={{
                padding: '10px 20px', 
                borderRadius: 8, 
                fontSize: 13, 
                fontWeight: 600,
                color: '#000', 
                background: 'var(--accent-green)',
                border: '2px solid var(--accent-green)', 
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              }}
            >
              + New Task
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{tasks.length} tasks</span>
          <span style={{ color: 'var(--border-hover)' }}>·</span>
          <span style={{ color: 'var(--accent-green)' }}>{doneCount} done</span>
          <span style={{ color: 'var(--accent-orange)' }}>{progressCount} in progress</span>
          <span>{todoCount} to do</span>
          <span style={{ color: 'var(--border-hover)' }}>·</span>
          <span>{members.length} members</span>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setShowNewTask(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{
            position: 'relative', 
            background: 'var(--bg-card)', 
            border: '2px solid var(--border-subtle)',
            borderRadius: 14, 
            padding: 28, 
            width: '100%', 
            maxWidth: 480, 
            zIndex: 1,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Create Task</h2>
            {actionError && (
              <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 16, background: 'rgba(248,113,113,0.1)', color: 'var(--accent-red)', fontSize: 13 }}>
                {actionError}
              </div>
            )}
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Title *</label>
                <input required value={taskForm.title} onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: '2px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Description</label>
                <textarea rows={3} value={taskForm.description} onChange={e => setTaskForm(f => ({ ...f, description: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: '2px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 14, resize: 'vertical', fontFamily: 'inherit', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Priority</label>
                  <select value={taskForm.priority} onChange={e => setTaskForm(f => ({ ...f, priority: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: '2px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Due Date</label>
                  <input type="date" value={taskForm.due_date} onChange={e => setTaskForm(f => ({ ...f, due_date: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: '2px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Assign To</label>
                <select value={taskForm.assigned_to} onChange={e => setTaskForm(f => ({ ...f, assigned_to: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: '2px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }}>
                  <option value="">Unassigned</option>
                  {members.map((m: any) => (
                    <option key={m.userId} value={m.userId}>
                      {getDisplayName(m.profiles?.fullName, m.profiles?.email || '')} ({m.profiles?.email})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowNewTask(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading}
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#000', background: 'var(--accent-green)', border: 'none', cursor: 'pointer', opacity: actionLoading ? 0.6 : 1 }}>
                  {actionLoading ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={() => setShowAddMember(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <div style={{
            position: 'relative', 
            background: 'var(--bg-card)', 
            border: '2px solid var(--border-subtle)',
            borderRadius: 14, 
            padding: 28, 
            width: '100%', 
            maxWidth: 400, 
            zIndex: 1,
            boxShadow: 'var(--shadow-lg)',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add Team Member</h2>
            {actionError && (
              <div style={{ padding: '8px 12px', borderRadius: 8, marginBottom: 16, background: 'rgba(248,113,113,0.1)', color: 'var(--accent-red)', fontSize: 13 }}>
                {actionError}
              </div>
            )}
            <form onSubmit={handleAddMember}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>Email Address</label>
                <input type="email" required value={memberEmail} onChange={e => setMemberEmail(e.target.value)} placeholder="colleague@example.com"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)', border: '2px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddMember(false)}
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)', background: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading}
                  style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#000', background: 'var(--accent-green)', border: 'none', cursor: 'pointer', opacity: actionLoading ? 0.6 : 1 }}>
                  {actionLoading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 16 }} className="project-detail-grid">
        {/* Tasks */}
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {[
              { key: 'all', label: `All (${tasks.length})` },
              { key: 'todo', label: `To Do (${todoCount})` },
              { key: 'in_progress', label: `In Progress (${progressCount})` },
              { key: 'done', label: `Done (${doneCount})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500,
                  border: 'none', cursor: 'pointer',
                  color: statusFilter === tab.key ? 'var(--accent-green)' : 'var(--text-muted)',
                  background: statusFilter === tab.key ? 'rgba(52,211,153,0.1)' : 'transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredTasks.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              background: 'var(--bg-card)', 
              border: '2px solid var(--border-subtle)',
              borderRadius: 12, 
              color: 'var(--text-muted)', 
              fontSize: 14,
            }}>
              {tasks.length === 0 ? 'No tasks yet. Create one to get started!' : 'No tasks match this filter.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  userRole={userRole}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>

        {/* Members Sidebar */}
        <div style={{
          background: 'var(--bg-card)', 
          border: '2px solid var(--border-subtle)',
          borderRadius: 12, 
          padding: 16, 
          height: 'fit-content',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            Team ({members.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {members.map((m: any) => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                  background: m.role === 'admin'
                    ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))'
                    : 'linear-gradient(135deg, var(--accent-blue), var(--accent-cyan))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: '#000',
                }}>
                  {getDisplayName(m.profiles?.fullName, m.profiles?.email || '').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getDisplayName(m.profiles?.fullName, m.profiles?.email || '')}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.role}</div>
                </div>
                {userRole === 'admin' && m.userId !== project.createdBy && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    style={{
                      padding: '2px 6px', borderRadius: 4, fontSize: 10,
                      background: 'none', border: 'none', color: 'var(--accent-red)',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
