# Leaderboard API

## Endpoint

**GET** `/leaderboard`

## Authentication

This endpoint does not require authentication.

## Description

Returns the top 10 creators for the current week based on their creative score.

Only posts that meet all of the following conditions are included:

- Published (`isPublished: true`)
- Not deleted (`isDeleted: false`)
- Published within the last 7 days

## Ranking Logic

The API groups eligible posts by author and calculates the following metrics:

- Total stories
- Total views
- Total likes
- Total comments

The **creativeScore** is calculated as:

```text
creativeScore = totalViews + (totalLikes × 3) + (totalComments × 2)
```

Creators are sorted by `creativeScore` in descending order, and only the top 10 creators are returned.

## Response

### Success Response

```json
{
  "success": true,
  "message": "Weekly leaderboard metrics compiled successfully",
  "data": [
    {
      "rank": 1,
      "name": "John Doe",
      "avatar": "https://example.com/avatar.jpg",
      "storiesCount": 8,
      "creativeScore": 1250,
      "totalViews": 900,
      "totalLikes": 80,
      "totalComments": 55
    }
  ]
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| rank | Number | Creator's rank in the leaderboard |
| name | String | Creator's display name |
| avatar | String | URL of the creator's profile picture |
| storiesCount | Number | Number of published stories in the last 7 days |
| creativeScore | Number | Calculated ranking score |
| totalViews | Number | Total views across eligible stories |
| totalLikes | Number | Total likes across eligible stories |
| totalComments | Number | Total comments across eligible stories |

## Notes

- No authentication is needed to access this endpoint.
- Only published posts are considered.
- Deleted posts are excluded.
- Only posts from the previous 7 days are included.
- The response is limited to the top 10 creators.