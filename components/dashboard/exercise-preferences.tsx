'use client'

import { useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

const exercises = [
  'Push-ups', 'Pull-ups', 'Squats', 'Deadlifts', 'Bench Press',
  'Overhead Press', 'Barbell Rows', 'Dips', 'Lunges', 'Planks',
  'Burpees', 'Mountain Climbers', 'Jumping Jacks', 'Russian Twists',
  'Bicycle Crunches', 'Leg Raises', 'Hip Thrusts', 'Bulgarian Split Squats',
  'Face Pulls', 'Lat Pulldowns', 'Tricep Extensions', 'Bicep Curls',
  'Shoulder Shrugs', 'Calf Raises', 'Jump Squats', 'Box Jumps',
  'Kettlebell Swings', 'Turkish Get-ups', 'Bear Crawls', 'Wall Sits'
]

export default function ExercisePreferences() {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})

  const handleRating = (exercise: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [exercise]: rating
    }))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving exercise preferences:', ratings)
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="exercise-preferences">
        <AccordionTrigger className="text-lg font-semibold">
          Exercise Preferences
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Rate your preference for each exercise from 1 to 5 stars
            </p>
            
            <div className="max-h-80 overflow-y-auto border rounded-lg">
              <div className="space-y-1 p-4">
                {exercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md">
                    <span className="text-sm font-medium">{exercise}</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className="p-1 hover:scale-110 transition-transform"
                          onClick={() => handleRating(exercise, rating)}
                        >
                          <Star 
                            className={`w-4 h-4 ${
                              rating <= (ratings[exercise] || 0)
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button onClick={handleSave} className="w-full">
              Save Exercise Preferences
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
} 