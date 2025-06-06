'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  CalendarIcon,
  DumbbellIcon,
  LineChartIcon,
  UserIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'

export interface BottomTabNavigationProps {
  className?: string
}

export default function BottomTabNavigation({
  className,
}: BottomTabNavigationProps) {
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
    <div className={cn('flex items-center justify-around py-2', className)}>
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center px-3 py-2 rounded-md transition-all duration-200',
              isActive
                ? 'text-primary scale-105'
                : 'text-muted-foreground hover:text-foreground active:scale-95'
            )}
          >
            <item.icon
              className={cn(
                'h-5 w-5 mb-1 transition-transform',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-xs font-medium transition-all',
                isActive ? 'font-semibold' : ''
              )}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
