import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardHeader from '@/components/dashboard/header'
import WorkoutHistory from '@/components/dashboard/workout-history'
import WorkoutStats from '@/components/dashboard/workout-stats'
import ExerciseLibrary from '@/components/dashboard/exercise-library'
import UpcomingWorkouts from '@/components/dashboard/upcoming-workouts'

export default async function GymDashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="container py-6 space-y-8">
      <DashboardHeader user={data.user} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WorkoutStats />
        <UpcomingWorkouts />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WorkoutHistory />
        </div>
        <div>
          <ExerciseLibrary />
        </div>
      </div>
    </div>
  )
} 