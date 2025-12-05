# YouTube Data API - Available Features

## Current Limitation

**The YouTube Data API does NOT provide access to your watch history.** This is why we use Google Takeout for accurate watch history analysis.

## What the API CAN Provide

### 1. Subscription Analysis
```javascript
// Get all your subscribed channels
GET https://www.googleapis.com/youtube/v3/subscriptions
  ?part=snippet
  &mine=true
```

**Possible features:**
- Show which subscribed channels you watch most
- Compare subscriptions vs. actual viewing
- "You're subscribed to X channels but only watch Y"

### 2. Liked Videos Analysis
```javascript
// Get your liked videos (playlist ID: LL)
GET https://www.googleapis.com/youtube/v3/playlistItems
  ?part=snippet
  &playlistId=LL
```

**Possible features:**
- "You liked X videos this year"
- "Your most liked category"
- Compare liked videos vs. watched videos

### 3. Video Enrichment
```javascript
// Get detailed video information
GET https://www.googleapis.com/youtube/v3/videos
  ?part=snippet,contentDetails,statistics
  &id=VIDEO_ID
```

**Possible features:**
- **Actual video durations** instead of estimates
- Video categories (Music, Gaming, Education, etc.)
- Popular videos ("You watched X videos with 10M+ views")
- Video publish dates vs. watch dates

### 4. Channel Information
```javascript
// Get channel details
GET https://www.googleapis.com/youtube/v3/channels
  ?part=snippet,statistics
  &id=CHANNEL_ID
```

**Possible features:**
- Channel subscriber counts
- "You watched small creators" vs. "You watched mega channels"
- Channel categories
- Creator locations

### 5. Search & Trending
```javascript
// Search and trending data
GET https://www.googleapis.com/youtube/v3/search
GET https://www.googleapis.com/youtube/v3/videos?chart=mostPopular
```

**Possible features:**
- "You watched X trending videos"
- "You discovered videos before they were popular"
- Compare your viewing to global trends

## Enhanced Features We Could Add

### Option A: Hybrid Approach
**Takeout + API = Best of Both Worlds**

1. User uploads `watch-history.json` (accurate watch history)
2. App makes API calls to enrich the data:
   - Get actual video durations → accurate watch time
   - Get video categories → category breakdown
   - Get channel info → better channel insights

**Implementation:**
```javascript
// After processing Takeout data
async function enrichWithAPI(watchHistory, apiKey) {
    const videoIds = watchHistory.map(v => extractVideoId(v.titleUrl));
    
    // Batch API requests (50 videos per request)
    const batches = chunk(videoIds, 50);
    
    for (const batch of batches) {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?` +
            `part=snippet,contentDetails,statistics&` +
            `id=${batch.join(',')}&key=${apiKey}`
        );
        
        const data = await response.json();
        // Merge API data with watch history
    }
}
```

**Benefits:**
- ✅ Accurate watch time (using real video durations)
- ✅ Category breakdown (Music, Gaming, etc.)
- ✅ Better insights (trending videos, popular channels)

**Drawbacks:**
- ⚠️ Requires API key from users
- ⚠️ API quota limits (10,000 units/day free)
- ⚠️ Slower processing (network requests)

### Option B: Subscription Comparison
**No Takeout needed - just show subscription stats**

```javascript
// Simple feature using only API
async function analyzeSubscriptions(accessToken) {
    const subs = await fetchSubscriptions(accessToken);
    
    return {
        totalSubscriptions: subs.length,
        categories: categorizeChannels(subs),
        recentSubscriptions: subs.filter(s => isThisYear(s.subscribedAt)),
        topCategories: findTopCategories(subs)
    };
}
```

**Features:**
- "You're subscribed to X channels"
- "Your top categories: Gaming, Tech, Music"
- "You subscribed to X new channels this year"

### Option C: Liked Videos Wrapped
**Alternative to watch history**

```javascript
// Analyze liked videos instead of watch history
async function analyzeLikedVideos(accessToken, year) {
    const liked = await fetchLikedVideos(accessToken);
    const thisYear = liked.filter(v => v.year === year);
    
    return {
        totalLiked: thisYear.length,
        topChannels: findTopChannels(thisYear),
        categories: categorizeVideos(thisYear)
    };
}
```

## API Quota Considerations

YouTube API has quotas:
- **Free tier**: 10,000 units/day
- **Quota costs**:
  - `videos.list`: 1 unit
  - `playlistItems.list`: 1 unit
  - `subscriptions.list`: 1 unit

**For 1,000 videos:**
- Enrichment requires: 20 API calls (50 videos per call)
- Cost: 20 units
- Users could analyze ~500 watch histories per day (10,000 / 20)

## Implementation Recommendations

### Recommended: Keep Current Approach + Optional Enrichment

```javascript
// Add optional API enrichment toggle
<div class="api-enrichment">
    <label>
        <input type="checkbox" id="use-api" />
        Enrich with YouTube API (more accurate watch time)
    </label>
    <input type="text" id="api-key" placeholder="YouTube API Key (optional)" />
</div>
```

**Benefits:**
- Works without API (current functionality)
- Power users can opt-in for enhanced features
- No forced API key requirement

### Future Enhancement: Video Duration Lookup

Most valuable API feature would be getting real video durations:

```javascript
// Calculate REAL watch time using API
async function calculateRealWatchTime(watchHistory, apiKey) {
    const enrichedData = await enrichWithAPI(watchHistory, apiKey);
    
    let totalSeconds = 0;
    for (const video of enrichedData) {
        // Parse ISO 8601 duration: PT15M33S → 933 seconds
        totalSeconds += parseISO8601Duration(video.duration);
    }
    
    return formatDuration(totalSeconds);
}
```

This would give **exact watch time** instead of estimates!

## What Users Need for API Access

1. **API Key** (for public data):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project
   - Enable YouTube Data API v3
   - Create API key
   - Restrict key to YouTube Data API v3

2. **OAuth 2.0** (for personal data like subscriptions):
   - More complex setup
   - Requires user authentication flow
   - Access to private playlists, subscriptions, etc.

## Summary

| Feature | Available? | Usefulness | Complexity |
|---------|-----------|------------|------------|
| Watch History | ❌ No | ⭐⭐⭐⭐⭐ | N/A |
| Video Durations | ✅ Yes | ⭐⭐⭐⭐ | Medium |
| Video Categories | ✅ Yes | ⭐⭐⭐⭐ | Medium |
| Subscriptions | ✅ Yes | ⭐⭐⭐ | Easy |
| Liked Videos | ✅ Yes | ⭐⭐ | Easy |
| Channel Stats | ✅ Yes | ⭐⭐ | Easy |

**Bottom line:** Google Takeout is still the only way to get complete watch history. The API is useful for enriching that data with additional metadata.

## Proposed Roadmap

**Phase 1 (Current):** ✅
- Takeout-based analysis
- Estimated watch time
- Basic stats

**Phase 2 (Future):**
- Optional API enrichment
- Real video durations
- Category breakdown

**Phase 3 (Future):**
- Subscription analysis (separate feature)
- "Liked Videos Wrapped" (alternative mode)
- Trending video detection

Would you like me to implement any of these API features?
