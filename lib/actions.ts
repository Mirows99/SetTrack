'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import webpush from 'web-push'

// Validation schemas
const CreateExerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  primary_bodypart: z.string().min(1, 'Primary bodypart is required'),
  secondary_bodypart: z.string().optional(),
  category: z.string().optional(),
  level: z.string().optional(),
  created_by: z.string().uuid().optional(),
})

const CreateSetSchema = z.object({
  exercise: z.bigint(),
  reps: z.number().int().positive().optional(),
  weight: z.number().positive().optional(),
  intensity: z.string().optional(),
  notes: z.string().optional(),
  user_id: z.string().uuid().optional(),
})

const CreateUserPreferenceSchema = z.object({
  user_id: z.string().uuid().optional(),
  exercise_id: z.bigint(),
  preference_level: z.number().int().min(1).max(10).optional(),
  notes: z.string().optional(),
})

const CreateWorkoutTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  user_id: z.string().uuid().optional(),
})

// Exercise Actions
export async function createExercise(
  data: z.infer<typeof CreateExerciseSchema>
) {
  try {
    const validatedData = CreateExerciseSchema.parse(data)

    const exercise = await prisma.excercise.create({
      data: validatedData,
    })

    revalidatePath('/exercises')
    return { success: true, data: exercise }
  } catch (error) {
    console.error('Error creating exercise:', error)
    return { success: false, error: 'Failed to create exercise' }
  }
}

export async function getExercises(limit?: number) {
  try {
    const exercises = await prisma.excercise.findMany({
      take: limit,
      include: {
        sets: true,
        user_preferences: true,
        excercise_preset: true,
      },
    })

    return { success: true, data: exercises }
  } catch (error) {
    console.error('Error fetching exercises:', error)
    return { success: false, error: 'Failed to fetch exercises' }
  }
}

export async function getExerciseById(id: bigint) {
  try {
    const exercise = await prisma.excercise.findUnique({
      where: { id },
      include: {
        sets: true,
        user_preferences: true,
        excercise_preset: true,
      },
    })

    return { success: true, data: exercise }
  } catch (error) {
    console.error('Error fetching exercise:', error)
    return { success: false, error: 'Failed to fetch exercise' }
  }
}

export async function updateExercise(
  id: bigint,
  data: Partial<z.infer<typeof CreateExerciseSchema>>
) {
  try {
    const exercise = await prisma.excercise.update({
      where: { id },
      data,
    })

    revalidatePath('/exercises')
    return { success: true, data: exercise }
  } catch (error) {
    console.error('Error updating exercise:', error)
    return { success: false, error: 'Failed to update exercise' }
  }
}

export async function deleteExercise(id: bigint) {
  try {
    await prisma.excercise.delete({
      where: { id },
    })

    revalidatePath('/exercises')
    return { success: true }
  } catch (error) {
    console.error('Error deleting exercise:', error)
    return { success: false, error: 'Failed to delete exercise' }
  }
}

// Sets Actions
export async function createSet(data: z.infer<typeof CreateSetSchema>) {
  try {
    const validatedData = CreateSetSchema.parse(data)

    const set = await prisma.sets.create({
      data: validatedData,
      include: {
        excercise: true,
      },
    })

    revalidatePath('/workouts')
    return { success: true, data: set }
  } catch (error) {
    console.error('Error creating set:', error)
    return { success: false, error: 'Failed to create set' }
  }
}

export async function getSets(userId?: string, exerciseId?: bigint) {
  try {
    const sets = await prisma.sets.findMany({
      where: {
        ...(userId && { user_id: userId }),
        ...(exerciseId && { exercise: exerciseId }),
      },
      include: {
        excercise: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return { success: true, data: sets }
  } catch (error) {
    console.error('Error fetching sets:', error)
    return { success: false, error: 'Failed to fetch sets' }
  }
}

export async function updateSet(
  id: bigint,
  data: Partial<z.infer<typeof CreateSetSchema>>
) {
  try {
    const set = await prisma.sets.update({
      where: { id },
      data,
      include: {
        excercise: true,
      },
    })

    revalidatePath('/workouts')
    return { success: true, data: set }
  } catch (error) {
    console.error('Error updating set:', error)
    return { success: false, error: 'Failed to update set' }
  }
}

export async function deleteSet(id: bigint) {
  try {
    await prisma.sets.delete({
      where: { id },
    })

    revalidatePath('/workouts')
    return { success: true }
  } catch (error) {
    console.error('Error deleting set:', error)
    return { success: false, error: 'Failed to delete set' }
  }
}

// User Preferences Actions
export async function createUserPreference(
  data: z.infer<typeof CreateUserPreferenceSchema>
) {
  try {
    const validatedData = CreateUserPreferenceSchema.parse(data)

    const preference = await prisma.user_preferences.create({
      data: validatedData,
      include: {
        excercise: true,
      },
    })

    revalidatePath('/preferences')
    return { success: true, data: preference }
  } catch (error) {
    console.error('Error creating user preference:', error)
    return { success: false, error: 'Failed to create user preference' }
  }
}

export async function getUserPreferences(userId: string) {
  try {
    const preferences = await prisma.user_preferences.findMany({
      where: { user_id: userId },
      include: {
        excercise: true,
      },
    })

    return { success: true, data: preferences }
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return { success: false, error: 'Failed to fetch user preferences' }
  }
}

export async function updateUserPreference(
  id: bigint,
  data: Partial<z.infer<typeof CreateUserPreferenceSchema>>
) {
  try {
    const preference = await prisma.user_preferences.update({
      where: { id },
      data,
      include: {
        excercise: true,
      },
    })

    revalidatePath('/preferences')
    return { success: true, data: preference }
  } catch (error) {
    console.error('Error updating user preference:', error)
    return { success: false, error: 'Failed to update user preference' }
  }
}

export async function deleteUserPreference(id: bigint) {
  try {
    await prisma.user_preferences.delete({
      where: { id },
    })

    revalidatePath('/preferences')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user preference:', error)
    return { success: false, error: 'Failed to delete user preference' }
  }
}

// Workout Templates Actions
export async function createWorkoutTemplate(
  data: z.infer<typeof CreateWorkoutTemplateSchema>
) {
  try {
    const validatedData = CreateWorkoutTemplateSchema.parse(data)

    const template = await prisma.workout_templates.create({
      data: validatedData,
    })

    revalidatePath('/templates')
    return { success: true, data: template }
  } catch (error) {
    console.error('Error creating workout template:', error)
    return { success: false, error: 'Failed to create workout template' }
  }
}

export async function getWorkoutTemplates(userId?: string) {
  try {
    const templates = await prisma.workout_templates.findMany({
      where: userId ? { user_id: userId } : {},
      include: {
        excercise_preset: {
          include: {
            excercise: true,
          },
        },
      },
    })

    return { success: true, data: templates }
  } catch (error) {
    console.error('Error fetching workout templates:', error)
    return { success: false, error: 'Failed to fetch workout templates' }
  }
}

export async function getWorkoutTemplateById(id: bigint) {
  try {
    const template = await prisma.workout_templates.findUnique({
      where: { id },
      include: {
        excercise_preset: {
          include: {
            excercise: true,
          },
        },
      },
    })

    return { success: true, data: template }
  } catch (error) {
    console.error('Error fetching workout template:', error)
    return { success: false, error: 'Failed to fetch workout template' }
  }
}

export async function updateWorkoutTemplate(
  id: bigint,
  data: Partial<z.infer<typeof CreateWorkoutTemplateSchema>>
) {
  try {
    const template = await prisma.workout_templates.update({
      where: { id },
      data,
    })

    revalidatePath('/templates')
    return { success: true, data: template }
  } catch (error) {
    console.error('Error updating workout template:', error)
    return { success: false, error: 'Failed to update workout template' }
  }
}

export async function deleteWorkoutTemplate(id: bigint) {
  try {
    await prisma.workout_templates.delete({
      where: { id },
    })

    revalidatePath('/templates')
    return { success: true }
  } catch (error) {
    console.error('Error deleting workout template:', error)
    return { success: false, error: 'Failed to delete workout template' }
  }
}

// User Profile Actions
export async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.user_profiles.findFirst({
      where: { user_id: userId },
    })

    return { success: true, data: profile }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { success: false, error: 'Failed to fetch user profile' }
  }
}

export async function createOrUpdateUserProfile(
  userId: string,
  data: {
    name?: string
    age?: number
    weight?: number
    fitness_level?: string
    goal?: string
    weight_history?: number[]
  }
) {
  try {
    // First try to find existing profile
    const existingProfile = await prisma.user_profiles.findFirst({
      where: { user_id: userId },
    })

    let profile
    if (existingProfile) {
      // Update existing profile
      profile = await prisma.user_profiles.update({
        where: { id: existingProfile.id },
        data,
      })
    } else {
      // Create new profile
      profile = await prisma.user_profiles.create({
        data: {
          user_id: userId,
          ...data,
        },
      })
    }

    revalidatePath('/profile')
    return { success: true, data: profile }
  } catch (error) {
    console.error('Error creating/updating user profile:', error)
    return { success: false, error: 'Failed to create/update user profile' }
  }
}

// Search and Filter Actions
export async function searchExercises(
  query: string,
  bodypart?: string,
  category?: string
) {
  try {
    const exercises = await prisma.excercise.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { primary_bodypart: { contains: query, mode: 'insensitive' } },
              { secondary_bodypart: { contains: query, mode: 'insensitive' } },
            ],
          },
          bodypart
            ? { primary_bodypart: { equals: bodypart, mode: 'insensitive' } }
            : {},
          category
            ? { category: { equals: category, mode: 'insensitive' } }
            : {},
        ],
      },
      include: {
        sets: true,
        user_preferences: true,
      },
    })

    return { success: true, data: exercises }
  } catch (error) {
    console.error('Error searching exercises:', error)
    return { success: false, error: 'Failed to search exercises' }
  }
}

export async function getWorkoutStats(
  userId: string,
  dateFrom?: Date,
  dateTo?: Date
) {
  try {
    const stats = await prisma.sets.aggregate({
      where: {
        user_id: userId,
        ...(dateFrom &&
          dateTo && {
            created_at: {
              gte: dateFrom,
              lte: dateTo,
            },
          }),
      },
      _count: {
        id: true,
      },
      _sum: {
        weight: true,
        reps: true,
      },
      _avg: {
        weight: true,
        reps: true,
      },
    })

    return { success: true, data: stats }
  } catch (error) {
    console.error('Error fetching workout stats:', error)
    return { success: false, error: 'Failed to fetch workout stats' }
  }
}


webpush.setVapidDetails(
  'mailto:elias.ode@hansenexus.de',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
 
let subscription: PushSubscription | null = null
 
export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}
 
export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}
 
export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }
 
  try {
    await webpush.sendNotification(
      { // check this if something behaves weird
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.getKey('p256dh') ? Buffer.from(subscription.getKey('p256dh')!).toString('base64') : '',
          auth: subscription.getKey('auth') ? Buffer.from(subscription.getKey('auth')!).toString('base64') : '',
        },
      },
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}