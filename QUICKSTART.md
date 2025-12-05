# Quick Start Guide

## Get Your YouTube Wrapped in 3 Steps

### Step 1: Download Your YouTube Data

1. Go to **[Google Takeout](https://takeout.google.com/)**
2. Click "Deselect all"
3. Scroll down and check **YouTube**
4. Click "All YouTube data included"
5. Uncheck everything EXCEPT **history**
6. Click "OK" → "Next step" → "Create export"
7. Wait for the email (usually 1-4 hours)
8. Download the ZIP file and extract it

Your watch history will be in:
```
Takeout/YouTube and YouTube Music/history/watch-history.json
```

### Step 2: Install the Tool

```bash
# Create virtual environment
uv venv

# Activate it
source .venv/bin/activate

# Install dependencies
uv pip install -e .
```

### Step 3: Run the Analysis

```bash
# For this year (2025)
python youtube_wrapped.py --takeout path/to/watch-history.json

# For a specific year
python youtube_wrapped.py --takeout path/to/watch-history.json --year 2024
```

## What You'll See

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
   ...

📅 Monthly Breakdown:
   January     : ████████ (245)
   February    : ██████ (198)
   ...
```

## Tips

- The watch-history.json file contains ALL your YouTube history, so you can analyze any year
- Watch time is estimated based on average video length (~11.7 minutes)
- For exact watch times, YouTube doesn't provide this data directly
- All processing happens locally - your data never leaves your computer

## Need Help?

Check the main [README.md](README.md) for detailed instructions and troubleshooting.
