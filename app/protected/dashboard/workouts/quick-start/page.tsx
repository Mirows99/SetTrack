'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

import { Search, ArrowUpDown, ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyExercisesState, ExerciseCard, CreateExerciseDialog } from '@/features/workouts'
import { getExercises } from '@/lib/actions'
import { Prisma } from '@/lib/generated/prisma'
import { useSupabase } from '@/providers/supabase-provider'

// Type for exercise with includes from Prisma
type ExerciseWithIncludes = Prisma.excerciseGetPayload<{
  include: {
    sets: true
    user_preferences: true
    excercise_preset: true
  }
}>

// Define body regions
const bodyRegions = [
  {
    id: 'UPPER',
    name: 'Upper Body',
  },
  {
    id: 'LOWER',
    name: 'Lower Body',
  },
]

// Define muscle groups organized by body region
const muscleGroupsByRegion = {
  UPPER: [
    { id: 'chest', name: 'Chest' },
    { id: 'back', name: 'Back' },
    { id: 'shoulders', name: 'Shoulders' },
    { id: 'biceps', name: 'Biceps' },
    { id: 'triceps', name: 'Triceps' },
    { id: 'abs', name: 'Abs' },
  ],
  LOWER: [
    { id: 'quads', name: 'Quads' },
    { id: 'hamstrings', name: 'Hamstrings' },
    { id: 'glutes', name: 'Glutes' },
    { id: 'calves', name: 'Calves' },
  ],
}

export default function QuickStartPage() {
  const [exercises, setExercises] = useState<ExerciseWithIncludes[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<'UPPER' | 'LOWER' | ''>(
    ''
  )
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('')
  const { user } = useSupabase()

  useEffect(() => {
    const initializeData = async () => {
      // Wait for user to be loaded and ensure we have a valid user ID
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const exercisesResult = await getExercises(user.id)

        if (!exercisesResult.success) {
          console.error('Error fetching exercises:', exercisesResult.error)
        }

        setExercises(exercisesResult.data || [])
      } catch (error) {
        console.error('Unexpected error fetching exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [user])

  // Update selected muscle group when region changes
  useEffect(() => {
    if (selectedRegion) {
      const defaultMuscleGroup =
        muscleGroupsByRegion[selectedRegion as 'UPPER' | 'LOWER'][0]?.id
      setSelectedMuscleGroup(defaultMuscleGroup || '')
    } else {
      setSelectedMuscleGroup('')
    }
  }, [selectedRegion])

  // Group exercises by body region and muscle group (only when region is selected)
  const exercisesByRegionAndBodyPart = selectedRegion
    ? muscleGroupsByRegion[selectedRegion as 'UPPER' | 'LOWER'].reduce(
        (
          muscleAcc: Record<string, ExerciseWithIncludes[]>,
          muscle: { id: string; name: string }
        ) => {
          muscleAcc[muscle.id] = exercises.filter(
            (ex) =>
              ex.body_region?.toUpperCase() === selectedRegion &&
              ex.primary_bodypart?.toLowerCase() === muscle.id
          )
          return muscleAcc
        },
        {} as Record<string, ExerciseWithIncludes[]>
      )
    : {}

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading exercises...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/protected/dashboard/workouts">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quick Start Workout
          </h1>
          <p className="text-muted-foreground">
            Select exercises to include in your workout
          </p>
        </div>
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
          <CreateExerciseDialog 
            onExerciseCreated={() => {
              // Refresh the exercises list when a new exercise is created
              if (user?.id) {
                getExercises(user.id).then((result) => {
                  if (result.success) {
                    setExercises(result.data || [])
                  }
                })
              }
            }}
          />
        </div>
      </div>

      {/* Body Region Tabs */}
      <Tabs value={selectedRegion} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          {bodyRegions.map((region) => (
            <TabsTrigger
              key={region.id}
              value={region.id}
              onClick={(e) => {
                e.preventDefault()
                // If clicking the same region, deselect it
                if (region.id === selectedRegion) {
                  setSelectedRegion('')
                } else {
                  setSelectedRegion(region.id as 'UPPER' | 'LOWER')
                }
              }}
            >
              {region.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Only show muscle group tabs when a region is selected */}
        {selectedRegion && (
          <Tabs value={selectedMuscleGroup} className="w-full">
            <TabsList className="flex overflow-x-auto sm:grid sm:grid-cols-6 mb-4">
              {muscleGroupsByRegion[selectedRegion as 'UPPER' | 'LOWER'].map(
                (muscle) => (
                  <TabsTrigger
                    key={muscle.id}
                    value={muscle.id}
                    className="flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault()
                      // If clicking the same muscle group, deselect it
                      if (muscle.id === selectedMuscleGroup) {
                        setSelectedMuscleGroup('')
                      } else {
                        setSelectedMuscleGroup(muscle.id)
                      }
                    }}
                  >
                    {muscle.name}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            {/* Show all exercises for the selected region when no muscle group is selected */}
            {!selectedMuscleGroup && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-4">
                  All {bodyRegions.find((r) => r.id === selectedRegion)?.name}{' '}
                  Exercises
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {exercises.filter(
                    (ex) => ex.body_region?.toUpperCase() === selectedRegion
                  ).length > 0 ? (
                    exercises
                      .filter(
                        (ex) => ex.body_region?.toUpperCase() === selectedRegion
                      )
                      .map((exercise) => (
                        <ExerciseCard key={exercise.id} exercise={exercise} />
                      ))
                  ) : (
                    <div className="col-span-full">
                      <EmptyExercisesState
                        groupName={`${bodyRegions.find((r) => r.id === selectedRegion)?.name} exercises`}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exercise Content for specific muscle groups */}
            {selectedMuscleGroup &&
              muscleGroupsByRegion[selectedRegion as 'UPPER' | 'LOWER'].map(
                (muscle) => (
                  <TabsContent
                    key={muscle.id}
                    value={muscle.id}
                    className="mt-0"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {exercisesByRegionAndBodyPart[muscle.id]?.length > 0 ? (
                        exercisesByRegionAndBodyPart[muscle.id].map(
                          (exercise) => (
                            <ExerciseCard
                              key={exercise.id}
                              exercise={exercise}
                            />
                          )
                        )
                      ) : (
                        <EmptyExercisesState groupName={muscle.name} />
                      )}
                    </div>
                  </TabsContent>
                )
              )}
          </Tabs>
        )}
      </Tabs>

      {/* Show all exercises when no region is selected */}
      {!selectedRegion && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">All Exercises</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyExercisesState groupName="exercises" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
