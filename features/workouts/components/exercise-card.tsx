import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Exercise {
  id: bigint
  name: string
  level?: string | null
  primary_bodypart: string
  secondary_bodypart?: string | null
  category?: string | null
}

interface ExerciseCardProps {
  exercise: Exercise
}

// Color mappings for different categories and body parts
const getCategoryColor = (category: string | null | undefined) => {
  switch (category?.toLowerCase()) {
    case 'push':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'pull':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'legs':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'core':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const getLevelColor = (level: string | null | undefined) => {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'advanced':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
            {exercise.name}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`ml-2 text-xs font-medium ${getLevelColor(exercise.level)}`}
          >
            {exercise.level || 'Beginner'}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge 
            variant="outline" 
            className={`text-xs font-medium ${getCategoryColor(exercise.category)}`}
          >
            {exercise.category || 'General'}
          </Badge>
          
          <Badge variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-700">
            {exercise.primary_bodypart}
          </Badge>
          
          {exercise.secondary_bodypart && (
            <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
              {exercise.secondary_bodypart}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardFooter className="pt-0">
        <Button variant="secondary" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
          <Link
            href={`/protected/dashboard/workouts/exercise/${exercise.id.toString()}`}
          >
            Record set
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
