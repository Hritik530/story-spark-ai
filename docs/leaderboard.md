# Leaderboard API Endpoint

## Overview

The leaderboard endpoint returns the top 10 story creators for the current week, ranked by a "creative score" computed from views, likes, and comments on their published stories.

## Endpoint

```
GET /api/v1/leaderboard
```

No authentication is required.

## Request

No request body or query parameters required.

## Response

### Success (200 OK)

```json
{
  "success": true,
  "message": "Weekly leaderboard metrics compiled successfully",
  "data": [
    {
      "rank": 1,
      "name": "Jane Doe",
      "avatar": "https://example.com/avatar.png",
      "storiesCount": 5,
      "creativeScore": 1240,
      "totalViews": 800,
      "totalLikes": 120,
      "totalComments": 50
    },
    {
      "rank": 2,
      "name": "John Smith",
      "avatar": "",
      "storiesCount": 3,
      "creativeScore": 420,
      "totalViews": 300,
      "totalLikes": 30,
      "totalComments": 10
    }
  ]
}
```

### Error (500 Internal Server Error)

```json
{
  "success": false,
  "message": "Failed to compile leaderboard metrics"
}
```

## Scoring Algorithm

The creative score is computed per author as:

```
creativeScore = totalViews + (totalLikes * 3) + (totalComments * 2)
```

### Data Pipeline

1. **Time window**: Posts published within the last 7 days (from midnight at the start of the week) are included.
2. **Filters**: Only `isPublished: true` and `isDeleted: false` posts are considered.
3. **Aggregation**: Posts are grouped by author (`$author`). For each group, the count of stories and sum of `viewsCount`, `likesCount`, and `commentsCount` are computed.
4. **Scoring**: The creative score is calculated using the formula above.
5. **Ranking**: Results are sorted by `creativeScore` descending, limited to the top 10.
6. **User lookup**: Author names and avatars are resolved via a `$lookup` against the `users` collection. Posts with no matching user use `"Anonymous"` and an empty avatar string.

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `rank` | number | 1-based position in the weekly leaderboard |
| `name` | string | Author display name, or "Anonymous" if user not found |
| `avatar` | string | Author avatar URL, or empty string if not set |
| `storiesCount` | number | Number of published stories by this author in the last 7 days |
| `creativeScore` | number | Rounded integer score (views + likes*3 + comments*2) |
| `totalViews` | number | Sum of views across all published stories |
| `totalLikes` | number | Sum of likes across all published stories |
| `totalComments` | number | Sum of comments across all published stories |

## Related Files

- Controller: `backend/src/app/modules/leaderboard/leaderboard.controller.ts`
- Router: `backend/src/app/modules/leaderboard/leaderboard.router.ts`
- Post model: `backend/src/app/modules/post/post.model.ts`
- User model: `backend/src/app/modules/user/user.model.ts`
