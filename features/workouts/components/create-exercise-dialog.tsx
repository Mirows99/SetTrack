'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { createExercise } from '@/lib/actions'
import { useSupabase } from '@/providers/supabase-provider'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Form validation schema
const createExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  body_region: z.enum(['UPPER', 'LOWER', 'FULL'], {
    required_error: 'Please select a body region',
  }),
  primary_bodypart: z.string().min(1, 'Primary bodypart is required'),
  secondary_bodypart: z.string().optional(),
  category: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  is_default: z.boolean(),
})

type CreateExerciseFormData = z.infer<typeof createExerciseSchema>

// Define muscle groups organized by body region
const muscleGroupsByRegion = {
  UPPER: [
    { id: 'Chest', name: 'Chest' },
    { id: 'Back', name: 'Back' },
    { id: 'Shoulders', name: 'Shoulders' },
    { id: 'Biceps', name: 'Biceps' },
    { id: 'Triceps', name: 'Triceps' },
    { id: 'Abs', name: 'Abs' },
  ],
  LOWER: [
    { id: 'Quads', name: 'Quads' },
    { id: 'Hamstrings', name: 'Hamstrings' },
    { id: 'Glutes', name: 'Glutes' },
    { id: 'Calves', name: 'Calves' },
  ],
  FULL: [{ id: 'Full Body', name: 'Full Body' }],
}

const exerciseCategories = [
  { id: 'Push', name: 'Push' },
  { id: 'Pull', name: 'Pull' },
  { id: 'Legs', name: 'Legs' },
  { id: 'Core', name: 'Core' },
]

interface CreateExerciseDialogProps {
  onExerciseCreated?: () => void
  triggerClassName?: string
}

export function CreateExerciseDialog({
  onExerciseCreated,
  triggerClassName,
}: CreateExerciseDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useSupabase()
  const router = useRouter()

  const form = useForm<CreateExerciseFormData>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      name: '',
      body_region: undefined,
      primary_bodypart: '',
      secondary_bodypart: '',
      category: '',
      level: undefined,
      is_default: false,
    },
  })

  const watchedBodyRegion = form.watch('body_region')

  // Get available muscle groups based on selected body region
  const availableMuscleGroups = watchedBodyRegion
    ? muscleGroupsByRegion[watchedBodyRegion as 'UPPER' | 'LOWER' | 'FULL']
    : []

  // Handle Full Body selection - automatically set primary bodypart to "full"
  useEffect(() => {
    if (watchedBodyRegion === 'FULL') {
      form.setValue('primary_bodypart', 'full')
      form.setValue('secondary_bodypart', '') // Clear secondary bodypart
    } else if (watchedBodyRegion) {
      // Clear primary bodypart when switching away from Full Body
      form.setValue('primary_bodypart', '')
      form.setValue('secondary_bodypart', '')
    }
  }, [watchedBodyRegion, form])

  const onSubmit = async (data: CreateExerciseFormData) => {
    if (!user?.id) {
      console.error('User not authenticated')
      return
    }

    setIsSubmitting(true)

    try {
      // Transform empty strings to undefined for optional fields
      const cleanData = {
        ...data,
        secondary_bodypart: data.secondary_bodypart || undefined,
        category: data.category || undefined,
        level: data.level || undefined,
        created_by: user.id,
      }

      const result = await createExercise(cleanData)

      if (result.success) {
        setOpen(false)
        form.reset()
        onExerciseCreated?.()
        router.refresh()
      } else {
        console.error('Error creating exercise:', result.error)
        form.setError('root', {
          message: result.error || 'Failed to create exercise',
        })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      form.setError('root', {
        message: 'An unexpected error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={triggerClassName}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exercise</DialogTitle>
          <DialogDescription>
            Add a new exercise to your collection. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Exercise Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercise Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Push-ups, Squats, Deadlift"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body Region */}
            <FormField
              control={form.control}
              name="body_region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Region *</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="UPPER">Upper Body</TabsTrigger>
                        <TabsTrigger value="LOWER">Lower Body</TabsTrigger>
                        <TabsTrigger value="FULL">Full Body</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary Bodypart - Only show if not Full Body */}
            {watchedBodyRegion !== 'FULL' && (
              <FormField
                control={form.control}
                name="primary_bodypart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Muscle Group *</FormLabel>
                    <FormControl>
                      {watchedBodyRegion ? (
                        <Tabs
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <TabsList
                            className={`grid w-full h-auto ${watchedBodyRegion === 'LOWER' ? 'grid-cols-2' : 'grid-cols-3'}`}
                          >
                            {availableMuscleGroups.map((muscle) => (
                              <TabsTrigger
                                key={muscle.id}
                                value={muscle.id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                              >
                                {muscle.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                      ) : (
                        <div className="text-sm text-muted-foreground p-3 border rounded-md">
                          Select body region first
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Secondary Bodypart - Only show if not Full Body */}
            {watchedBodyRegion !== 'FULL' && (
              <FormField
                control={form.control}
                name="secondary_bodypart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Muscle Group (Optional)</FormLabel>
                    <FormControl>
                      {watchedBodyRegion ? (
                        <Tabs
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <TabsList
                            className={`grid w-full h-auto ${watchedBodyRegion === 'LOWER' ? 'grid-cols-2' : 'grid-cols-3'}`}
                          >
                            {availableMuscleGroups.map((muscle) => (
                              <TabsTrigger
                                key={muscle.id}
                                value={muscle.id}
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                              >
                                {muscle.name}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </Tabs>
                      ) : (
                        <div className="text-sm text-muted-foreground p-3 border rounded-md">
                          Select body region first
                        </div>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <TabsList className="grid w-full grid-cols-4">
                        {exerciseCategories.map((category) => (
                          <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            {category.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Level */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty Level (Optional)</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger
                          value="Beginner"
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Beginner
                        </TabsTrigger>
                        <TabsTrigger
                          value="Intermediate"
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Intermediate
                        </TabsTrigger>
                        <TabsTrigger
                          value="Advanced"
                          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          Advanced
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Exercise'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
