# Streak Management System - Implementation Guide

## Overview

The Streak Management System tracks user activity in Firebase Firestore and awards visual torus badges for daily streak milestones.

## Firestore Data Model

Collections used:

- `user_activity`: daily activity documents keyed by user, date, and activity type.
- `streaks`: one streak summary document per user.
- `streak_badges`: milestone badge documents per user and badge type.

## Setup

Enable Firestore and configure Firebase Admin credentials with `FIREBASE_SERVICE_ACCOUNT_JSON`. No SQL migration is needed.

## API Endpoints

### Track Activity

`POST /api/streaks/track`

```json
{
  "user_id": "firebase-auth-uid",
  "activity_type": "project_created",
  "activity_data": {
    "project_id": "project-id"
  }
}
```

### Get Streak Data

`GET /api/streaks/get?user_id=firebase-auth-uid`

Returns:

- `streak`
- `badges`
- `recentActivity`

## Activity Types

- `project_created`
- `feature_added`
- `phase_completed`
- `error_fixed`
- `ai_plan_generated`
- `prompt_generated`

## Component Usage

```typescript
import StreakWidget from '@/components/StreakWidget'

<StreakWidget userId={userId} />
```

```typescript
import TorusStreak from '@/components/TorusStreak'

<TorusStreak streak={streakData.streak} badges={streakData.badges} />
```

## Testing

```bash
curl -X POST http://localhost:3000/api/streaks/track \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test-user-id","activity_type":"project_created"}'

curl "http://localhost:3000/api/streaks/get?user_id=test-user-id"
```

Then inspect Firestore collections for the test user.

## Troubleshooting

- Check that the user exists in Firebase Auth and, when needed, the Firestore `profiles` collection.
- Verify `user_id` matches the Firebase Auth UID.
- Confirm Firebase Admin credentials are available to server routes.
- Review server logs from `/api/streaks/track` and `/api/streaks/get`.
