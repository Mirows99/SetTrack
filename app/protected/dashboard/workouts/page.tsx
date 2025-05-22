import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConditionalHeader from '@/components/dashboard/conditional-header'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlayCircle, Clipboard, Brain } from 'lucide-react'

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
        <h1 className="text-3xl font-bold tracking-tight">Track Your Workout</h1>
        <p className="text-muted-foreground">
          Choose how you want to track your workout today
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Option 1: Quick Start Workout */}
        <div className="border rounded-lg p-6 flex flex-col h-full justify-between hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PlayCircle className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Quick Start</h2>
            <p className="text-muted-foreground">
              Start tracking a workout right away without any template. Build your workout as you go.
            </p>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/protected/dashboard/workouts/quick-start">Start Empty Workout</Link>
          </Button>
        </div>

        {/* Option 2: Use Template */}
        <div className="border rounded-lg p-6 flex flex-col h-full justify-between hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clipboard className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Use Template</h2>
            <p className="text-muted-foreground">
              Choose from your saved workout templates or create a new one to use for your session.
            </p>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/protected/dashboard/workouts/templates">Use Template</Link>
          </Button>
        </div>

        {/* Option 3: AI Workout Builder */}
        <div className="border rounded-lg p-6 flex flex-col h-full justify-between hover:border-primary/50 transition-colors">
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Generate Workout</h2>
            <p className="text-muted-foreground">
              Let us build a personalized workout for you based on your goals and available equipment.
            </p>
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href="/protected/dashboard/workouts/generate">Generate Workout</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 