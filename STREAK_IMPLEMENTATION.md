# Streak Management System - Implementation Guide

## Overview

The Streak Management System (Torus Badges) tracks user activity and awards visual torus badges for maintaining daily streaks. Users earn milestone badges at 1, 3, 6, 12, and 24-month streaks.

## Features

✅ **Daily Streak Tracking** - Monitors consecutive days of activity  
✅ **Torus Badge Visualization** - One torus shape per 30 days of streak  
✅ **Milestone Badges** - Special badges at 1M, 3M, 6M, 12M, 24M streaks  
✅ **Activity Logging** - Tracks 6 types of user activities  
✅ **Streak Protection** - Streak ends only if user misses a full day  
✅ **Dashboard Widget** - Quick streak overview on main dashboard  

## Database Schema

### New Tables Created

```sql
-- Activity tracking
CREATE TABLE user_activity (
  id UUID PRIMARY KEY,
  user_id UUID (FK to profiles),
  activity_date DATE,
  activity_type TEXT ('project_created' | 'feature_added' | 'phase_completed' | 'error_fixed' | 'ai_plan_generated' | 'prompt_generated'),
  activity_data JSONB,
  created_at TIMESTAMP
)

-- Streak management
CREATE TABLE streaks (
  id UUID PRIMARY KEY,
  user_id UUID (FK to profiles, UNIQUE),
  current_streak INT,
  max_streak INT,
  last_activity_date DATE,
  streak_started_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Milestone badges
CREATE TABLE streak_badges (
  id UUID PRIMARY KEY,
  user_id UUID (FK to profiles),
  badge_type TEXT ('1_month' | '3_months' | '6_months' | '12_months' | '24_months'),
  earned_at TIMESTAMP,
  streak_value INT,
  UNIQUE(user_id, badge_type)
)
```

## Setup Steps

### 1. Run Database Migration

Go to **Supabase SQL Editor** and run the entire contents of `db/migrations.sql`:

```bash
# All tables, policies, and triggers are automatically created
```

### 2. New Files Created

- `/app/api/streaks/track/route.ts` - Track activity & update streaks
- `/app/api/streaks/get/route.ts` - Get streak & badge data
- `/components/TorusStreak.tsx` - Main streak display component
- `/components/StreakWidget.tsx` - Compact dashboard widget
- `/lib/streak-utils.ts` - Utility functions & helpers
- `/types/index.ts` - Updated with Streak types

## Integration Guide

### Tracking Activities

Import and call the tracking function whenever a user completes an action:

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// In your action handler
async function createProject(userId: string, projectData: any) {
  // ... create project logic ...
  
  // Track the activity
  await trackUserActivity(userId, 'project_created', {
    project_id: projectId,
    project_name: projectData.name
  })
}
```

### Activity Types

| Activity | Where to Track | Description |
|----------|---|---|
| `project_created` | Project creation page | When user creates a new project |
| `feature_added` | Feature list page | When user adds a feature to project |
| `phase_completed` | Phases page | When user completes a phase |
| `error_fixed` | Error fix assistant | When user fixes an error |
| `ai_plan_generated` | Planner page | When AI generates a plan |
| `prompt_generated` | Prompt generation | When user generates a prompt |

### Example Implementation

**In Project Creation Route** (`/app/api/projects/create/route.ts`):

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

export async function POST(req: NextRequest) {
  const { user_id, project_data } = await req.json()
  
  // Create project
  const project = await createProjectInDB(user_id, project_data)
  
  // Track activity
  await trackUserActivity(user_id, 'project_created', {
    project_id: project.id,
    project_name: project.name
  })
  
  return NextResponse.json({ project })
}
```

**In Dashboard** (`/app/(app)/dashboard/page.tsx`):

```typescript
'use client'

import StreakWidget from '@/components/StreakWidget'
import { useUser } from '@/utils/auth-context'

export default function Dashboard() {
  const { user } = useUser()
  
  return (
    <div>
      {/* Dashboard header */}
      <h1>Dashboard</h1>
      
      {/* Streak widget */}
      {user && <StreakWidget userId={user.id} />}
      
      {/* Rest of dashboard */}
    </div>
  )
}
```

### Displaying Streak Information

**Full Streak Page** (Already Updated):
```bash
/badges  # Shows complete streak info, all badges, milestone achievements
```

**Compact Widget** (Add to Dashboard):
```typescript
<StreakWidget userId={userId} />
```

**Custom Display**:
```typescript
import { getStreakInfo, formatStreakInfo } from '@/lib/streak-utils'

async function MyComponent() {
  const streakData = await getStreakInfo(userId)
  const formatted = formatStreakInfo(streakData.streak)
  
  return (
    <div>
      <p>{formatted.display_text}</p>
      <p>Streak: {formatted.current_streak} days</p>
      <p>Best: {formatted.max_streak} days</p>
    </div>
  )
}
```

## Streak Rules

### When Streaks Update

- ✅ User performs **any** tracked activity on a day
- ✅ Streak increments if last activity was yesterday or today
- ❌ Streak resets if user misses a full day (no activity)

### Examples

```
Day 1: Project created      → Streak: 1
Day 2: Feature added        → Streak: 2
Day 3: (No activity)        → Streak: 2 (still active)
Day 4: Feature added        → Streak: 3 (activity within 2 days)
Day 5: (No activity)        → Streak: 0 (missed full day)
Day 6: Project created      → Streak: 1 (new streak started)
```

### Badge Awards

| Badge | Days | Visual |
|-------|------|--------|
| 1 Month | 30 | 🟦 |
| 3 Months | 90 | 🟣 |
| 6 Months | 180 | 🌸 |
| 1 Year | 365 | ⭐ |
| 2 Years | 730 | 💎 |

**Torus Visualization**:
- One small torus shape (⭕) per 30 days
- Partial torus shows remaining days
- Example: 75-day streak = 2 full torus + 15-day progress

## API Endpoints

### Track Activity

**POST** `/api/streaks/track`

```json
{
  "user_id": "uuid",
  "activity_type": "project_created",
  "activity_data": {
    "project_id": "project-uuid",
    "project_name": "My Project"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Streak tracked successfully"
}
```

### Get Streak Data

**GET** `/api/streaks/get?user_id=uuid`

**Response**:
```json
{
  "streak": {
    "id": "uuid",
    "user_id": "uuid",
    "current_streak": 45,
    "max_streak": 120,
    "last_activity_date": "2026-05-10",
    "streak_started_at": "2026-04-01T00:00:00Z",
    "created_at": "2026-01-15T10:00:00Z",
    "updated_at": "2026-05-10T14:30:00Z"
  },
  "badges": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "badge_type": "3_months",
      "earned_at": "2026-04-20T12:00:00Z",
      "streak_value": 90
    }
  ],
  "recentActivity": [
    {
      "id": "uuid",
      "activity_type": "project_created",
      "activity_date": "2026-05-10"
    }
  ]
}
```

## Component Usage

### TorusStreak Component

Full-featured streak display with badges:

```typescript
import TorusStreak from '@/components/TorusStreak'

<TorusStreak 
  streak={streakData.streak}
  badges={streakData.badges}
/>
```

### StreakWidget Component

Compact dashboard widget:

```typescript
import StreakWidget from '@/components/StreakWidget'

<StreakWidget userId={userId} />
```

## Utility Functions

### `trackUserActivity(userId, activityType, activityData?)`

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

await trackUserActivity('user-id', 'project_created', {
  project_id: 'proj-id',
  project_name: 'New Project'
})
```

### `getStreakInfo(userId)`

```typescript
import { getStreakInfo } from '@/lib/streak-utils'

const { streak, badges, recentActivity } = await getStreakInfo('user-id')
```

### `formatStreakInfo(streak)`

```typescript
import { formatStreakInfo } from '@/lib/streak-utils'

const formatted = formatStreakInfo(streak)
// Returns: {
//   current_streak, max_streak, is_active,
//   days_to_loss, display_text
// }
```

## Styling & Customization

### Colors
- Active Streak: `#f97316` (Orange)
- Torus Main: `#8b5cf6` (Purple)
- Badge Colors: `#60a5fa` (Blue), `#ec4899` (Pink), `#f59e0b` (Amber), `#ef4444` (Red)

### Fonts
- Headings: `Syne` (if available), fallback to sans-serif
- Body: System sans-serif

### Icons
- Flame: 🔥
- Torus: ⭕
- Badges: 🟦 🟣 🌸 ⭐ 💎

## Testing

### Manual Testing

1. **Create a user and project**:
   ```bash
   curl -X POST http://localhost:3000/api/streaks/track \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "test-user-id",
       "activity_type": "project_created",
       "activity_data": {"project_id": "proj-1"}
     }'
   ```

2. **Check streak**:
   ```bash
   curl "http://localhost:3000/api/streaks/get?user_id=test-user-id"
   ```

3. **Simulate 90-day streak** (for testing badges):
   - Update `last_activity_date` to 89 days ago
   - Track an activity today
   - Badge should be awarded

### Testing in Supabase

```sql
-- Check streaks
SELECT * FROM streaks WHERE user_id = 'user-uuid';

-- Check badges
SELECT * FROM streak_badges WHERE user_id = 'user-uuid';

-- Check activities
SELECT * FROM user_activity WHERE user_id = 'user-uuid';
```

## Troubleshooting

### Streak Not Updating

1. Check user exists in `profiles` table
2. Verify `user_id` is correct UUID
3. Check activity was recorded in `user_activity` table
4. Ensure streak row exists in `streaks` table

```sql
-- Verify user
SELECT * FROM profiles WHERE id = 'user-id';

-- Verify activity
SELECT * FROM user_activity WHERE user_id = 'user-id' ORDER BY created_at DESC;

-- Verify streak
SELECT * FROM streaks WHERE user_id = 'user-id';
```

### Badge Not Awarded

1. Check badge requirements (e.g., 90 days for 3-month)
2. Verify streak count calculation
3. Check `streak_badges` table for existing badges

```sql
-- View all badges for user
SELECT * FROM streak_badges WHERE user_id = 'user-id';

-- Manual badge insertion (if needed)
INSERT INTO streak_badges (user_id, badge_type, streak_value)
VALUES ('user-id', '3_months', 90);
```

## Performance Considerations

- **Concurrent Requests**: Handled by DB unique constraints
- **Activity Query**: Limited to 30 days recent activity
- **Badge Calculation**: On-demand per activity
- **Cache**: Use client-side React state to minimize API calls

## Future Enhancements

- [ ] Streak notifications ("Your streak ends in 6 hours!")
- [ ] Streak milestones ("Congratulations! 100 day streak!")
- [ ] Leaderboard (top streaks across platform)
- [ ] Streak freezes (1 free pass per month)
- [ ] Social sharing ("I have a 90-day streak on Torus AI!")
- [ ] Mobile push notifications
- [ ] Email digest of weekly/monthly streaks
