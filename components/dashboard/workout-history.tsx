"use client"

import { useState } from 'react'
import { 
  ArrowRightIcon, 
  CalendarIcon, 
  DumbbellIcon, 
  FlameIcon, 
  TimerIcon 
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// Mock data for workout history
const mockWorkouts = [
  {
    id: '1',
    name: 'Upper Body Strength',
    date: new Date(2023, 7, 15),
    duration: 45,
    calories: 320,
    exercises: ['Bench Press', 'Pull-ups', 'Shoulder Press'],
    type: 'strength'
  },
  {
    id: '2',
    name: 'Leg Day',
    date: new Date(2023, 7, 13),
    duration: 50,
    calories: 400,
    exercises: ['Squats', 'Deadlifts', 'Leg Press'],
    type: 'strength'
  },
  {
    id: '3',
    name: 'Cardio Session',
    date: new Date(2023, 7, 10),
    duration: 30,
    calories: 280,
    exercises: ['Treadmill', 'Cycling', 'Rowing'],
    type: 'cardio'
  },
  {
    id: '4',
    name: 'Full Body Workout',
    date: new Date(2023, 7, 8),
    duration: 60,
    calories: 450,
    exercises: ['Squats', 'Push-ups', 'Rows', 'Lunges'],
    type: 'strength'
  }
]

export default function WorkoutHistory() {
  const [workouts] = useState(mockWorkouts)

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Workouts</CardTitle>
          <CardDescription>View your workout history</CardDescription>
        </div>
        <Link href="/protected/dashboard/workouts">
          <Button variant="outline" size="sm">
            View All
            <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div 
              key={workout.id} 
              className="flex items-start justify-between border-b pb-4 last:border-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <DumbbellIcon className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">{workout.name}</h3>
                  <Badge variant={workout.type === 'strength' ? 'default' : 'secondary'}>
                    {workout.type}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {format(workout.date, 'MMM dd, yyyy')}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {workout.exercises.map((exercise) => (
                    <Badge key={exercise} variant="outline">{exercise}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end text-sm">
                <div className="flex items-center">
                  <TimerIcon className="mr-1 h-3 w-3" />
                  {workout.duration} min
                </div>
                <div className="flex items-center mt-1">
                  <FlameIcon className="mr-1 h-3 w-3 text-orange-500" />
                  {workout.calories} cal
                </div>
                <Button variant="ghost" size="sm" className="mt-2">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          Log New Workout
        </Button>
      </CardFooter>
    </Card>
  )
} 