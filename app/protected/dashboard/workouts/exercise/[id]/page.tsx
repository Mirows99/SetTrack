"use client"

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

// Mock data for exercise details
const mockExerciseData: Record<string, { id: string; name: string; difficulty: string; muscleGroup: string }> = {
  '1': { id: '1', name: 'Bench Press', difficulty: 'Intermediate', muscleGroup: 'Chest' },
  '2': { id: '2', name: 'Push-ups', difficulty: 'Beginner', muscleGroup: 'Chest' },
  '3': { id: '3', name: 'Incline Dumbbell Press', difficulty: 'Intermediate', muscleGroup: 'Chest' },
  '9': { id: '9', name: 'Squats', difficulty: 'Intermediate', muscleGroup: 'Legs' },
  '17': { id: '17', name: 'Bicep Curls', difficulty: 'Beginner', muscleGroup: 'Arms' },
}

// Mock data for past sets
const mockSets = [
  { id: 1, weight: 135, reps: 8, intensity: 'Moderate', date: '2023-08-15T10:30:00' },
  { id: 2, weight: 145, reps: 6, intensity: 'High', date: '2023-08-17T11:15:00' },
  { id: 3, weight: 135, reps: 10, intensity: 'Moderate', date: '2023-08-20T09:45:00' },
]

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const [isLoading, setIsLoading] = useState(true)
  
  const resolvedParams = use(params)
  const exerciseId = resolvedParams.id
  const exercise = mockExerciseData[exerciseId]

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.getSession()
        if (error || !data.session) {
          window.location.href = '/auth/login'
          return
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication error:', error)
        window.location.href = '/auth/login'
      }
    }

    checkAuth()
  }, [])

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
        <span className="px-2 py-1 bg-muted rounded-md text-sm">{exercise.muscleGroup}</span>
        <span className="px-2 py-1 bg-muted rounded-md text-sm">{exercise.difficulty}</span>
      </div>

      <div>
        {/* Analytics Card */}
        <AnalyticsCard exerciseId={exercise.id} />
      </div>

      {/* Past Sets Table */}
      <div>
        <h2 className="text-xl font-bold mb-4">Previous Sets</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Reps</TableHead>
                <TableHead>Intensity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSets.map((set) => (
                <TableRow key={set.id}>
                  <TableCell>{new Date(set.date).toLocaleDateString()}</TableCell>
                  <TableCell>{set.weight}</TableCell>
                  <TableCell>{set.reps}</TableCell>
                  <TableCell>{set.intensity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Floating Action Button */}
      <Sheet>
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
          className="h-auto max-h-[80%]"
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
                <Input id="weight" type="number" placeholder="135" autoFocus={false} />
              </div>
              <div>
                <label htmlFor="reps" className="text-sm font-medium mb-1 block">Reps</label>
                <Input id="reps" type="number" placeholder="8" autoFocus={false} />
              </div>
              <div>
                <label htmlFor="intensity" className="text-sm font-medium mb-1 block">Intensity</label>
                <select
                  id="intensity"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  autoFocus={false}
                >
                  <option value="Warm Up">Warm Up</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Save Set
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
} 