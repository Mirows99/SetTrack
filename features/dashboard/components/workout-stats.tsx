"use client"

import { 
  ActivityIcon, 
  CalendarIcon, 
  FlameIcon, 
  TrendingUpIcon 
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function WorkoutStats() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Workout Statistics</CardTitle>
        <CardDescription>Your fitness activity overview</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <TabsContent value="week" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatsCard 
                title="Workouts" 
                value="5" 
                description="3 more than last week" 
                trend="up"
                icon={ActivityIcon} 
              />
              <StatsCard 
                title="Active Days" 
                value="4" 
                description="1 more than last week" 
                trend="up"
                icon={CalendarIcon} 
              />
              <StatsCard 
                title="Calories" 
                value="2,450" 
                description="750 more than last week" 
                trend="up"
                icon={FlameIcon} 
              />
              <StatsCard 
                title="Progress" 
                value="15%" 
                description="5% increase from last week" 
                trend="up"
                icon={TrendingUpIcon} 
              />
            </div>
          </TabsContent>
          <TabsContent value="month" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatsCard 
                title="Workouts" 
                value="18" 
                description="2 more than last month" 
                trend="up"
                icon={ActivityIcon} 
              />
              <StatsCard 
                title="Active Days" 
                value="15" 
                description="3 more than last month" 
                trend="up"
                icon={CalendarIcon} 
              />
              <StatsCard 
                title="Calories" 
                value="9,650" 
                description="1,200 more than last month" 
                trend="up"
                icon={FlameIcon} 
              />
              <StatsCard 
                title="Progress" 
                value="22%" 
                description="7% increase from last month" 
                trend="up"
                icon={TrendingUpIcon} 
              />
            </div>
          </TabsContent>
          <TabsContent value="year" className="pt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatsCard 
                title="Workouts" 
                value="156" 
                description="34 more than last year" 
                trend="up"
                icon={ActivityIcon} 
              />
              <StatsCard 
                title="Active Days" 
                value="142" 
                description="28 more than last year" 
                trend="up"
                icon={CalendarIcon} 
              />
              <StatsCard 
                title="Calories" 
                value="85,320" 
                description="15,400 more than last year" 
                trend="up"
                icon={FlameIcon} 
              />
              <StatsCard 
                title="Progress" 
                value="75%" 
                description="25% increase from last year" 
                trend="up"
                icon={TrendingUpIcon} 
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ElementType
}

function StatsCard({ title, value, description, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">{title}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      <div className="mt-1 flex items-center text-xs">
        <span className={
          trend === 'up' 
            ? 'text-green-500' 
            : trend === 'down' 
              ? 'text-red-500' 
              : 'text-muted-foreground'
        }>
          {description}
        </span>
      </div>
    </div>
  )
} 