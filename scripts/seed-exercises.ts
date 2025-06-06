import prisma from '@/lib/prisma'


// name: name of the exercise
// body_region: (UPPER, LOWER, FULL)
// primary_bodypart: (Chest, Triceps, Biceps, Quads, Glutes, Hamstrings, Calves, Back, Abs, Shoulders)
// secondary_bodypart: (optional) (Chest, Triceps, Biceps, Quads, Glutes, Hamstrings, Calves, Back, Abs, Shoulders)
// category: (Push, Pull, Legs, Core)
// level: (Beginner, Intermediate, Advanced)
// is_default: (true)
// created_by: (null)

const defaultExercises = [
  // Push Exercises - Upper Body
  {
    name: "Push-up",
    body_region: "UPPER",
    primary_bodypart: "Chest",
    secondary_bodypart: "Triceps",
    category: "Push",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Incline Bench Press",
    body_region: "UPPER",
    primary_bodypart: "Chest",
    secondary_bodypart: "Shoulders",
    category: "Push",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Dumbbell Press",
    body_region: "UPPER",
    primary_bodypart: "Chest",
    secondary_bodypart: "Triceps",
    category: "Push",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Overhead Press",
    body_region: "UPPER",
    primary_bodypart: "Shoulders",
    secondary_bodypart: "Triceps",
    category: "Push",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Shoulder Press",
    body_region: "UPPER",
    primary_bodypart: "Shoulders",
    secondary_bodypart: "Triceps",
    category: "Push",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Lateral Raise",
    body_region: "UPPER",
    primary_bodypart: "Shoulders",
    secondary_bodypart: null,
    category: "Push",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Dips",
    body_region: "UPPER",
    primary_bodypart: "Triceps",
    secondary_bodypart: "Chest",
    category: "Push",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Close-Grip Bench Press",
    body_region: "UPPER",
    primary_bodypart: "Triceps",
    secondary_bodypart: "Chest",
    category: "Push",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Tricep Extension",
    body_region: "UPPER",
    primary_bodypart: "Triceps",
    secondary_bodypart: null,
    category: "Push",
    level: "Beginner",
    is_default: true,
    created_by: null
  },

  // Pull Exercises - Upper Body
  {
    name: "Pull-up",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Chin-up",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Lat Pulldown",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Bent-Over Row",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Seated Cable Row",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "T-Bar Row",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Single-Arm Dumbbell Row",
    body_region: "UPPER",
    primary_bodypart: "Back",
    secondary_bodypart: "Biceps",
    category: "Pull",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Face Pull",
    body_region: "UPPER",
    primary_bodypart: "Shoulders",
    secondary_bodypart: "Back",
    category: "Pull",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Bicep Curl",
    body_region: "UPPER",
    primary_bodypart: "Biceps",
    secondary_bodypart: null,
    category: "Pull",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Hammer Curl",
    body_region: "UPPER",
    primary_bodypart: "Biceps",
    secondary_bodypart: null,
    category: "Pull",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Preacher Curl",
    body_region: "UPPER",
    primary_bodypart: "Biceps",
    secondary_bodypart: null,
    category: "Pull",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },

  // Leg Exercises
  {
    name: "Front Squat",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Goblet Squat",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Deadlift",
    body_region: "FULL",
    primary_bodypart: "Hamstrings",
    secondary_bodypart: "Back",
    category: "Legs",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Romanian Deadlift",
    body_region: "LOWER",
    primary_bodypart: "Hamstrings",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Leg Press",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Leg Curl",
    body_region: "LOWER",
    primary_bodypart: "Hamstrings",
    secondary_bodypart: null,
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Leg Extension",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: null,
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Lunge",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Bulgarian Split Squat",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Step-Up",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Glutes",
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Hip Thrust",
    body_region: "LOWER",
    primary_bodypart: "Glutes",
    secondary_bodypart: "Hamstrings",
    category: "Legs",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Calf Raise",
    body_region: "LOWER",
    primary_bodypart: "Calves",
    secondary_bodypart: null,
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Seated Calf Raise",
    body_region: "LOWER",
    primary_bodypart: "Calves",
    secondary_bodypart: null,
    category: "Legs",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Sumo Deadlift",
    body_region: "LOWER",
    primary_bodypart: "Glutes",
    secondary_bodypart: "Hamstrings",
    category: "Legs",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },

  // Core Exercises
  {
    name: "Plank",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: null,
    category: "Core",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Crunch",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: null,
    category: "Core",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Russian Twist",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: null,
    category: "Core",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Mountain Climber",
    body_region: "FULL",
    primary_bodypart: "Abs",
    secondary_bodypart: "Shoulders",
    category: "Core",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Dead Bug",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: null,
    category: "Core",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Bicycle Crunch",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: null,
    category: "Core",
    level: "Beginner",
    is_default: true,
    created_by: null
  },
  {
    name: "Hanging Leg Raise",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: null,
    category: "Core",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Ab Wheel Rollout",
    body_region: "UPPER",
    primary_bodypart: "Abs",
    secondary_bodypart: "Shoulders",
    category: "Core",
    level: "Advanced",
    is_default: true,
    created_by: null
  },

  // Full Body / Compound Exercises
  {
    name: "Burpee",
    body_region: "FULL",
    primary_bodypart: "Abs",
    secondary_bodypart: "Chest",
    category: "Core",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Thruster",
    body_region: "FULL",
    primary_bodypart: "Shoulders",
    secondary_bodypart: "Quads",
    category: "Push",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Clean and Press",
    body_region: "FULL",
    primary_bodypart: "Shoulders",
    secondary_bodypart: "Back",
    category: "Pull",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Farmer's Walk",
    body_region: "FULL",
    primary_bodypart: "Back",
    secondary_bodypart: "Abs",
    category: "Pull",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Turkish Get-Up",
    body_region: "FULL",
    primary_bodypart: "Abs",
    secondary_bodypart: "Shoulders",
    category: "Core",
    level: "Advanced",
    is_default: true,
    created_by: null
  },
  {
    name: "Kettlebell Swing",
    body_region: "FULL",
    primary_bodypart: "Glutes",
    secondary_bodypart: "Hamstrings",
    category: "Legs",
    level: "Intermediate",
    is_default: true,
    created_by: null
  },
  {
    name: "Box Jump",
    body_region: "LOWER",
    primary_bodypart: "Quads",
    secondary_bodypart: "Calves",
    category: "Legs",
    level: "Intermediate",
    is_default: true,
    created_by: null
  }
]

async function seedExercises() {
  try {
    const result = await prisma.excercise.createMany({
      data: defaultExercises,
      skipDuplicates: true // Prevents errors if some already exist
    })
    console.log(`Created ${result.count} exercises`)
  } catch (error) {
    console.error('Error seeding exercises:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedExercises()