'use client'

import { useState } from 'react'
import { CalendarIcon, CheckIcon, PlusIcon } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Mock data for upcoming workouts
const mockUpcomingWorkouts = [
  {
    id: '1',
    name: 'Leg Day',
    date: addDays(new Date(), 1),
    exercises: ['Squats', 'Deadlifts', 'Leg Press'],
    type: 'strength',
    duration: 60,
  },
  {
    id: '2',
    name: 'Upper Body',
    date: addDays(new Date(), 3),
    exercises: ['Bench Press', 'Pull-ups', 'Shoulder Press'],
    type: 'strength',
    duration: 45,
  },
  {
    id: '3',
    name: 'HIIT Session',
    date: addDays(new Date(), 5),
    exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats'],
    type: 'cardio',
    duration: 30,
  },
]

export default function UpcomingWorkouts() {
  const [upcomingWorkouts] = useState(mockUpcomingWorkouts)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Upcoming Workouts</CardTitle>
        <CardDescription>Your planned training sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="flex items-start justify-between border-b pb-4 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{workout.name}</h3>
                  <Badge
                    variant={
                      workout.type === 'strength' ? 'default' : 'secondary'
                    }
                  >
                    {workout.type}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {format(workout.date, 'EEEE, MMM dd')} • {workout.duration}{' '}
                  min
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {workout.exercises.join(', ')}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                  <CheckIcon className="h-3 w-3" />
                  <span className="sr-only">Mark as completed</span>
                </Button>
              </div>
            </div>
          ))}

          {upcomingWorkouts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No upcoming workouts
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Plan your next training session to stay on track
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <PlusIcon className="mr-1 h-4 w-4" />
          Schedule Workout
        </Button>
      </CardFooter>
    </Card>
  )
}
