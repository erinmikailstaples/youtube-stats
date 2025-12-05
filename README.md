# YouTube Stats - Your Personal YouTube Wrapped

Analyze your YouTube watch history and get detailed statistics about your viewing habits, just like Spotify Wrapped!

## 🌐 Web App (Recommended)

**[Launch Web App](https://your-app.netlify.app)** - No installation required!

Upload your watch history and get instant results in your browser. All processing happens locally - your data never leaves your computer.

## 💻 CLI Tool

Prefer the command line? Install and run locally:

## Features

- 📊 **Total watch time** - See exactly how many minutes you spent watching YouTube
- 📺 **Video count** - Know how many videos you watched individually
- 🏆 **Top channels** - Discover your most-watched creators
- 📅 **Monthly breakdown** - Visualize your viewing patterns throughout the year
- 🎯 **Unique videos** - Track how many different videos you watched

## Installation

Install dependencies using `uv` (recommended):

```bash
uv pip install -e .
```

Or install manually:

```bash
uv pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client
```

## Usage

### Method 1: Google Takeout (Recommended - Most Accurate)

This method gives you **exact** watch history including all videos you've watched.

1. **Download your YouTube data:**
   - Go to [Google Takeout](https://takeout.google.com/)
   - Deselect all, then select only **YouTube** → **history**
   - Click "Next step" and "Create export"
   - Wait for the email notification (can take a few hours)
   - Download and extract the ZIP file

2. **Run the analysis:**
   ```bash
   python youtube_wrapped.py --takeout path/to/watch-history.json
   ```

3. **Analyze a specific year:**
   ```bash
   python youtube_wrapped.py --takeout watch-history.json --year 2024
   ```

### Method 2: YouTube Data API (Limited)

⚠️ **Note:** The YouTube API has very limited access to watch history. For accurate results, use Google Takeout instead.

1. **Get API credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable YouTube Data API v3
   - Create OAuth 2.0 credentials
   - Download `credentials.json` to this directory

2. **Run with OAuth:**
   ```bash
   python youtube_wrapped.py --oauth
   ```

## Example Output

```
============================================================
              🎬 YOUR YOUTUBE WRAPPED 2024 🎬              
============================================================

📺 Total Videos Watched: 2,847
🎯 Unique Videos: 2,103
⏱️  Estimated Watch Time: 13 days, 21 hours, 17 minutes
   (33,290 minutes total)

🏆 Your Top Channels:
   1. Fireship: 127 videos
   2. ThePrimeagen: 98 videos
   3. Computerphile: 76 videos
   4. 3Blue1Brown: 54 videos
   5. CGP Grey: 43 videos

📅 Monthly Breakdown:
   January     : ████████ (245)
   February    : ██████ (198)
   March       : ███████ (267)
   ...

============================================================
```

## How It Works

- **Total Videos:** Counts every video you watched from the watch history
- **Unique Videos:** Counts only distinct videos (if you rewatched something, it's counted once)
- **Watch Time:** Estimates based on average YouTube video length (~11.7 minutes per video)
- **Top Channels:** Ranks channels by number of videos watched
- **Monthly Breakdown:** Shows viewing patterns across the year

## Privacy

All data processing happens locally on your machine. No data is sent anywhere except:
- To YouTube API (if using API method) for authentication
- Your watch history file stays on your computer

## Tips

- For the most accurate watch time, Google Takeout is the way to go
- You can analyze multiple years by running the command with different `--year` values
- The watch-history.json file can be large (several MB) if you're a heavy YouTube user

## Troubleshooting

**"File not found" error:**
- Make sure you're providing the correct path to `watch-history.json`
- The file is usually in `Takeout/YouTube and YouTube Music/history/watch-history.json`

**No data showing:**
- Check that you're analyzing the correct year with `--year`
- Verify your watch-history.json file isn't empty

## 🚀 Deploy Your Own

Want to deploy your own version?

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/erinmikailstaples/youtube-stats)

See [DEPLOY.md](DEPLOY.md) for detailed deployment instructions.

## License

MIT
