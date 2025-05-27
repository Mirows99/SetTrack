# Prisma Server Actions

This project includes comprehensive server actions for interacting with your Prisma database from client components. Server actions provide a secure way to perform database operations without exposing your database credentials to the client.

## Available Actions

### Exercise Actions

- `createExercise(data)` - Create a new exercise
- `getExercises(limit?)` - Get all exercises with optional limit
- `getExerciseById(id)` - Get a specific exercise by ID
- `updateExercise(id, data)` - Update an exercise
- `deleteExercise(id)` - Delete an exercise
- `searchExercises(query, bodypart?, category?)` - Search exercises with filters

### Set Actions

- `createSet(data)` - Log a new workout set
- `getSets(userId?, exerciseId?)` - Get sets with optional filters
- `updateSet(id, data)` - Update a set
- `deleteSet(id)` - Delete a set

### User Preference Actions

- `createUserPreference(data)` - Create a user preference for an exercise
- `getUserPreferences(userId)` - Get all preferences for a user
- `updateUserPreference(id, data)` - Update a preference
- `deleteUserPreference(id)` - Delete a preference

### Workout Template Actions

- `createWorkoutTemplate(data)` - Create a new workout template
- `getWorkoutTemplates(userId?)` - Get templates with optional user filter
- `getWorkoutTemplateById(id)` - Get a specific template
- `updateWorkoutTemplate(id, data)` - Update a template
- `deleteWorkoutTemplate(id)` - Delete a template

### User Profile Actions

- `getUserProfile(userId)` - Get user profile
- `createOrUpdateUserProfile(userId, data)` - Create or update user profile

### Statistics Actions

- `getWorkoutStats(userId, dateFrom?, dateTo?)` - Get workout statistics

## Usage in Client Components

### Basic Example

```tsx
'use client'

import { useState, useEffect } from 'react'
import { getExercises, createSet } from '@/lib/actions'

export default function WorkoutLogger() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(false)

  // Load exercises on mount
  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    setLoading(true)
    try {
      const result = await getExercises(10)
      if (result.success) {
        setExercises(result.data)
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
    } finally {
      setLoading(false)
    }
  }

  const logSet = async (exerciseId: bigint, reps: number, weight: number) => {
    try {
      const result = await createSet({
        exercise: exerciseId,
        reps,
        weight,
        user_id: 'your-user-id' // Get from auth context
      })

      if (result.success) {
        console.log('Set logged successfully!')
      } else {
        console.error('Error:', result.error)
      }
    } catch (error) {
      console.error('Error logging set:', error)
    }
  }

  return (
    <div>
      {/* Your component JSX */}
    </div>
  )
}
```

### Error Handling

All server actions return a consistent response format:

```typescript
{
  success: boolean
  data?: any        // Present if success is true
  error?: string    // Present if success is false
}
```

Always check the `success` property before using the data:

```typescript
const result = await createExercise({ name: 'Push-ups', primary_bodypart: 'Chest' })

if (result.success) {
  // Use result.data
  console.log('Created exercise:', result.data)
} else {
  // Handle error
  console.error('Error:', result.error)
}
```

### Working with BigInt IDs

Since Prisma uses BigInt for auto-incrementing IDs, you need to handle them properly:

```typescript
// Converting BigInt to string for display or storage
const exerciseId = exercise.id.toString()

// Converting string back to BigInt for database operations
const result = await getExerciseById(BigInt(exerciseId))

// In forms, use string values and convert when needed
const [selectedExercise, setSelectedExercise] = useState<bigint | null>(null)

// In select onChange
onChange={(e) => setSelectedExercise(e.target.value ? BigInt(e.target.value) : null)}
```

### Data Validation

The server actions include Zod validation schemas. Here are the expected data formats:

#### Exercise Data
```typescript
{
  name: string                    // Required
  primary_bodypart: string        // Required
  secondary_bodypart?: string     // Optional
  category?: string               // Optional
  level?: string                  // Optional
  created_by?: string             // Optional UUID
}
```

#### Set Data
```typescript
{
  exercise: bigint               // Required - Exercise ID
  reps?: number                  // Optional - Positive integer
  weight?: number                // Optional - Positive number
  intensity?: string             // Optional
  notes?: string                 // Optional
  user_id?: string               // Optional UUID
}
```

#### User Preference Data
```typescript
{
  user_id?: string               // Optional UUID
  exercise_id: bigint            // Required - Exercise ID
  preference_level?: number      // Optional - 1-10
  notes?: string                 // Optional
}
```

### Authentication Integration

To integrate with your authentication system, modify the actions to get the user ID from your auth context:

```typescript
import { getUser } from '@/lib/auth' // Your auth utility

const logSet = async (exerciseId: bigint, reps: number, weight: number) => {
  const user = await getUser()
  
  const result = await createSet({
    exercise: exerciseId,
    reps,
    weight,
    user_id: user.id
  })
  
  // Handle result...
}
```

### Cache Revalidation

The server actions automatically revalidate relevant paths using `revalidatePath()`. This ensures your UI stays in sync with the database:

- Exercise actions revalidate `/exercises`
- Set actions revalidate `/workouts`
- Preference actions revalidate `/preferences`
- Template actions revalidate `/templates`
- Profile actions revalidate `/profile`

## Example Component

Check out `components/example-client-component.tsx` for a complete example showing how to:

- Load and display data
- Create new records
- Handle form submissions
- Search and filter
- Handle loading states
- Display error messages

## Environment Setup

Make sure your `.env` file includes:

```
DATABASE_URL="your-postgresql-connection-string"
```

And that you've run:

```bash
npm install
npx prisma generate
npx prisma db push  # or npx prisma migrate dev
```

## Type Safety

The actions are fully typed using the generated Prisma types. TypeScript will catch type errors at compile time, ensuring data integrity.

## Performance Considerations

- Use pagination by passing a `limit` parameter to `getExercises()`
- Filter data at the database level using the provided filter parameters
- The actions include optimized queries with proper `include` statements
- Database indexes should be added for frequently queried fields

## Security

- All database operations happen on the server
- Input validation using Zod schemas
- No database credentials exposed to the client
- Use proper authentication to secure user-specific actions 