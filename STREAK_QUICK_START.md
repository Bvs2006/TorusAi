# Streak Management System - Quick Integration Guide

## One-Minute Setup

### 1. Configure Firebase
Enable Firestore in the Firebase Console. The existing API routes create and update documents in these collections:

- `streaks`
- `streak_badges`
- `user_activity`

### 2. Files Already Created
- API routes: `/api/streaks/track`, `/api/streaks/get`
- Components: `TorusStreak.tsx`, `StreakWidget.tsx`
- Utilities: `streak-utils.ts`
- Types updated in `types/index.ts`
- Badges page updated: `badges/page.tsx`

## Where to Add Tracking

Call `trackUserActivity` after important user actions:

```typescript
import { trackUserActivity } from '@/lib/streak-utils'

await trackUserActivity(userId, 'project_created', {
  project_id: newProject.id,
})
```

Useful activity types:

- `project_created`
- `feature_added`
- `phase_completed`
- `error_fixed`
- `ai_plan_generated`
- `prompt_generated`

## Check User Streaks

Open Firestore and inspect the `streaks`, `streak_badges`, and `user_activity` collections. Document IDs are based on the Firebase Auth UID and activity metadata.

## Quick Test

```bash
curl -X POST http://localhost:3000/api/streaks/track \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user-id","activity_type":"project_created"}'

curl "http://localhost:3000/api/streaks/get?user_id=test-user-id"
```

## Troubleshooting

If streaks do not update:

- Verify `user_id` matches the Firebase Auth UID.
- Check that Firebase Admin credentials are configured.
- Confirm Firestore contains the expected `user_activity` and `streaks` documents.

If badges do not show:

- Check the streak is high enough for a milestone.
- Confirm the badge document exists in `streak_badges`.
- Check `/api/streaks/track/route.ts` for server errors.
