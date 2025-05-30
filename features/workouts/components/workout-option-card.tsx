import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlayCircle, Clipboard, Brain, LucideIcon } from 'lucide-react'

export enum WorkoutOptionType {
  QUICK_START = 'quick-start',
  USE_TEMPLATE = 'use-template',
  GENERATE_WORKOUT = 'generate-workout',
}

interface WorkoutOption {
  icon: LucideIcon
  title: string
  description: string
  href: string
  buttonText: string
}

interface WorkoutOptionCardProps {
  type: WorkoutOptionType
}

const workoutOptions: Record<WorkoutOptionType, WorkoutOption> = {
  [WorkoutOptionType.QUICK_START]: {
    icon: PlayCircle,
    title: 'Quick Start',
    description:
      'Start tracking a workout right away without any template. Build your workout as you go.',
    href: '/protected/dashboard/workouts/quick-start',
    buttonText: 'Start Workout',
  },
  [WorkoutOptionType.USE_TEMPLATE]: {
    icon: Clipboard,
    title: 'Use Template',
    description:
      'Choose from your saved workout templates or create a new one to use for your session.',
    href: '/protected/dashboard/workouts/templates',
    buttonText: 'Use Template',
  },
  [WorkoutOptionType.GENERATE_WORKOUT]: {
    icon: Brain,
    title: 'Generate Workout',
    description:
      'Let us build a personalized workout for you based on your goals and available equipment.',
    href: '/protected/dashboard/workouts/generate',
    buttonText: 'Generate Workout',
  },
}

export function WorkoutOptionCard({ type }: WorkoutOptionCardProps) {
  const option = workoutOptions[type]
  const Icon = option.icon

  return (
    <div className="border rounded-lg p-6 flex flex-col h-full justify-between hover:border-primary/50 transition-colors">
      <div className="space-y-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold">{option.title}</h2>
        <p className="text-muted-foreground">{option.description}</p>
      </div>
      <Button asChild className="mt-6 w-full">
        <Link href={option.href}>{option.buttonText}</Link>
      </Button>
    </div>
  )
}
