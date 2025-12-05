# How to Get a YouTube API Key

Follow these steps to get your free YouTube Data API v3 key for enhanced features.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click **"Select a project"** at the top
4. Click **"New Project"**
5. Enter a project name (e.g., "YouTube Stats")
6. Click **"Create"**

## Step 2: Enable YouTube Data API v3

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"YouTube Data API v3"**
3. Click on it
4. Click **"Enable"**

## Step 3: Create API Key

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"API key"**
3. Your API key will be generated
4. **Copy it immediately!**

## Step 4: Restrict Your API Key (Recommended)

To protect your key from misuse:

1. Click the **pencil icon** next to your new API key
2. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Choose **"YouTube Data API v3"** only
3. Under **"Application restrictions"** (optional):
   - Select **"HTTP referrers"**
   - Add your Netlify domain (e.g., `https://your-site.netlify.app/*`)
   - Add `http://localhost:*` for local testing
4. Click **"Save"**

## Step 5: Use Your API Key

1. Copy your API key
2. In the YouTube Stats app, expand **"⚡ Enhanced Mode"**
3. Paste your API key
4. Click **"Analyze My Stats"**

## Free Tier Limits

- **10,000 quota units per day** (free forever)
- **Cost per analysis**: ~20 units for 1,000 videos
- **Daily capacity**: ~500 analyses per day
- More than enough for personal use!

## What You Get with API

When you provide an API key, you get:

### ✅ Exact Watch Time
Instead of:
```
~19,500 minutes (estimated)
```

You get:
```
18,234 minutes ✓ (exact)
```

### ✅ Video Categories
See your top video categories:
- 🎮 Gaming: 432 videos
- 🎵 Music: 298 videos
- 🎓 Education: 187 videos
- 🎬 Entertainment: 156 videos

### ✅ Category Insights
- Understand your viewing preferences
- Discover patterns in your watch history
- Compare categories over time

## Privacy & Security

- ✅ Your API key is **never stored** - only used in your browser
- ✅ All API calls are made **client-side** from your computer
- ✅ The app **never sends** your API key to our servers
- ✅ You can **revoke** your key anytime in Google Cloud Console

## Troubleshooting

### "API key not valid"
- Make sure you copied the entire key
- Check if YouTube Data API v3 is enabled
- Verify API restrictions allow your domain

### "Quota exceeded"
- You've hit the 10,000 daily limit
- Wait until tomorrow (resets at midnight Pacific Time)
- Or request a quota increase in Google Cloud Console

### "API access denied"
- Check if YouTube Data API v3 is enabled
- Make sure the API key isn't restricted to other IPs/domains

## Cost

**100% Free!**
- Google provides 10,000 units/day for free
- No credit card required
- No expiration
- Perfect for personal use

## Revoking Access

To delete your API key:
1. Go to [API Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your key
3. Click the trash icon
4. Confirm deletion

## Questions?

- [YouTube Data API Docs](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API Quota Info](https://developers.google.com/youtube/v3/getting-started#quota)
