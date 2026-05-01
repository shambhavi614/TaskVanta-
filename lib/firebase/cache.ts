// Simple in-memory cache with TTL
type CacheEntry<T> = {
  data: T
  timestamp: number
  ttl: number
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) return null
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    
    if (isExpired) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern)
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  clear(): void {
    this.cache.clear()
  }
}

export const cache = new Cache()

// Cache key generators
export const cacheKeys = {
  projects: (userId: string) => `projects:${userId}`,
  project: (projectId: string) => `project:${projectId}`,
  tasks: (projectId: string) => `tasks:${projectId}`,
  dashboardStats: (userId: string) => `dashboard:${userId}`,
  projectMembers: (projectId: string) => `members:${projectId}`,
  user: (userId: string) => `user:${userId}`,
}
