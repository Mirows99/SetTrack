"use client";

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import ConditionalHeader from '@/components/dashboard/conditional-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Target, Clock, MapPin, Zap } from 'lucide-react'
import Link from 'next/link'

// Type definitions for form data
interface WorkoutPreferences {
  bodyParts: string[]
  duration: string
  location: string
  intensity: string
}

// Type definitions for database data
interface Exercise {
  id: string
  created_by: string
  name: string
  primary_bodypart: string
  secondary_bodypart: string | null
  category: string
  level: string
}

interface Set {
  id: string
  created_at: string
  exercise: string
  reps: number
  weight: number | null
  intensity: string | null
  notes: string | null
}

interface SetWithExercise extends Set {
  exercise_data: Exercise[]
}

interface ExercisePreference {
  exercise_id: string
  exercise_name: string
  preference_score: number // 1-10 scale
  last_performed: string | null
  frequency: number // times performed in last 30 days
}

const bodyPartOptions = [
  { id: 'full-body', label: 'Full Body', description: 'Complete workout targeting all muscle groups' },
  { id: 'upper-body', label: 'Upper Body', description: 'Chest, shoulders, arms, and back' },
  { id: 'lower-body', label: 'Lower Body', description: 'Legs, glutes, and calves' },
  { id: 'push', label: 'Push (Chest, Shoulders, Triceps)', description: 'Pushing movements and muscles' },
  { id: 'pull', label: 'Pull (Back, Biceps)', description: 'Pulling movements and muscles' },
  { id: 'legs', label: 'Legs & Glutes', description: 'Lower body focus' },
  { id: 'core', label: 'Core & Abs', description: 'Abdominal and core muscles' },
  { id: 'cardio', label: 'Cardio', description: 'Heart rate and endurance training' }
]

const durationOptions = [
  { value: '15', label: '15 minutes', description: 'Quick session' },
  { value: '30', label: '30 minutes', description: 'Standard workout' },
  { value: '45', label: '45 minutes', description: 'Extended session' },
  { value: '60', label: '60 minutes', description: 'Full workout' },
  { value: '90', label: '90+ minutes', description: 'Extended training' }
]

const locationOptions = [
  { 
    value: 'home-no-equipment', 
    label: 'Home (No Equipment)', 
    description: 'Bodyweight exercises only',
    icon: '🏠'
  },
  { 
    value: 'home-basic-equipment', 
    label: 'Home (Basic Equipment)', 
    description: 'Dumbbells, resistance bands, etc.',
    icon: '🏠'
  },
  { 
    value: 'gym', 
    label: 'Gym', 
    description: 'Full gym equipment available',
    icon: '🏋️'
  },
  { 
    value: 'outdoor', 
    label: 'Outdoor', 
    description: 'Park, running track, outdoor space',
    icon: '🌳'
  }
]

const intensityOptions = [
  { value: 'beginner', label: 'Beginner', description: 'New to fitness or getting back into it' },
  { value: 'intermediate', label: 'Intermediate', description: 'Regular exercise routine' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced with challenging workouts' }
]

export default function GenerateWorkoutFormPage() {
  const router = useRouter()
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    bodyParts: [],
    duration: '',
    location: '',
    intensity: ''
  })

  // Background data state
  const [sets, setSets] = useState<SetWithExercise[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [exercisePreferences, setExercisePreferences] = useState<ExercisePreference[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  // Fetch data in background
  // useEffect(() => {
  //   async function fetchWorkoutData() {
  //     try {
  //       const supabase = createClient()
        
  //       // Fetch sets with exercise data
  //       const { data: setsData, error: setsError } = await supabase
  //         .from('sets')
  //         .select(`
  //           id,
  //           created_at,
  //           exercise,
  //           reps,
  //           weight,
  //           intensity,
  //           notes,
  //           exercise_data:exercises(
  //             id,
  //             created_by,
  //             name,
  //             primary_bodypart,
  //             secondary_bodypart,
  //             category,
  //             level
  //           )
  //         `)
  //         .order('created_at', { ascending: false })

  //       if (setsError) {
  //         console.error('Error fetching sets:', setsError)
  //       } else if (setsData) {
  //         setSets(setsData as SetWithExercise[])
  //       }

  //       // Fetch all exercises
  //       const { data: exercisesData, error: exercisesError } = await supabase
  //         .from('exercises')
  //         .select('*')
  //         .order('name', { ascending: true })

  //       if (exercisesError) {
  //         console.error('Error fetching exercises:', exercisesError)
  //       } else if (exercisesData) {
  //         setExercises(exercisesData as Exercise[])
          
  //         // Generate mock exercise preferences based on exercises
  //         const mockPreferences: ExercisePreference[] = exercisesData.map((exercise, index) => ({
  //           exercise_id: exercise.id,
  //           exercise_name: exercise.name,
  //           preference_score: Math.floor(Math.random() * 10) + 1, // Random score 1-10
  //           last_performed: index % 3 === 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null, // Random date in last 30 days for every 3rd exercise
  //           frequency: Math.floor(Math.random() * 15) // Random frequency 0-14 times in last 30 days
  //         }))
          
  //         setExercisePreferences(mockPreferences)
  //       }
        
  //     } catch (error) {
  //       console.error('Error fetching workout data:', error)
  //     } finally {
  //       setIsLoadingData(false)
  //     }
  //   }

  //   fetchWorkoutData()
  // }, [])

  const handleBodyPartChange = (bodyPartId: string, checked: boolean) => {
    if (checked) {
      setPreferences(prev => ({
        ...prev,
        bodyParts: [...prev.bodyParts, bodyPartId]
      }))
    } else {
      setPreferences(prev => ({
        ...prev,
        bodyParts: prev.bodyParts.filter(id => id !== bodyPartId)
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (preferences.bodyParts.length === 0 || !preferences.duration || !preferences.location || !preferences.intensity) {
      alert('Please fill in all fields')
      return
    }

    // Store preferences and background data in localStorage for the result page to use
    const workoutData = {
      preferences,
      sets,
      exercises,
      exercisePreferences,
      generatedAt: new Date().toISOString()
    }
    
    localStorage.setItem('workoutPreferences', JSON.stringify(preferences))
    localStorage.setItem('workoutData', JSON.stringify(workoutData))
    
    // Navigate to result page
    router.push('/protected/dashboard/workouts/generate/result')
  }

  const isFormValid = preferences.bodyParts.length > 0 && preferences.duration && preferences.location && preferences.intensity

  return (
    <div className="container py-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/protected/dashboard/workouts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Your Workout</h1>
          <p className="text-muted-foreground">
            Tell us your preferences and we'll create the perfect workout for you
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Body Parts Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              What do you want to train?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bodyPartOptions.map((option) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={option.id}
                    checked={preferences.bodyParts.includes(option.id)}
                    onCheckedChange={(checked) => handleBodyPartChange(option.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {preferences.bodyParts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Selected:</span>
                {preferences.bodyParts.map((id) => {
                  const option = bodyPartOptions.find(opt => opt.id === id)
                  return (
                    <Badge key={id} variant="secondary">
                      {option?.label}
                    </Badge>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Duration Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              How much time do you have?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={preferences.duration} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, duration: value }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {durationOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.value} id={`duration-${option.value}`} />
                    <div className="flex-1">
                      <Label htmlFor={`duration-${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Location Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Where are you working out?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={preferences.location} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, location: value }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.value} id={`location-${option.value}`} />
                    <div className="flex-1">
                      <Label htmlFor={`location-${option.value}`} className="font-medium cursor-pointer flex items-center gap-2">
                        <span>{option.icon}</span>
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Intensity Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              What's your fitness level?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={preferences.intensity} 
              onValueChange={(value) => setPreferences(prev => ({ ...prev, intensity: value }))}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {intensityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.value} id={`intensity-${option.value}`} />
                    <div className="flex-1">
                      <Label htmlFor={`intensity-${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="lg" 
            disabled={!isFormValid}
            className="min-w-[200px]"
          >
            Generate Workout
          </Button>
        </div>
      </form>
    </div>
  )
} 