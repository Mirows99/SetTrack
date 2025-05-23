import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, PlusCircle, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'

// Define muscle groups for tabs
const muscleGroups = [
  {
    id: 'chest',
    name: 'Chest',
  },
  {
    id: 'back',
    name: 'Back',
  },
  {
    id: 'legs',
    name: 'Legs',
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
  },
  {
    id: 'arms',
    name: 'Arms',
  },
  {
    id: 'core',
    name: 'Core',
  },
]

export default async function QuickStartPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  // Fetch exercises from Supabase
  const { data: exercises, error: exercisesError } = await supabase
    .from('excercise')
    .select('*')
  
  if (exercisesError) {
    console.error('Error fetching exercises:', exercisesError)
  }

  // Group exercises by primary_bodypart
  const exercisesByBodyPart = muscleGroups.reduce((acc, group) => {
    acc[group.id] = exercises?.filter(ex => ex.primary_bodypart?.toLowerCase() === group.id) || []
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quick Start Workout</h1>
        <p className="text-muted-foreground">
          Select exercises to include in your workout
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search exercises..." 
            className="w-full sm:w-[300px] pl-10"
          />
        </div>

        <div className="flex gap-2 justify-between">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Exercise
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chest" className="w-full">
        <TabsList className="grid grid-cols-6 mb-4">
          {muscleGroups.map((group) => (
            <TabsTrigger key={group.id} value={group.id}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {muscleGroups.map((group) => (
          <TabsContent key={group.id} value={group.id} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {exercisesByBodyPart[group.id]?.length > 0 ? (
                exercisesByBodyPart[group.id].map((exercise) => (
                  <Card key={exercise.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{exercise.name}</CardTitle>
                      <CardDescription>{exercise.level}</CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button variant="secondary" size="sm" className="w-full" asChild>
                        <Link href={`/protected/dashboard/workouts/exercise/${exercise.id}`}>
                          Record set
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">No exercises found for {group.name}</p>
                  <Button className="mt-4" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add {group.name} Exercise
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 