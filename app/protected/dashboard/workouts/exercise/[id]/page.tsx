"use client"

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
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

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [sets, setSets] = useState<Set[]>([])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form state for new set
  const [formData, setFormData] = useState({
    weight: '',
    reps: '',
    intensity: 'Moderate',
    notes: ''
  })
  
  const resolvedParams = use(params)
  const exerciseId = resolvedParams.id

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient()
        
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
  }, [exerciseId])

  const handleSaveSet = async () => {
    if (!exercise || !formData.weight || !formData.reps) {
      alert('Please fill in weight and reps')
      return
    }

    setIsSaving(true)
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('sets')
        .insert({
          exercise: exerciseId,
          weight: parseFloat(formData.weight),
          reps: parseInt(formData.reps),
          intensity: formData.intensity,
          notes: formData.notes || null
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
      setFormData({
        weight: '',
        reps: '',
        intensity: 'Moderate',
        notes: ''
      })
      setIsSheetOpen(false)
      
    } catch (error) {
      console.error('Error saving set:', error)
      alert('Failed to save set. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="weight" className="text-sm font-medium mb-1 block">Weight (lbs)</label>
                <Input 
                  id="weight" 
                  type="number" 
                  placeholder="135" 
                  autoFocus={false}
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="reps" className="text-sm font-medium mb-1 block">Reps</label>
                <Input 
                  id="reps" 
                  type="number" 
                  placeholder="8" 
                  autoFocus={false}
                  value={formData.reps}
                  onChange={(e) => handleInputChange('reps', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="intensity" className="text-sm font-medium mb-1 block">Intensity</label>
                <select
                  id="intensity"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus={false}
                  value={formData.intensity}
                  onChange={(e) => handleInputChange('intensity', e.target.value)}
                >
                  <option value="Warm Up">Warm Up</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Failure">Failure</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="text-sm font-medium mb-1 block">Notes (optional)</label>
              <Input 
                id="notes" 
                placeholder="Add any notes about this set" 
                autoFocus={false}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
              />
            </div>
          </div>
          <SheetFooter>
            <Button 
              className="w-full" 
              onClick={handleSaveSet}
              disabled={isSaving || !formData.weight || !formData.reps}
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
        </SheetContent>
      </Sheet>
    </div>
  )
} 