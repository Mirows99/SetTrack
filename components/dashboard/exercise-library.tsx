"use client"

import { useState } from 'react'
import { SearchIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

// Mock exercise categories and exercises
const exerciseData = [
  {
    category: 'Chest',
    exercises: ['Bench Press', 'Incline Press', 'Chest Fly', 'Push-ups', 'Dips']
  },
  {
    category: 'Back',
    exercises: ['Pull-ups', 'Rows', 'Lat Pulldown', 'Deadlift', 'Back Extensions']
  },
  {
    category: 'Legs',
    exercises: ['Squats', 'Leg Press', 'Lunges', 'Leg Extensions', 'Calf Raises']
  },
  {
    category: 'Shoulders',
    exercises: ['Shoulder Press', 'Lateral Raises', 'Front Raises', 'Reverse Fly', 'Shrugs']
  },
  {
    category: 'Arms',
    exercises: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skull Crushers', 'Wrist Curls']
  },
  {
    category: 'Core',
    exercises: ['Crunches', 'Planks', 'Russian Twists', 'Leg Raises', 'Ab Rollouts']
  },
  {
    category: 'Cardio',
    exercises: ['Running', 'Cycling', 'Rowing', 'Jumping Rope', 'Swimming']
  }
]

export default function ExerciseLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories] = useState(exerciseData)

  const filteredCategories = searchQuery 
    ? categories.map(category => ({
        ...category,
        exercises: category.exercises.filter(exercise => 
          exercise.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.exercises.length > 0)
    : categories

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Exercise Library</CardTitle>
        <CardDescription>Browse exercises by category</CardDescription>
        <div className="relative mt-2">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <Accordion type="multiple" className="w-full">
            {filteredCategories.map((category) => (
              <AccordionItem key={category.category} value={category.category}>
                <AccordionTrigger>{category.category}</AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {category.exercises.map((exercise) => (
                      <li key={exercise} className="flex justify-between items-center">
                        <span>{exercise}</span>
                        <Button variant="ghost" size="sm">Add</Button>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 