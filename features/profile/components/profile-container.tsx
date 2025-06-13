'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { getUserProfile } from '@/lib/actions'
import ProfileForm from './profile-form'
import ProfileDisplay from './profile-display'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface ProfileContainerProps {
  user: User
}

export default function ProfileContainer({ user }: ProfileContainerProps) {
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [user.id])

  const loadProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserProfile(user.id)

      if (result.success) {
        setProfileData(result.data)
      } else {
        setError(result.error || 'Failed to load profile')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleFormSuccess = () => {
    setIsEditing(false)
    loadProfile() // Reload profile data
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    )
  }

  if (!profileData || isEditing) {
    return (
      <ProfileForm
        user={user}
        existingData={profileData}
        onSuccess={handleFormSuccess}
        onCancel={profileData ? handleCancel : undefined}
      />
    )
  }

  return (
    <ProfileDisplay user={user} profileData={profileData} onEdit={handleEdit} />
  )
}
