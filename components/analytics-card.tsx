'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSupabase } from '@/providers/supabase-provider'

interface AnalyticsCardProps {
  exerciseId: string
}

export function AnalyticsCard({ exerciseId }: AnalyticsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { supabase, user } = useSupabase()

  useEffect(() => {
    if (isExpanded && !imageUrl && user) {
      fetchImage()
    }
  }, [isExpanded, imageUrl, user])

  const fetchImage = async () => {
    if (!user) {
      setError('User not authenticated')
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
      // Use user ID as the top-level folder path for RLS compliance
      const filePath = `${user.id}/IMG_8917.JPG`
      
      // Use Supabase Storage API to create a signed URL for private bucket access
      const { data, error: storageError } = await supabase.storage
        .from('user')
        .createSignedUrl(filePath, 60 * 60) // 1 hour expiry

      if (storageError) {
        throw new Error(`Storage error: ${storageError.message}`)
      }

      if (!data?.signedUrl) {
        throw new Error('No signed URL received from storage')
      }

      setImageUrl(data.signedUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image')
      console.error('Error fetching image:', err)
    } finally {
      setIsLoading(false)
    }
  }

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
            e.stopPropagation()
            setIsExpanded(!isExpanded)
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
            <div className="h-40 bg-muted/30 rounded-md flex items-center justify-center overflow-hidden">
              {isLoading && (
                <p className="text-muted-foreground">Loading image...</p>
              )}
              {error && (
                <p className="text-destructive text-sm">Error: {error}</p>
              )}
              {!user && (
                <p className="text-muted-foreground">Please log in to view content</p>
              )}
              {imageUrl && !isLoading && !error && (
                <Image
                  src={imageUrl}
                  alt="Exercise analytics image"
                  width={300}
                  height={160}
                  className="object-cover w-full h-full rounded-md"
                />
              )}
              {!imageUrl && !isLoading && !error && user && (
                <p className="text-muted-foreground">
                  Performance graph will be shown here
                </p>
              )}
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
  )
}
