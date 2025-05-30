import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConditionalHeader from '@/components/dashboard/conditional-header'
import { WorkoutOptionCard, WorkoutOptionType } from '@/features/workouts'

export default async function WorkoutsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  return (
    <div className="container py-6 space-y-8">
      <ConditionalHeader user={data.user} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Track Your Workout
        </h1>
        <p className="text-muted-foreground">
          Choose how you want to track your workout today
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WorkoutOptionCard type={WorkoutOptionType.QUICK_START} />
        <WorkoutOptionCard type={WorkoutOptionType.USE_TEMPLATE} />
        <WorkoutOptionCard type={WorkoutOptionType.GENERATE_WORKOUT} />
      </div>
    </div>
  )
}
