'use client'

import { User } from '@supabase/supabase-js'

import { useIsMobile } from '@/hooks/use-mobile'

import DashboardHeader from './header'
import MobileHeader from './mobile-header'

interface ConditionalHeaderProps {
  user: User
}

export default function ConditionalHeader({ user }: ConditionalHeaderProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <MobileHeader user={user} />
  }

  return <DashboardHeader user={user} />
}
