'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useSupabase } from '@/providers/supabase-provider'

export function LogoutButton() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout}>Logout</Button>
}
