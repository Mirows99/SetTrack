'use client'

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, ArrowLeft, Minus } from 'lucide-react'
import { AnalyticsCard } from '@/components/analytics-card'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { getExerciseById, getSets, createSet } from '@/lib/actions'
import { useSupabase } from '@/providers/supabase-provider'
import { ExerciseLoadingSkeleton } from '@/features/workouts'

type Exercise = {
  id: bigint
  name: string
  level?: string | null
  primary_bodypart: string
  secondary_bodypart?: string | null
}

type Set = {
  id: bigint
  created_at: Date
  exercise: bigint | null
  reps: number | null
  weight: number | null
  intensity: string | null
  notes?: string | null
}

const setFormSchema = z.object({
  weight: z.number().min(0.1, 'Weight must be greater than 0'),
  reps: z.number().min(1, 'Reps must be at least 1'),
  intensity: z.enum(['Warm Up', 'Low', 'Moderate', 'High', 'Failure'], {
    required_error: 'Please select an intensity level',
  }),
  notes: z.string().optional(),
})

type SetFormValues = z.infer<typeof setFormSchema>

const intensityOptions = [
  { value: 'Warm Up', label: 'Warm Up' },
  { value: 'Low', label: 'Low' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'High', label: 'High' },
  { value: 'Failure', label: 'Failure' },
] as const

export default function ExercisePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [sets, setSets] = useState<Set[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedParams = use(params)
  const exerciseId = resolvedParams.id
  const { user } = useSupabase()

  const form = useForm<SetFormValues>({
    resolver: zodResolver(setFormSchema),
    defaultValues: {
      weight: 20,
      reps: 12,
      intensity: 'Moderate',
      notes: '',
    },
  })

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Check authentication
        if (!user) {
          window.location.href = '/auth/login'
          return
        }

        // Fetch exercise data
        const exerciseResult = await getExerciseById(BigInt(exerciseId))
        if (!exerciseResult.success || !exerciseResult.data) {
          console.error('Error fetching exercise:', exerciseResult.error)
          window.location.href = '/protected/dashboard/workouts/quick-start'
          return
        }

        setExercise(exerciseResult.data)

        // Fetch sets data for this exercise
        const setsResult = await getSets(user.id, BigInt(exerciseId))
        if (!setsResult.success) {
          console.error('Error fetching sets:', setsResult.error)
          setError('Failed to load workout history')
        } else {
          setSets(setsResult.data || [])
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Data fetching error:', error)
        setError('Failed to load data')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [exerciseId])

  const onSubmit = async (values: SetFormValues) => {
    if (!exercise) return

    setIsSaving(true)
    setError(null)

    try {
      // Get current user

      if (!user) {
        window.location.href = '/auth/login'
        return
      }

      // Create the set
      const createResult = await createSet({
        exercise: BigInt(exerciseId),
        weight: values.weight,
        reps: values.reps,
        intensity: values.intensity,
        notes: values.notes || undefined,
        user_id: user.id,
      })

      if (!createResult.success) {
        console.error('Error saving set:', createResult.error)
        setError(`Failed to save set: ${createResult.error}`)
        return
      }

      // Refresh sets data
      const setsResult = await getSets(user.id, BigInt(exerciseId))
      if (setsResult.success && setsResult.data) {
        setSets(setsResult.data)
      }

      // Reset form and close drawer
      form.reset()
      setIsDrawerOpen(false)
    } catch (error) {
      console.error('Error saving set:', error)
      setError('Failed to save set. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <ExerciseLoadingSkeleton />
  }

  if (!exercise) {
    window.location.href = '/protected/dashboard/workouts/quick-start'
    return null
  }

  return (
    <div className="container py-6 space-y-6 relative pb-24">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/protected/dashboard/workouts/quick-start">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{exercise.name}</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-muted rounded-md text-sm">
          {exercise.primary_bodypart}
        </span>
        {exercise.secondary_bodypart && (
          <span className="px-2 py-1 bg-muted rounded-md text-sm">
            {exercise.secondary_bodypart}
          </span>
        )}
        {exercise.level && (
          <span className="px-2 py-1 bg-muted rounded-md text-sm">
            {exercise.level}
          </span>
        )}
      </div>

      <div>
        {/* Analytics Card */}
        <AnalyticsCard exerciseId={exercise.id.toString()} />
      </div>

      {/* Past Sets Table */}
      <div className="space-y-6">
        {Object.entries(
          sets.reduce((acc: { [key: string]: Set[] }, set) => {
            const date = new Date(set.created_at)
              .toLocaleDateString('de-DE', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              .toUpperCase()

            if (!acc[date]) {
              acc[date] = []
            }
            acc[date].push(set)
            return acc
          }, {})
        ).map(([date, dateSets]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-sm text-muted-foreground font-medium">
              {date}
            </h3>
            <Card className="overflow-hidden">
              <div className="divide-y">
                {dateSets.map((set) => {
                  const time = new Date(set.created_at).toLocaleTimeString(
                    'de-DE',
                    {
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )

                  return (
                    <button
                      key={set.id.toString()}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() => {
                        /* TODO: Add click handler */
                      }}
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-medium">{time}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 text-lg font-medium">
                            {set.reps}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            rep
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500 text-lg font-medium">
                            {set.weight}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            kg
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            set.intensity === 'High' ||
                            set.intensity === 'Failure'
                              ? 'bg-red-100 text-red-700'
                              : set.intensity === 'Moderate'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {set.intensity}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>
        ))}

        {sets.length === 0 && (
          <Card className="p-6 text-center text-muted-foreground">
            No previous sets recorded
          </Card>
        )}
      </div>

      {/* Floating Action Button */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full fixed bottom-20 right-4 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-4">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Record Set</DrawerTitle>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 py-4"
            >
              {/* Repetitions & Weight Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-medium text-gray-400 tracking-wider uppercase">
                  Repetitions & Weight
                </h3>

                {/* Repetitions Row */}
                <FormField
                  control={form.control}
                  name="reps"
                  render={({ field }) => (
                    <FormItem>
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300"
                            onClick={() =>
                              field.onChange(Math.max(1, field.value - 1))
                            }
                          >
                            <Minus className="h-5 w-5" />
                          </Button>

                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {field.value} rep
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300"
                            onClick={() => field.onChange(field.value + 1)}
                          >
                            <Plus className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Weight Row */}
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <div className="bg-gray-100 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300 text-sm"
                              onClick={() =>
                                field.onChange(Math.max(0.5, field.value - 5))
                              }
                            >
                              -5
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300 text-sm"
                              onClick={() =>
                                field.onChange(Math.max(0.5, field.value - 1))
                              }
                            >
                              -1
                            </Button>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {field.value} kg
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300 text-sm"
                              onClick={() => field.onChange(field.value + 1)}
                            >
                              +1
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-12 w-12 rounded-2xl bg-gray-200 hover:bg-gray-300 text-sm"
                              onClick={() => field.onChange(field.value + 5)}
                            >
                              +5
                            </Button>
                          </div>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Intensity Section */}
              <FormField
                control={form.control}
                name="intensity"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {intensityOptions.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={
                              field.value === option.value
                                ? 'default'
                                : 'outline'
                            }
                            size="sm"
                            className={cn(
                              'px-4 py-2 rounded-full text-sm',
                              field.value === option.value
                                ? 'bg-black text-white'
                                : 'bg-white text-gray-700 border-gray-300'
                            )}
                            onClick={() => field.onChange(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-medium text-gray-400 tracking-wider uppercase">
                  Notes
                </h3>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Add any notes about this set"
                          autoFocus={false}
                          className="bg-gray-100 border-0 rounded-2xl h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Record Set Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-medium text-lg"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-b-transparent" />
                      Saving...
                    </>
                  ) : (
                    'Record Set'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
