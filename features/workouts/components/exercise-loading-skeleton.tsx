import { Card } from '@/components/ui/card'

export default function ExerciseLoadingSkeleton() {
  return (
    <div className="container py-6 space-y-6 relative pb-24">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-muted rounded-md animate-pulse" />
        <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Tags Skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-7 w-16 bg-muted rounded-md animate-pulse" />
        <div className="h-7 w-20 bg-muted rounded-md animate-pulse" />
        <div className="h-7 w-14 bg-muted rounded-md animate-pulse" />
      </div>

      {/* Analytics Card Skeleton */}
      <div className="h-32 bg-muted rounded-lg animate-pulse" />

      {/* Sets History Skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-5 w-32 bg-muted rounded-md animate-pulse" />
          <Card className="overflow-hidden">
            <div className="divide-y">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-6 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button Skeleton */}
      <div className="h-14 w-14 bg-muted rounded-full fixed bottom-20 right-4 animate-pulse" />
    </div>
  )
}
