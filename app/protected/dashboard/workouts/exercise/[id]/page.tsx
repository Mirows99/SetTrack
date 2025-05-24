"use client"

import { useState, useEffect, use } from 'react'
import { useSupabase } from '@/providers/supabase-provider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Plus, ArrowLeft } from 'lucide-react'
import { AnalyticsCard } from '@/components/analytics-card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

type Exercise = {
  id: string
  name: string
  level: string
  primary_bodypart: string
  secondary_bodypart?: string
}

type Set = {
  id: string
  created_at: string
  exercise: string
  reps: number
  weight: number
  intensity: string
  notes?: string
}

const setFormSchema = z.object({
  weight: z.string().min(1, "Weight is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, "Weight must be a positive number"),
  reps: z.string().min(1, "Reps is required").refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num > 0
  }, "Reps must be a positive number"),
  intensity: z.enum(["Warm Up", "Low", "Moderate", "High", "Failure"], {
    required_error: "Please select an intensity level",
  }),
  notes: z.string().optional(),
})

type SetFormValues = z.infer<typeof setFormSchema>

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [sets, setSets] = useState<Set[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const resolvedParams = use(params)
  const exerciseId = resolvedParams.id
  const { supabase } = useSupabase()

  const form = useForm<SetFormValues>({
    resolver: zodResolver(setFormSchema),
    defaultValues: {
      weight: '',
      reps: '',
      intensity: 'Moderate',
      notes: ''
    }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Check authentication
        const { data: authData, error: authError } = await supabase.auth.getSession()
        if (authError || !authData.session) {
          window.location.href = '/auth/login'
          return
        }
        
        // Fetch exercise data
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('excercise')
          .select('*')
          .eq('id', exerciseId)
          .single()
        
        if (exerciseError || !exerciseData) {
          console.error('Error fetching exercise:', exerciseError)
          window.location.href = '/protected/dashboard/workouts/quick-start'
          return
        }
        
        setExercise(exerciseData)
        
        // Fetch sets data for this exercise
        const { data: setsData, error: setsError } = await supabase
          .from('sets')
          .select('*')
          .eq('exercise', exerciseId)
          .order('created_at', { ascending: false })
        
        if (setsError) {
          console.error('Error fetching sets:', setsError)
        } else {
          setSets(setsData || [])
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Data fetching error:', error)
        window.location.href = '/auth/login'
      }
    }

    fetchData()
  }, [exerciseId, supabase])

  const onSubmit = async (values: SetFormValues) => {
    if (!exercise) return

    setIsSaving(true)
    
    try {
      const { error } = await supabase
        .from('sets')
        .insert({
          exercise: exerciseId,
          weight: parseFloat(values.weight),
          reps: parseInt(values.reps),
          intensity: values.intensity,
          notes: values.notes || null
        })
      
      if (error) {
        console.error('Error saving set:', error)
        alert(`Failed to save set: ${error.message || 'Unknown error'}`)
        return
      }
      
      // Refresh sets data
      const { data: setsData, error: setsError } = await supabase
        .from('sets')
        .select('*')
        .eq('exercise', exerciseId)
        .order('created_at', { ascending: false })
      
      if (!setsError && setsData) {
        setSets(setsData)
      }
      
      // Reset form and close sheet
      form.reset()
      setIsSheetOpen(false)
      
    } catch (error) {
      console.error('Error saving set:', error)
      alert('Failed to save set. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="container py-6">Loading...</div>
  }

  if (!exercise) {
    window.location.href = '/protected/dashboard/workouts/quick-start'
    return null
  }

  return (
    <div className="container py-6 space-y-6 relative pb-24">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/protected/dashboard/workouts/quick-start">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{exercise.name}</h1>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-muted rounded-md text-sm">{exercise.primary_bodypart}</span>
        {exercise.secondary_bodypart && (
          <span className="px-2 py-1 bg-muted rounded-md text-sm">{exercise.secondary_bodypart}</span>
        )}
        <span className="px-2 py-1 bg-muted rounded-md text-sm">{exercise.level}</span>
      </div>

      <div>
        {/* Analytics Card */}
        <AnalyticsCard exerciseId={exercise.id} />
      </div>

      {/* Past Sets Table */}
      <div className="space-y-6">
        {Object.entries(sets.reduce((acc: { [key: string]: Set[] }, set) => {
          const date = new Date(set.created_at).toLocaleDateString('de-DE', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }).toUpperCase();
          
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(set);
          return acc;
        }, {})).map(([date, dateSets]) => (
          <div key={date} className="space-y-3">
            <h3 className="text-sm text-muted-foreground font-medium">{date}</h3>
            <Card className="overflow-hidden">
              <div className="divide-y">
                {dateSets.map((set) => {
                  const time = new Date(set.created_at).toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  
                  return (
                    <button
                      key={set.id}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() => {/* TODO: Add click handler */}}
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-lg font-medium">{time}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-500 text-lg font-medium">{set.reps}</span>
                          <span className="text-muted-foreground text-sm">rep</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500 text-lg font-medium">{set.weight}</span>
                          <span className="text-muted-foreground text-sm">kg</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          set.intensity === 'High' || set.intensity === 'Failure' 
                            ? 'bg-red-100 text-red-700' 
                            : set.intensity === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {set.intensity}
                        </div>
                      </div>
                    </button>
                  );
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full fixed bottom-20 right-4 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="bottom" 
          className="h-auto max-h-[80%] px-4"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Record New Set</SheetTitle>
            <SheetDescription>Add details of your current set</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="135" 
                          autoFocus={false}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reps</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="8" 
                          autoFocus={false}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select intensity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Warm Up">Warm Up</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Failure">Failure</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Add any notes about this set" 
                        autoFocus={false}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <SheetFooter>
                <Button 
                  type="submit"
                  className="w-full" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-b-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Set
                    </>
                  )}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
} 