'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'

export default function CalendarContent() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Workout Schedule</CardTitle>
            <CardDescription>
              View your planned workouts and training sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Workouts</CardTitle>
            <CardDescription>Your next training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Upper Body Strength</div>
                    <div className="text-sm text-muted-foreground">
                      Tomorrow, 10:00 AM
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">45 min</div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Cardio Session</div>
                    <div className="text-sm text-muted-foreground">
                      Thursday, 2:00 PM
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">30 min</div>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Leg Day</div>
                    <div className="text-sm text-muted-foreground">
                      Saturday, 11:00 AM
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">60 min</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Your training frequency this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Total Workouts</div>
                <div className="text-sm font-medium">12</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Training Days</div>
                <div className="text-sm font-medium">8</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Rest Days</div>
                <div className="text-sm font-medium">4</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Total Hours</div>
                <div className="text-sm font-medium">9.5</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
