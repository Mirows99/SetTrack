"use client"

import { User } from '@supabase/supabase-js'
import { useIsMobile } from '@/hooks/use-mobile'
import DashboardHeader from '@/components/dashboard/header'

interface ConditionalHeaderProps {
  user: User
}

export default function ConditionalHeader({ user }: ConditionalHeaderProps) {
  const isMobile = useIsMobile()
  
  if (isMobile) {
    return null
  }
  
  return <DashboardHeader user={user} />
} 