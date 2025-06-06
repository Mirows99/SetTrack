'use client'

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useTimer } from '@/providers/timer-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FloatingTimer() {
  const { timeRemaining, stopTimer } = useTimer()
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [position, setPosition] = useState({ x: 16, y: 16 }) // top-4 right-4 equivalent
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const timerRef = useRef<HTMLDivElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = timeRemaining / 90 // Assuming 90 seconds default
  const circumference = 2 * Math.PI * 20 // radius of 20
  const strokeDashoffset = circumference - (progress * circumference)

  // Handle mouse/touch events for dragging
  const handleStart = (clientX: number, clientY: number) => {
    if (!timerRef.current) return
    
    const rect = timerRef.current.getBoundingClientRect()
    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top
    })
    setIsDragging(true)
    setShowCloseButton(true)
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return

    const newX = clientX - dragOffset.x
    const newY = clientY - dragOffset.y
    
    // Keep timer within viewport bounds
    const maxX = window.innerWidth - 120 // min-w-[120px]
    const maxY = window.innerHeight - 120
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }

  const handleEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY)
  }

  const handleMouseUp = () => {
    handleEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    handleMove(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    handleEnd()
  }

  // Add global event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [isDragging, dragOffset])

  const handleTimerClick = () => {
    if (!isDragging) {
      setShowCloseButton(!showCloseButton)
    }
  }

  // Don't render if no timer is active
  if (timeRemaining === 0) {
    return null
  }

  return (
    <div 
      ref={timerRef}
      className={cn(
        "fixed z-50 bg-white rounded-2xl shadow-lg border p-4 min-w-[120px] cursor-pointer transition-all duration-200 select-none",
        showCloseButton || isDragging ? "border-blue-500 border-2" : "border-gray-200",
        isDragging ? "shadow-xl scale-105" : ""
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleTimerClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {showCloseButton && (
        <div className="flex items-center justify-end mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation()
              stopTimer()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-center relative mb-3">
        {/* Circular Progress */}
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 44 44">
          {/* Background circle */}
          <circle
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="22"
            cy="22"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-1000 ease-linear",
              timeRemaining <= 10 ? "text-red-500" : "text-green-500"
            )}
          />
        </svg>
        
        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-lg font-bold",
            timeRemaining <= 10 ? "text-red-500" : "text-gray-900"
          )}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>


    </div>
  )
} 