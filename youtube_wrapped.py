#!/usr/bin/env python3
"""
YouTube Wrapped - Analyze your YouTube watch history
"""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional
from collections import defaultdict

try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    GOOGLE_API_AVAILABLE = True
except ImportError:
    GOOGLE_API_AVAILABLE = False


SCOPES = ['https://www.googleapis.com/auth/youtube.readonly']
TOKEN_FILE = 'token.json'
CREDENTIALS_FILE = 'credentials.json'


def get_youtube_service(api_key: Optional[str] = None):
    """Get authenticated YouTube service"""
    if api_key:
        # Simple API key authentication
        return build('youtube', 'v3', developerKey=api_key)
    
    if not GOOGLE_API_AVAILABLE:
        raise ImportError(
            "Google API libraries not installed. "
            "Run: uv pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client"
        )
    
    # OAuth authentication for accessing user's private data
    creds = None
    if Path(TOKEN_FILE).exists():
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not Path(CREDENTIALS_FILE).exists():
                raise FileNotFoundError(
                    f"{CREDENTIALS_FILE} not found. Download it from Google Cloud Console."
                )
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        
        Path(TOKEN_FILE).write_text(creds.to_json())
    
    return build('youtube', 'v3', credentials=creds)


def get_watch_history(youtube, year: int = None) -> List[Dict]:
    """Fetch user's watch history"""
    if year is None:
        year = datetime.now().year
    
    start_date = datetime(year, 1, 1, tzinfo=timezone.utc)
    end_date = datetime(year, 12, 31, 23, 59, 59, tzinfo=timezone.utc)
    
    print(f"Fetching watch history for {year}...")
    
    watch_history = []
    next_page_token = None
    
    while True:
        request = youtube.playlistItems().list(
            part='snippet,contentDetails',
            playlistId='LL',  # Liked videos as a proxy
            maxResults=50,
            pageToken=next_page_token
        )
        response = request.execute()
        
        for item in response.get('items', []):
            published_at = item['snippet'].get('publishedAt')
            if published_at:
                published_date = datetime.fromisoformat(published_at.replace('Z', '+00:00'))
                if start_date <= published_date <= end_date:
                    watch_history.append(item)
        
        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break
        
        print(f"  Fetched {len(watch_history)} items so far...")
    
    return watch_history


def analyze_takeout_data(file_path: str, year: int = None) -> Dict:
    """Analyze YouTube Takeout watch-history.json file"""
    if year is None:
        year = datetime.now().year
    
    print(f"Analyzing Takeout data for {year}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    total_videos = 0
    video_titles = []
    channels = defaultdict(int)
    monthly_counts = defaultdict(int)
    
    for entry in data:
        if 'time' not in entry:
            continue
        
        # Parse timestamp
        timestamp = datetime.fromisoformat(entry['time'].replace('Z', '+00:00'))
        
        if timestamp.year != year:
            continue
        
        total_videos += 1
        video_titles.append(entry.get('title', 'Unknown'))
        
        if 'subtitles' in entry and entry['subtitles']:
            channel = entry['subtitles'][0].get('name', 'Unknown')
            channels[channel] += 1
        
        month = timestamp.strftime('%B')
        monthly_counts[month] += 1
    
    return {
        'total_videos': total_videos,
        'unique_videos': len(set(video_titles)),
        'video_titles': video_titles,
        'top_channels': dict(sorted(channels.items(), key=lambda x: x[1], reverse=True)[:10]),
        'monthly_breakdown': dict(monthly_counts),
        'year': year
    }


def estimate_watch_time(video_count: int) -> float:
    """Estimate total watch time based on average video length"""
    # Average YouTube video is ~11.7 minutes
    avg_minutes_per_video = 11.7
    return video_count * avg_minutes_per_video


def format_minutes(minutes: float) -> str:
    """Format minutes into human-readable format"""
    hours = int(minutes // 60)
    days = hours // 24
    remaining_hours = hours % 24
    remaining_minutes = int(minutes % 60)
    
    parts = []
    if days > 0:
        parts.append(f"{days} day{'s' if days != 1 else ''}")
    if remaining_hours > 0:
        parts.append(f"{remaining_hours} hour{'s' if remaining_hours != 1 else ''}")
    if remaining_minutes > 0:
        parts.append(f"{remaining_minutes} minute{'s' if remaining_minutes != 1 else ''}")
    
    return ", ".join(parts) if parts else "0 minutes"


def display_wrapped(stats: Dict):
    """Display YouTube Wrapped results"""
    year = stats['year']
    total_videos = stats['total_videos']
    unique_videos = stats.get('unique_videos', total_videos)
    estimated_minutes = estimate_watch_time(total_videos)
    
    print("\n" + "="*60)
    print(f"🎬 YOUR YOUTUBE WRAPPED {year} 🎬".center(60))
    print("="*60 + "\n")
    
    print(f"📺 Total Videos Watched: {total_videos:,}")
    print(f"🎯 Unique Videos: {unique_videos:,}")
    print(f"⏱️  Estimated Watch Time: {format_minutes(estimated_minutes)}")
    print(f"   ({estimated_minutes:,.0f} minutes total)\n")
    
    if stats.get('top_channels'):
        print("🏆 Your Top Channels:")
        for i, (channel, count) in enumerate(stats['top_channels'].items(), 1):
            print(f"   {i}. {channel}: {count} videos")
        print()
    
    if stats.get('monthly_breakdown'):
        print("📅 Monthly Breakdown:")
        months_order = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December']
        for month in months_order:
            if month in stats['monthly_breakdown']:
                count = stats['monthly_breakdown'][month]
                bar = '█' * (count // 10 if count > 10 else 1)
                print(f"   {month:12s}: {bar} ({count})")
    
    print("\n" + "="*60)


def main():
    parser = argparse.ArgumentParser(
        description='Generate your YouTube Wrapped statistics',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Using Google Takeout data (recommended for accurate history)
  python youtube_wrapped.py --takeout watch-history.json
  
  # Using Google Takeout for a specific year
  python youtube_wrapped.py --takeout watch-history.json --year 2023
  
  # Using YouTube API with API key (limited data)
  python youtube_wrapped.py --api-key YOUR_API_KEY
  
  # Using YouTube API with OAuth (requires credentials.json)
  python youtube_wrapped.py --oauth

Note: For most accurate results, use Google Takeout:
  1. Go to https://takeout.google.com/
  2. Select only YouTube → History
  3. Download and extract watch-history.json
        """
    )
    
    parser.add_argument('--takeout', type=str, help='Path to watch-history.json from Google Takeout')
    parser.add_argument('--api-key', type=str, help='YouTube Data API key')
    parser.add_argument('--oauth', action='store_true', help='Use OAuth authentication')
    parser.add_argument('--year', type=int, help='Year to analyze (default: current year)')
    
    args = parser.parse_args()
    
    if args.takeout:
        # Analyze Takeout data
        stats = analyze_takeout_data(args.takeout, args.year)
        display_wrapped(stats)
    elif args.api_key or args.oauth:
        # Use YouTube API
        print("⚠️  Note: The YouTube API has limited access to watch history.")
        print("For best results, use Google Takeout data instead.\n")
        youtube = get_youtube_service(args.api_key if args.api_key else None)
        # API implementation would go here
        print("API method is limited. Please use Google Takeout for accurate data.")
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
