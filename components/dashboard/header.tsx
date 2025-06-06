'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { User } from '@supabase/supabase-js'
import {
  CalendarIcon,
  DumbbellIcon,
  LineChartIcon,
  UserIcon,
} from 'lucide-react'

import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardHeaderProps {
  user: User
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Dashboard',
      href: '/protected/dashboard',
      icon: LineChartIcon,
    },
    {
      label: 'Workouts',
      href: '/protected/dashboard/workouts',
      icon: DumbbellIcon,
    },
    {
      label: 'Calendar',
      href: '/protected/dashboard/calendar',
      icon: CalendarIcon,
    },
    {
      label: 'Profile',
      href: '/protected/dashboard/profile',
      icon: UserIcon,
    },
  ]

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Gym Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.email}
            </p>
          </div>

          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  size="sm"
                  className="h-8"
                >
                  <item.icon className="h-4 w-4 mr-1" />
                  {item.label}
                </Button>
              </Link>
            ))}
            <LogoutButton />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
