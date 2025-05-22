import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConditionalHeader from '@/components/dashboard/conditional-header'
import CalendarContent from '@/components/dashboard/calendar-content'

export default async function CalendarPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="container py-6 space-y-8">
      <ConditionalHeader user={data.user} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage your workout schedule
          </p>
        </div>
      </div>
      
      <CalendarContent />
    </div>
  )
} 