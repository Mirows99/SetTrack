'use client'

import { useSupabase } from '@/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout}>Logout</Button>
}
