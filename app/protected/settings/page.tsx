'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  CreditCard,
  User,
  Ruler,
  Bell,
  Timer,
  Palette,
  HelpCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  const settingsItems = [
    {
      title: 'Manage Subscriptions',
      icon: CreditCard,
      onClick: () => console.log('Subscriptions clicked'),
    },
    {
      title: 'Account',
      icon: User,
      onClick: () => console.log('Account clicked'),
    },
    {
      title: 'Unit',
      icon: Ruler,
      onClick: () => console.log('Unit clicked'),
    },
    {
      title: 'Push Messages',
      icon: Bell,
      onClick: () => console.log('Push messages clicked'),
    },
    {
      title: 'Rest Timer',
      icon: Timer,
      onClick: () => console.log('Rest timer clicked'),
    },
    {
      title: 'Theme',
      icon: Palette,
      onClick: () => console.log('Theme clicked'),
    },
    {
      title: 'Help & Feedback',
      icon: HelpCircle,
      onClick: () => console.log('Help clicked'),
    },
  ]

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="space-y-4">
        {settingsItems.map((item, index) => (
          <Card
            key={index}
            className="cursor-pointer transition-colors hover:bg-accent"
            onClick={item.onClick}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{item.title}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
