import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/header'
import WorkoutList from '@/components/dashboard/workout-list'
import WorkoutFilters from '@/components/dashboard/workout-filters'
import CreateWorkoutButton from '@/components/dashboard/create-workout-button'

export default async function WorkoutsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="container py-6 space-y-8">
      <DashboardHeader user={data.user} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">
            Manage your workout routines and track your progress
          </p>
        </div>
        <CreateWorkoutButton />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <WorkoutFilters />
        <WorkoutList />
      </div>
    </div>
  )
} 