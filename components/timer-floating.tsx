'use client'

import { useState, useCallback } from 'react'

import {
  DndContext,
  useDraggable,
  DragEndEvent,
  closestCenter,
  Modifier,
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'
import { useTimer } from '@/providers/timer-provider'

function DraggableTimer({ position }: { position: { x: number; y: number } }) {
  const { timeRemaining } = useTimer()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: dndIsDragging,
  } = useDraggable({
    id: 'floating-timer',
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const progress = timeRemaining / 90 // Assuming 90 seconds default
  const circumference = 2 * Math.PI * 20 // radius of 20
  const strokeDashoffset = circumference - progress * circumference

  // Don't render if no timer is active
  if (timeRemaining === 0) {
    return null
  }

  // Combine the base position with the current drag transform
  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0) ${
      transform ? CSS.Transform.toString(transform) : ''
    }`.trim(),
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-2xl shadow-lg border p-4 min-w-[120px] cursor-grab transition-shadow duration-200 select-none touch-none',
        dndIsDragging
          ? 'border-blue-500 border-2 shadow-xl cursor-grabbing'
          : 'border-gray-200'
      )}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center justify-center relative">
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
              'transition-all duration-1000 ease-linear',
              timeRemaining <= 10 ? 'text-red-500' : 'text-green-500'
            )}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'text-lg font-bold',
              timeRemaining <= 10 ? 'text-red-500' : 'text-gray-900'
            )}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  )
}

export function FloatingTimer() {
  const { timeRemaining } = useTimer()
  const [position, setPosition] = useState({ x: 16, y: 16 })

  // Custom modifier that accounts for our base position
  const restrictToViewport: Modifier = ({
    transform,
    containerNodeRect,
    draggingNodeRect,
  }) => {
    if (!draggingNodeRect || !containerNodeRect) {
      return transform
    }

    const padding = 16
    const currentX = position.x + transform.x
    const currentY = position.y + transform.y

    // Calculate bounds
    const minX = padding
    const minY = padding
    const maxX = window.innerWidth - draggingNodeRect.width - padding
    const maxY = window.innerHeight - draggingNodeRect.height - padding

    // Constrain the transform based on our base position
    let constrainedX = transform.x
    let constrainedY = transform.y

    if (currentX < minX) {
      constrainedX = minX - position.x
    } else if (currentX > maxX) {
      constrainedX = maxX - position.x
    }

    if (currentY < minY) {
      constrainedY = minY - position.y
    } else if (currentY > maxY) {
      constrainedY = maxY - position.y
    }

    return {
      ...transform,
      x: constrainedX,
      y: constrainedY,
    }
  }

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.delta) {
        const newX = position.x + event.delta.x
        const newY = position.y + event.delta.y

        // Keep timer within viewport bounds with some padding
        const padding = 16
        const timerWidth = 120
        const timerHeight = 120
        const maxX = window.innerWidth - timerWidth - padding
        const maxY = window.innerHeight - timerHeight - padding

        setPosition({
          x: Math.max(padding, Math.min(newX, maxX)),
          y: Math.max(padding, Math.min(newY, maxY)),
        })
      }
    },
    [position]
  )

  // Don't render if no timer is active
  if (timeRemaining === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToViewport]}
      >
        <div className="pointer-events-auto absolute">
          <DraggableTimer position={position} />
        </div>
      </DndContext>
    </div>
  )
}
