import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

interface EmptyExercisesStateProps {
  groupName: string
}

export function EmptyExercisesState({ groupName }: EmptyExercisesStateProps) {
  return (
    <div className="col-span-full text-center py-8">
      <p className="text-muted-foreground">
        No exercises found for {groupName}
      </p>
      <Button className="mt-4" size="sm">
        <PlusCircle className="h-4 w-4 mr-2" />
        Add {groupName} Exercise
      </Button>
    </div>
  )
}
