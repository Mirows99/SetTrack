"use client";

import { useState } from "react";
import Link from "next/link";
import { BarChart3, ChevronDown, ChevronUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AnalyticsCardProps {
  exerciseId: string;
}

export function AnalyticsCard({ exerciseId }: AnalyticsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="cursor-pointer hover:border-primary/50 transition-colors">
      <CardHeader
        className="flex flex-row items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics
          </CardTitle>
          <CardDescription>
            View your performance trends and progress
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      {isExpanded && (
        <>
          <CardContent>
            <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">
                Performance graph will be shown here
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="w-full" asChild>
              <Link
                href={`/protected/dashboard/workouts/exercise/${exerciseId}/analytics`}
              >
                View Detailed Analytics
              </Link>
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
