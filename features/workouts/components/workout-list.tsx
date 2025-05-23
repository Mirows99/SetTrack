"use client"

import { useState } from 'react'
import { 
  CalendarIcon, 
  ChevronDownIcon,
  ClockIcon, 
  FlameIcon, 
  MoreHorizontalIcon, 
  PencilIcon, 
  TrashIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock workout data - typically would come from Supabase
const workoutData = [
  {
    id: '1',
    name: 'Upper Body Strength',
    date: new Date(2023, 7, 15),
    duration: 45,
    calories: 320,
    exercises: ['Bench Press', 'Pull-ups', 'Shoulder Press'],
    type: 'strength',
    notes: 'Increased weight on bench press by 5kg'
  },
  {
    id: '2',
    name: 'Leg Day',
    date: new Date(2023, 7, 13),
    duration: 50,
    calories: 400,
    exercises: ['Squats', 'Deadlifts', 'Leg Press'],
    type: 'strength',
    notes: 'Focus on proper form for deadlifts'
  },
  {
    id: '3',
    name: 'Cardio Session',
    date: new Date(2023, 7, 10),
    duration: 30,
    calories: 280,
    exercises: ['Treadmill', 'Cycling', 'Rowing'],
    type: 'cardio',
    notes: 'Increased pace during intervals'
  },
  {
    id: '4',
    name: 'Full Body Workout',
    date: new Date(2023, 7, 8),
    duration: 60,
    calories: 450,
    exercises: ['Squats', 'Push-ups', 'Rows', 'Lunges'],
    type: 'strength',
    notes: 'Felt stronger overall'
  },
  {
    id: '5',
    name: 'HIIT Training',
    date: new Date(2023, 7, 5),
    duration: 25,
    calories: 300,
    exercises: ['Burpees', 'Mountain Climbers', 'Jumping Jacks'],
    type: 'cardio',
    notes: 'Intense session, improved recovery time'
  },
  {
    id: '6',
    name: 'Recovery Yoga',
    date: new Date(2023, 7, 3),
    duration: 40,
    calories: 150,
    exercises: ['Downward Dog', 'Warrior Pose', 'Child\'s Pose'],
    type: 'flexibility',
    notes: 'Focused on hip mobility'
  }
]

export default function WorkoutList() {
  const [workouts] = useState(workoutData)

  const handleEdit = (id: string) => {
    console.log(`Edit workout with id: ${id}`)
    // Navigate to edit page or open modal
  }

  const handleDelete = (id: string) => {
    console.log(`Delete workout with id: ${id}`)
    // Confirmation dialog and delete
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id} className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{workout.name}</h3>
                <Badge variant={
                  workout.type === 'strength' ? 'default' : 
                  workout.type === 'cardio' ? 'secondary' : 'outline'
                }>
                  {workout.type}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {format(workout.date, 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  {workout.duration} min
                </div>
                <div className="flex items-center">
                  <FlameIcon className="mr-1 h-3 w-3" />
                  {workout.calories} cal
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium">Exercises:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {workout.exercises.map((exercise) => (
                    <Badge key={exercise} variant="outline">{exercise}</Badge>
                  ))}
                </div>
              </div>
              
              {workout.notes && (
                <div className="pt-2">
                  <p className="text-sm font-medium">Notes:</p>
                  <p className="text-sm text-muted-foreground">{workout.notes}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleEdit(workout.id)}
                className="mr-2"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="ml-1 hidden md:inline">Edit</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(workout.id)}>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(workout.id)}
                    className="text-red-600"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
      
      {workouts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No workouts found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first workout to get started
          </p>
        </div>
      )}
    </div>
  )
} 