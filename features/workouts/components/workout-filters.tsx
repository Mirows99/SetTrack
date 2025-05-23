"use client"

import { useState } from 'react'
import { CalendarIcon, FilterIcon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

export default function WorkoutFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [workoutType, setWorkoutType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleTypeChange = (value: string) => {
    setWorkoutType(value)
    if (value === 'all') {
      removeFilter('type')
    } else {
      updateActiveFilters('type', value)
    }
  }

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range)
    
    if (range?.from) {
      const dateLabel = range.to 
        ? `${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d')}`
        : `From ${format(range.from, 'MMM d')}`
      
      updateActiveFilters('date', dateLabel)
    } else {
      removeFilter('date')
    }
  }

  const updateActiveFilters = (key: string, value: string) => {
    if (!value) {
      removeFilter(key)
      return
    }
    
    setActiveFilters(prev => {
      const filtered = prev.filter(filter => !filter.startsWith(key + ':'))
      return [...filtered, `${key}:${value}`]
    })
  }

  const removeFilter = (key: string) => {
    setActiveFilters(prev => prev.filter(filter => !filter.startsWith(key + ':')))
    
    if (key === 'type') setWorkoutType('all')
    if (key === 'date') setDateRange(undefined)
    if (key === 'search') setSearchQuery('')
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setWorkoutType('all')
    setDateRange(undefined)
    setActiveFilters([])
  }

  const handleSearch = () => {
    if (searchQuery) {
      updateActiveFilters('search', searchQuery)
    } else {
      removeFilter('search')
    }
  }

  return (
    <Card className="p-5 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Select value={workoutType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Workout type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="strength">Strength</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="flexibility">Flexibility</SelectItem>
            <SelectItem value="hiit">HIIT</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd')} - {format(dateRange.to, 'LLL dd')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd')
                )
              ) : (
                <span>Date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        <Button onClick={handleSearch} className="md:px-3">
          <FilterIcon className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Filter</span>
        </Button>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground flex items-center">
            <SlidersHorizontalIcon className="mr-1 h-3 w-3" />
            Active filters:
          </span>
          
          {activeFilters.map((filter) => {
            const [key, value] = filter.split(':')
            return (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                <span className="font-medium">{key}:</span> {value}
                <button
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                  onClick={() => removeFilter(key)}
                >
                  <span className="sr-only">Remove</span>
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 12 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M1.5 1.5L10.5 10.5M1.5 10.5L10.5 1.5" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                    />
                  </svg>
                </button>
              </Badge>
            )
          })}
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearAllFilters} 
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </Card>
  )
} 