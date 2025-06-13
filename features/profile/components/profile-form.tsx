'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { createOrUpdateUserProfile } from '@/lib/actions'

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  age: z.coerce.number().min(1, {
    message: 'Age must be a positive number.',
  }),
  gender: z.string().min(1, {
    message: 'Please select a gender.',
  }),
  height: z.coerce.number().min(1, {
    message: 'Height must be a positive number.',
  }),
  weight: z.coerce.number().min(1, {
    message: 'Weight must be a positive number.',
  }),
  fitnessLevel: z.string().min(1, {
    message: 'Please select a fitness level.',
  }),
  goal: z.string().min(1, {
    message: 'Please select a goal.',
  }),
  bio: z.string().max(500, {
    message: 'Bio must not be longer than 500 characters.',
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
  user: User
  existingData?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export default function ProfileForm({
  user,
  existingData,
  onSuccess,
  onCancel,
}: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false)

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    fullName: existingData?.name || '',
    age: existingData?.age || 0,
    gender: existingData?.gender || '',
    height: existingData?.height || 0,
    weight: existingData?.weight || 0,
    fitnessLevel: existingData?.fitness_level || '',
    goal: existingData?.goal || '',
    bio: existingData?.bio || '',
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  // Update form values when existingData changes
  useEffect(() => {
    if (existingData) {
      form.reset({
        fullName: existingData.name || '',
        age: existingData.age || 0,
        gender: existingData.gender || '',
        height: existingData.height || 0,
        weight: existingData.weight || 0,
        fitnessLevel: existingData.fitness_level || '',
        goal: existingData.goal || '',
        bio: existingData.bio || '',
      })
    }
  }, [existingData, form])

  async function onSubmit(data: ProfileFormValues) {
    setIsSaving(true)

    try {
      const result = await createOrUpdateUserProfile(user.id, {
        name: data.fullName,
        age: data.age,
        weight: data.weight,
        fitness_level: data.fitnessLevel,
        goal: data.goal,
        gender: data.gender,
        bio: data.bio,
        height: data.height.toString(), // Convert number to string as per schema
      })

      if (result.success) {
        toast.success(
          existingData
            ? 'Profile updated successfully'
            : 'Profile created successfully'
        )
        onSuccess?.()
      } else {
        toast.error(result.error || 'Failed to save profile')
      }
    } catch (error) {
      toast.error('Failed to save profile')
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingData ? 'Edit Profile' : 'Create Your Profile'}
        </CardTitle>
        <CardDescription>
          {existingData
            ? 'Update your profile information and preferences'
            : 'Tell us about yourself to get personalized workout recommendations'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="overflow-hidden">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fitness Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lose-weight">Lose Weight</SelectItem>
                        <SelectItem value="gain-muscle">Gain Muscle</SelectItem>
                        <SelectItem value="improve-health">
                          Improve Health
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a bit about yourself and your fitness journey"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share your fitness story and what motivates you.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? 'Saving...'
                  : existingData
                    ? 'Update Profile'
                    : 'Create Profile'}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
