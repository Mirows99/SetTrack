'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

interface TimerContextType {
  isRunning: boolean
  timeRemaining: number
  startTimer: (duration?: number) => void
  stopTimer: () => void
  pauseTimer: () => void
  resumeTimer: () => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function useTimer() {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}

interface TimerProviderProps {
  children: ReactNode
}

export function TimerProvider({ children }: TimerProviderProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const startTimer = (duration: number = 90) => {
    // Stop any existing timer
    if (intervalId) {
      clearInterval(intervalId)
    }

    setTimeRemaining(duration)
    setIsRunning(true)

    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          clearInterval(id)
          setIntervalId(null)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setIntervalId(id)
  }

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsRunning(false)
    setTimeRemaining(0)
  }

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsRunning(false)
  }

  const resumeTimer = () => {
    if (timeRemaining > 0) {
      setIsRunning(true)
      const id = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            clearInterval(id)
            setIntervalId(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      setIntervalId(id)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [intervalId])

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        timeRemaining,
        startTimer,
        stopTimer,
        pauseTimer,
        resumeTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}
