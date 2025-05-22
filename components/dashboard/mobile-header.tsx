"use client"

import { User } from '@supabase/supabase-js'
import { LogOutIcon, SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface MobileHeaderProps {
  user: User
}

export default function MobileHeader({ user }: MobileHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <Card className="fixed top-0 left-0 right-0 z-50 border-b rounded-none shadow-none h-16">
      <CardContent className="py-0.5 px-1 h-full">
        <div className="flex items-center justify-between h-full">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOutIcon className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          <p className="text-sm text-muted-foreground">
            {/* Welcome back, {user.name?} */}
            Welcome back, Elias
          </p>
          <Button variant="ghost" size="icon" onClick={() => router.push('/protected/settings')}>
            <SettingsIcon className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 