# Streak Management System - Quick Integration Guide

## 🚀 One-Minute Setup

### 1. Run Database Migration
Copy all contents of `db/migrations.sql` and paste into **Supabase SQL Editor**. Done! ✓

### 2. Files Already Created
- ✓ API routes (`/api/streaks/track`, `/api/streaks/get`)
- ✓ Components (`TorusStreak.tsx`, `StreakWidget.tsx`)
- ✓ Utilities (`streak-utils.ts`)
- ✓ Types updated in `types/index.ts`
- ✓ Badges page updated (`badges/page.tsx`)

## 📍 Where to Add Tracking

### In Project Creation (`/app/api/projects/create/route.ts`)

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// Inside your project creation logic:
await trackUserActivity(userId, 'project_created', {
  project_id: newProject.id
})
```

### In Feature Addition (`/app/(app)/planner/features/page.tsx`)

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// When feature is added:
await trackUserActivity(userId, 'feature_added', {
  feature_id: newFeature.id
})
```

### In Phase Completion (`/app/api/phases/complete/route.ts`)

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// When phase is marked complete:
await trackUserActivity(userId, 'phase_completed', {
  phase_id: phase.id
})
```

### In Error Fixing (`/app/api/ai/fix/route.ts`)

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// After generating fix:
await trackUserActivity(userId, 'error_fixed', {
  error_type: errorType
})
```

### In Plan Generation (`/app/api/ai/plan/route.ts`)

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// After generating plan:
await trackUserActivity(userId, 'ai_plan_generated', {
  project_id: projectId
})
```

### In Prompt Generation (`/app/api/ai/prompt/route.ts`)

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

// After generating prompt:
await trackUserActivity(userId, 'prompt_generated', {
  phase_id: phaseId
})
```

## 🎯 Display Streak Info

### Add Streak Widget to Dashboard

**File**: `/app/(app)/dashboard/page.tsx`

```typescript
'use client'

import StreakWidget from '@/components/StreakWidget'
import { useUser } from '@/utils/auth-context' // Adjust based on your auth setup

export default function Dashboard() {
  const { user } = useUser()
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* Streak widget - top left or right */}
      {user && <StreakWidget userId={user.id} />}
      
      {/* Rest of dashboard content */}
    </div>
  )
}
```

### Badges Page Already Updated ✓

The `/badges` page now shows:
- Full streak visualization
- Torus badges (one per 30 days)
- Milestone badges (3M, 6M, 12M, 24M)
- Activity information

## 📊 Streak Rules Explained

```
Days 1-2:    1 day streak       (Activity today or yesterday)
Days 3-30:   Increments each day (Activity continues)
Day 31:      30 days → 1 torus badge 🟦
Days 31-60:  31+ days (Building second torus)
Day 61:      No activity → BROKEN (Reset to 0)
```

## 🎁 Milestone Badges

| Streak | Badge | When Awarded |
|--------|-------|-------------|
| 30 days | 🟦 1M | First 30-day streak |
| 90 days | 🟣 3M | At 90 consecutive days |
| 180 days | 🌸 6M | At 180 consecutive days |
| 365 days | ⭐ 1Y | At 1-year streak |
| 730 days | 💎 2Y | At 2-year streak |

## 🔍 Check User Streaks (Supabase)

```sql
-- View all user streaks
SELECT * FROM streaks LIMIT 10;

-- View specific user
SELECT * FROM streaks WHERE user_id = 'user-uuid';

-- View user badges
SELECT * FROM streak_badges WHERE user_id = 'user-uuid';

-- View recent activity
SELECT * FROM user_activity WHERE user_id = 'user-uuid' ORDER BY created_at DESC LIMIT 30;
```

## 💡 Usage Example (Complete Flow)

### User Story: Developer creates a project and gets streak tracked

```typescript
// 1. User creates project (in your POST handler)
async function handleProjectCreation(userId: string, projectData: any) {
  // Create the project
  const newProject = await createProject(userId, projectData)
  
  // 2. Track the activity (automatically updates streak)
  import { trackUserActivity } from '@/lib/streak-utils'
  await trackUserActivity(userId, 'project_created', {
    project_id: newProject.id,
    project_name: newProject.name
  })
  
  // 3. User sees updated streak in dashboard widget
  // - If first activity: 1 day streak
  // - If consecutive days: increments
  // - After 30 days: gets 🟦 torus badge
  
  return newProject
}
```

## 🎨 Customization

### Change Colors
Edit in `/components/TorusStreak.tsx`:
```typescript
const badgeConfig = {
  '1_month': { color: '#60a5fa' }, // Change blue
  '3_months': { color: '#8b5cf6' }, // Change purple
  // ... etc
}
```

### Change Badge Icons
Edit in `/lib/streak-utils.ts`:
```typescript
export const BADGE_CONFIG = {
  '1_month': { icon: '🟦' }, // Change icon
  '3_months': { icon: '🟣' },
  // ... etc
}
```

### Customize Torus Visual
Edit gradient in `/components/TorusStreak.tsx`:
```typescript
background: `conic-gradient(from 0deg, #8b5cf6, #ec4899, #f59e0b, #8b5cf6)`
```

## 🧪 Quick Test

```bash
# Test tracking activity
curl -X POST http://localhost:3000/api/streaks/track \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-id",
    "activity_type": "project_created"
  }'

# Check streak
curl "http://localhost:3000/api/streaks/get?user_id=test-user-id"
```

## ❌ Troubleshooting

**Streak not updating?**
1. Verify user_id is correct UUID format
2. Check user exists in `profiles` table
3. Ensure Supabase RLS policies are correct

**Badges not showing?**
1. Check streak is >= 30 days for first badge
2. Verify badge award logic in `/api/streaks/track/route.ts`
3. Query `streak_badges` table to confirm

**Widget not displaying?**
1. Add `StreakWidget` import
2. Pass `userId` prop
3. Check browser console for errors

## 📚 Full Documentation

See `STREAK_IMPLEMENTATION.md` for:
- Detailed API documentation
- Database schema
- Component API
- Testing guide
- Performance considerations
- Future enhancements

---

**Status**: ✅ Ready to integrate  
**Time to integrate**: ~5 minutes per page  
**Questions?** Check STREAK_IMPLEMENTATION.md or audit API routes
