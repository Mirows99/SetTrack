import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Exercise {
  id: string;
  name: string;
  level: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Card
      key={exercise.id}
      className="cursor-pointer hover:border-primary/50 transition-colors"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
        <CardDescription>{exercise.level}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          asChild
        >
          <Link
            href={`/protected/dashboard/workouts/exercise/${exercise.id}`}
          >
            Record set
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
} 