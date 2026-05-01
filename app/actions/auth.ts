'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signOut() {
  // Clear auth cookie
  cookies().delete('auth-token')
  redirect('/auth/login')
}
