'use client'

import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, User as UserIcon, Target, TrendingUp } from 'lucide-react'

interface ProfileDisplayProps {
  user: User
  profileData: any // Replace with proper type later
  onEdit: () => void
}

export default function ProfileDisplay({
  user,
  profileData,
  onEdit,
}: ProfileDisplayProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Profile Overview
          </CardTitle>
          <CardDescription>
            Your personal information and fitness details
          </CardDescription>
        </div>
        <Button onClick={onEdit} variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              Full Name
            </h3>
            <p className="text-lg font-medium">
              {profileData?.name || 'John Doe'}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">Age</h3>
            <p className="text-lg font-medium">
              {profileData?.age || '25'} years
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              Height
            </h3>
            <p className="text-lg font-medium">
              {profileData?.height || '175'} cm
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-muted-foreground">
              Weight
            </h3>
            <p className="text-lg font-medium">
              {profileData?.weight || '70'} kg
            </p>
          </div>
        </div>

        {/* Fitness Information */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Fitness Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Fitness Level
              </h4>
              <Badge variant="secondary" className="capitalize">
                {profileData?.fitness_level || 'intermediate'}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">
                Primary Goal
              </h4>
              <Badge variant="outline" className="capitalize">
                <TrendingUp className="h-3 w-3 mr-1" />
                {profileData?.goal?.replace('-', ' ') || 'gain muscle'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {profileData?.bio && (
          <div className="border-t pt-6">
            <h3 className="font-medium mb-2">About Me</h3>
            <p className="text-muted-foreground leading-relaxed">
              {profileData.bio}
            </p>
          </div>
        )}

        {/* Dummy Statistics */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-xs text-muted-foreground">Workouts</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">23</div>
              <div className="text-xs text-muted-foreground">Days Active</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-xs text-muted-foreground">PR's Set</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-xs text-muted-foreground">Goal Progress</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
