# YouTube Stats - Usage Modes

The app now supports **three flexible ways** to analyze your YouTube data!

## 🎯 Mode 1: Takeout File Only (Recommended)

**Best for:** Complete, accurate watch history

### What You Need:
- `watch-history.json` file from [Google Takeout](https://takeout.google.com/)

### What You Get:
- ✅ Complete watch history (all videos watched)
- ✅ Total video count
- ✅ Unique videos watched
- ✅ Top channels
- ✅ Monthly breakdown
- ⚠️ **Estimated** watch time (~11.7 min per video)

### How to Use:
1. Download watch history from Google Takeout
2. Upload `watch-history.json` file
3. Select year to analyze
4. Click "Analyze My Stats"

**Privacy:** All processing happens in your browser. Your data never leaves your computer.

---

## ⚡ Mode 2: API Key Only

**Best for:** Quick analysis without downloading Takeout

### What You Need:
- YouTube API key ([Get one free](https://console.cloud.google.com/apis/credentials))

### What You Get:
- ⚠️ **Limited data** - Only liked videos (not complete watch history)
- ✅ Exact video durations
- ✅ Video categories
- ✅ Channel information

### Limitations:
- **Cannot access watch history** - YouTube API doesn't provide this
- Only shows videos you explicitly liked
- Most people don't like every video they watch
- Much smaller dataset than Takeout

### How to Use:
1. Get a YouTube API key
2. Expand "⚡ Enhanced Mode"
3. Paste your API key
4. Click "Analyze My Stats"

**Note:** Simple API keys can only access public data. For private data (like watch history), YouTube requires OAuth, which isn't supported yet.

---

## 🚀 Mode 3: Both (Best Experience)

**Best for:** Complete data with enhanced accuracy

### What You Need:
- `watch-history.json` file from Google Takeout
- YouTube API key

### What You Get:
- ✅ Complete watch history (from Takeout)
- ✅ **Exact** watch time (from API - real video durations)
- ✅ Video categories (Music, Gaming, Education, etc.)
- ✅ Top channels
- ✅ Monthly breakdown
- ✅ Category insights

### How to Use:
1. Upload `watch-history.json` file
2. Expand "⚡ Enhanced Mode"
3. Paste your API key
4. Click "Analyze My Stats"

### The Magic:
The app takes your complete watch history from Takeout and enriches each video with real data from the API:
- Actual video length → accurate total watch time
- Video category → see what types of content you watch
- Trending status → discover insights

**This is the recommended mode if you want the most detailed analysis!**

---

## 📊 Feature Comparison

| Feature | Takeout Only | API Only | Both |
|---------|--------------|----------|------|
| Complete watch history | ✅ | ❌ (liked only) | ✅ |
| Accurate video count | ✅ | ⚠️ (partial) | ✅ |
| Watch time | ~Estimated | ✅ Exact | ✅ Exact |
| Video categories | ❌ | ✅ | ✅ |
| Top channels | ✅ | ⚠️ (limited) | ✅ |
| Monthly breakdown | ✅ | ⚠️ (limited) | ✅ |
| Privacy | 100% local | 100% local | 100% local |
| Setup time | ~30 min | ~5 min | ~30 min |
| Data accuracy | High | Low | Highest |

---

## 🤔 Which Mode Should I Use?

### Use Takeout Only if:
- ✅ You want complete, accurate watch history
- ✅ You don't want to deal with API keys
- ✅ You're okay with estimated watch time
- ✅ You've already downloaded your Takeout data

### Use API Only if:
- ✅ You want quick insights
- ✅ You're okay with limited data (liked videos only)
- ✅ You don't want to wait for Takeout download
- ⚠️ **But be aware**: This won't show your full watch history!

### Use Both if:
- ✅ You want the most accurate and detailed analysis
- ✅ You want exact watch times
- ✅ You want to see video categories
- ✅ You're willing to get an API key (free, 5 minutes)

---

## 💡 Pro Tips

### Getting the Best Results

1. **For Most Accurate Analysis:**
   - Use Takeout + API (Mode 3)
   - Request Takeout data regularly (once a year)
   - Keep your API key saved securely for future analyses

2. **API Key Tips:**
   - Free tier gives you 10,000 units/day
   - One analysis uses ~20 units (for 1,000 videos)
   - You can analyze 500+ histories per day
   - Restrict your key to your domain for security

3. **Data Privacy:**
   - All three modes process data locally
   - Your watch history never leaves your browser
   - API calls are made directly from your computer
   - Nothing is stored on our servers

### Common Questions

**Q: Why can't API-only mode access my watch history?**
A: YouTube's API doesn't provide watch history for privacy reasons. Only Google Takeout has this data.

**Q: Do I need to provide my API key every time?**
A: Yes, for security. We don't store it. You can save it in a password manager.

**Q: Can I switch modes?**
A: Yes! Click "🔄 Analyze Another Year" and choose a different mode.

**Q: Is my data safe?**
A: Yes! All processing happens in your browser. We never see your data.

---

## 🚀 Quick Start Guide

### First Time? Start Here:

1. **Option A - Quick & Easy** (5 minutes)
   - Get API key
   - Use API-only mode
   - See limited insights

2. **Option B - Most Accurate** (30 minutes)
   - Request Takeout data
   - Wait for email (1-4 hours)
   - Upload file for complete analysis

3. **Option C - Best of Both** (35 minutes)
   - Do both Option A and B
   - Get complete data with exact metrics
   - Unlock all features

---

## 🔒 Privacy & Security

### All Modes Are Private

- ✅ **No uploads** - Your data stays in your browser
- ✅ **No tracking** - We don't log anything
- ✅ **No storage** - Nothing saved on servers
- ✅ **Client-side only** - All processing local

### API Key Security

- Your key is used directly in your browser
- Never transmitted to our servers
- Only sent to YouTube's API (HTTPS)
- You can revoke it anytime

---

## 📚 Learn More

- [How to Get YouTube API Key](GET_API_KEY.md)
- [API Features Documentation](API_FEATURES.md)
- [Deployment Guide](DEPLOY.md)
- [Main README](README.md)

---

**Choose the mode that works best for you and start discovering your YouTube stats! 🎬**
