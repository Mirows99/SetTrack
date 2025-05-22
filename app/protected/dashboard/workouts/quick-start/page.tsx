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

// Mock data for exercises, in a real app this would come from the database
const muscleGroups = [
  {
    id: 'chest',
    name: 'Chest',
    exercises: [
      { id: '1', name: 'Bench Press', difficulty: 'Intermediate' },
      { id: '2', name: 'Push-ups', difficulty: 'Beginner' },
      { id: '3', name: 'Incline Dumbbell Press', difficulty: 'Intermediate' },
      { id: '4', name: 'Cable Fly', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'back',
    name: 'Back',
    exercises: [
      { id: '5', name: 'Pull-ups', difficulty: 'Intermediate' },
      { id: '6', name: 'Bent Over Rows', difficulty: 'Intermediate' },
      { id: '7', name: 'Lat Pulldown', difficulty: 'Beginner' },
      { id: '8', name: 'Deadlift', difficulty: 'Advanced' },
    ],
  },
  {
    id: 'legs',
    name: 'Legs',
    exercises: [
      { id: '9', name: 'Squats', difficulty: 'Intermediate' },
      { id: '10', name: 'Leg Press', difficulty: 'Beginner' },
      { id: '11', name: 'Lunges', difficulty: 'Beginner' },
      { id: '12', name: 'Leg Extensions', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'shoulders',
    name: 'Shoulders',
    exercises: [
      { id: '13', name: 'Overhead Press', difficulty: 'Intermediate' },
      { id: '14', name: 'Lateral Raises', difficulty: 'Beginner' },
      { id: '15', name: 'Face Pulls', difficulty: 'Intermediate' },
      { id: '16', name: 'Shrugs', difficulty: 'Beginner' },
    ],
  },
  {
    id: 'arms',
    name: 'Arms',
    exercises: [
      { id: '17', name: 'Bicep Curls', difficulty: 'Beginner' },
      { id: '18', name: 'Tricep Pushdowns', difficulty: 'Beginner' },
      { id: '19', name: 'Hammer Curls', difficulty: 'Beginner' },
      { id: '20', name: 'Skull Crushers', difficulty: 'Intermediate' },
    ],
  },
  {
    id: 'core',
    name: 'Core',
    exercises: [
      { id: '21', name: 'Crunches', difficulty: 'Beginner' },
      { id: '22', name: 'Plank', difficulty: 'Beginner' },
      { id: '23', name: 'Russian Twists', difficulty: 'Intermediate' },
      { id: '24', name: 'Leg Raises', difficulty: 'Intermediate' },
    ],
  },
]

export default async function QuickStartPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

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
              {group.exercises.map((exercise) => (
                <Card key={exercise.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <CardDescription>{exercise.difficulty}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button variant="secondary" size="sm" className="w-full" asChild>
                      <Link href={`/protected/dashboard/workouts/exercise/${exercise.id}`}>
                        Record set
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 