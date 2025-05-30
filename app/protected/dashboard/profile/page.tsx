import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ConditionalHeader from '@/components/dashboard/conditional-header'
import { ProfileForm } from '@/features/profile'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ExercisePreferences from '@/components/dashboard/exercise-preferences'

export default async function ProfilePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ProfileForm user={data.user} />

          <ExercisePreferences />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Physical Stats</CardTitle>
              <CardDescription>
                Track your body measurements over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Weight
                    </div>
                    <div className="text-2xl font-bold mt-1">75 kg</div>
                    <div className="text-xs text-green-500 mt-1">
                      ↑ 2.5 kg this month
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Body Fat %
                    </div>
                    <div className="text-2xl font-bold mt-1">14%</div>
                    <div className="text-xs text-green-500 mt-1">
                      ↓ 2% this month
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      Muscle Mass
                    </div>
                    <div className="text-2xl font-bold mt-1">62 kg</div>
                    <div className="text-xs text-green-500 mt-1">
                      ↑ 1.5 kg this month
                    </div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-sm font-medium text-muted-foreground">
                      BMI
                    </div>
                    <div className="text-2xl font-bold mt-1">23.1</div>
                    <div className="text-xs text-green-500 mt-1">
                      Within normal range
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fitness Goals</CardTitle>
              <CardDescription>
                Set and track your training objectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Build Muscle</div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary rounded-full h-2 w-[65%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: December 2023
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Improve Endurance</div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary rounded-full h-2 w-[40%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: November 2023
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="font-medium">Increase Flexibility</div>
                    <div className="text-sm text-muted-foreground">
                      Just Started
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary rounded-full h-2 w-[15%]"></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Target: January 2024
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
