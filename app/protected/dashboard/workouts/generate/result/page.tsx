'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  ArrowLeft,
  Play,
  Edit3,
  Trash2,
  Save,
  X,
  Clock,
  Target,
  Zap,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Mock workout data
interface WorkoutExercise {
  id: string
  name: string
  sets: number
  reps: number | string
  weight: number | null
  restTime: number // in seconds
  category: string
  primaryBodypart: string
  notes?: string
}

interface WorkoutPlan {
  id: string
  name: string
  duration: string
  bodyParts: string[]
  location: string
  intensity: string
  exercises: WorkoutExercise[]
  estimatedTime: number // in minutes
}

// Mock data generator
const generateMockWorkout = (): WorkoutPlan => {
  const mockExercises: WorkoutExercise[] = [
    {
      id: '1',
      name: 'Push-ups',
      sets: 3,
      reps: 12,
      weight: null,
      restTime: 60,
      category: 'Bodyweight',
      primaryBodypart: 'Chest',
      notes: 'Keep your core tight throughout the movement',
    },
    {
      id: '2',
      name: 'Bodyweight Squats',
      sets: 3,
      reps: 15,
      weight: null,
      restTime: 90,
      category: 'Bodyweight',
      primaryBodypart: 'Legs',
    },
    {
      id: '3',
      name: 'Plank',
      sets: 3,
      reps: '30-45 sec',
      weight: null,
      restTime: 60,
      category: 'Bodyweight',
      primaryBodypart: 'Core',
    },
    {
      id: '4',
      name: 'Mountain Climbers',
      sets: 3,
      reps: 20,
      weight: null,
      restTime: 45,
      category: 'Cardio',
      primaryBodypart: 'Full Body',
    },
    {
      id: '5',
      name: 'Burpees',
      sets: 2,
      reps: 8,
      weight: null,
      restTime: 120,
      category: 'Cardio',
      primaryBodypart: 'Full Body',
      notes: 'Take your time, focus on form over speed',
    },
  ]

  return {
    id: 'workout-1',
    name: 'Full Body HIIT Workout',
    duration: '30',
    bodyParts: ['full-body'],
    location: 'home-no-equipment',
    intensity: 'intermediate',
    exercises: mockExercises,
    estimatedTime: 25,
  }
}

export default function WorkoutResultPage() {
  const router = useRouter()
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null)
  const [editingExercise, setEditingExercise] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<WorkoutExercise>>({})

  useEffect(() => {
    // For now, use mock data. In real implementation, this would come from the form preferences
    const mockWorkout = generateMockWorkout()
    setWorkout(mockWorkout)
  }, [])

  const handleEditExercise = (exercise: WorkoutExercise) => {
    setEditingExercise(exercise.id)
    setEditForm(exercise)
  }

  const handleSaveEdit = () => {
    if (!workout || !editingExercise) return

    setWorkout((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.map((ex) =>
          ex.id === editingExercise
            ? ({ ...ex, ...editForm } as WorkoutExercise)
            : ex
        ),
      }
    })
    setEditingExercise(null)
    setEditForm({})
  }

  const handleCancelEdit = () => {
    setEditingExercise(null)
    setEditForm({})
  }

  const handleDeleteExercise = (exerciseId: string) => {
    if (!workout) return

    setWorkout((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        exercises: prev.exercises.filter((ex) => ex.id !== exerciseId),
      }
    })
  }

  const handleMoveExercise = (exerciseId: string, direction: 'up' | 'down') => {
    if (!workout) return

    const exercises = [...workout.exercises]
    const currentIndex = exercises.findIndex((ex) => ex.id === exerciseId)

    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= exercises.length) return // Swap exercises
    ;[exercises[currentIndex], exercises[newIndex]] = [
      exercises[newIndex],
      exercises[currentIndex],
    ]

    setWorkout((prev) => {
      if (!prev) return prev
      return { ...prev, exercises }
    })
  }

  const handleStartWorkout = () => {
    // Store the workout in localStorage and navigate to workout session
    if (workout) {
      localStorage.setItem('currentWorkout', JSON.stringify(workout))
      router.push('/protected/dashboard/workouts/session')
    }
  }

  const formatRestTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return remainingSeconds > 0
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }

  if (!workout) {
    return <div className="container py-6">Loading...</div>
  }

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/dashboard/workouts/generate">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{workout.name}</h1>
          <p className="text-muted-foreground">
            Your personalized workout is ready
          </p>
        </div>
      </div>

      {/* Workout Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{workout.estimatedTime} min</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Exercises</p>
                <p className="font-medium">{workout.exercises.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Intensity</p>
                <p className="font-medium capitalize">{workout.intensity}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Areas</p>
              <div className="flex flex-wrap gap-1">
                {workout.bodyParts.map((part) => (
                  <Badge key={part} variant="secondary" className="text-xs">
                    {part.replace('-', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Exercises ({workout.exercises.length})
        </h2>

        {workout.exercises.map((exercise, index) => (
          <Card key={exercise.id} className="relative">
            <CardContent className="p-6">
              {editingExercise === exercise.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exercise-name">Exercise Name</Label>
                      <Input
                        id="exercise-name"
                        value={editForm.name || ''}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="exercise-sets">Sets</Label>
                      <Input
                        id="exercise-sets"
                        type="number"
                        value={editForm.sets || ''}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            sets: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="exercise-reps">Reps</Label>
                      <Input
                        id="exercise-reps"
                        value={editForm.reps || ''}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            reps: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="exercise-rest">Rest Time (seconds)</Label>
                      <Input
                        id="exercise-rest"
                        type="number"
                        value={editForm.restTime || ''}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            restTime: parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="exercise-notes">Notes (optional)</Label>
                    <Input
                      id="exercise-notes"
                      value={editForm.notes || ''}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Any specific instructions or modifications"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveEdit}
                      size="sm"
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-start gap-4">
                  {/* Exercise Number & Drag Handle */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveExercise(exercise.id, 'up')}
                        disabled={index === 0}
                        className="h-6 w-6 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMoveExercise(exercise.id, 'down')}
                        disabled={index === workout.exercises.length - 1}
                        className="h-6 w-6 p-0"
                      >
                        ↓
                      </Button>
                    </div>
                  </div>

                  {/* Exercise Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {exercise.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{exercise.sets} sets</span>
                          <span>{exercise.reps} reps</span>
                          {exercise.weight && (
                            <span>{exercise.weight} lbs</span>
                          )}
                          <span>Rest: {formatRestTime(exercise.restTime)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExercise(exercise)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{exercise.category}</Badge>
                      <Badge variant="secondary">
                        {exercise.primaryBodypart}
                      </Badge>
                    </div>

                    {exercise.notes && (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                        💡 {exercise.notes}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" asChild>
          <Link href="/protected/dashboard/workouts/generate">
            Regenerate Workout
          </Link>
        </Button>
        <Button onClick={handleStartWorkout} size="lg" className="gap-2">
          <Play className="h-4 w-4" />
          Start Workout
        </Button>
      </div>
    </div>
  )
}
