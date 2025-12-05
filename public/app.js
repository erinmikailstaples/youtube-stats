// YouTube Wrapped - Client-side Analysis
let uploadedData = null;
let apiKey = null;
let oauthToken = null;
let userEmail = null;

// DOM Elements
const fileInput = document.getElementById('file-input');
const analyzeBtn = document.getElementById('analyze-btn');
const yearSelect = document.getElementById('year-select');
const uploadSection = document.getElementById('upload-section');
const loadingSection = document.getElementById('loading-section');
const resultsSection = document.getElementById('results-section');
const fileLabel = document.querySelector('.upload-text');

// File upload handler
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileLabel.textContent = `Selected: ${file.name}`;
        
        // Read file
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                uploadedData = JSON.parse(event.target.result);
                console.log(`Loaded ${uploadedData.length} entries`);
            } catch (error) {
                alert('Error reading file. Please make sure it\'s a valid JSON file.');
                uploadedData = null;
            }
        };
        reader.readAsText(file);
    }
});

// Analyze button handler
analyzeBtn.addEventListener('click', () => {
    apiKey = document.getElementById('api-key').value.trim() || null;
    
    // Check if we have at least one input method
    if (!uploadedData && !apiKey && !oauthToken) {
        alert('Please either:\n1. Upload a watch-history.json file, OR\n2. Sign in with Google, OR\n3. Provide a YouTube API key');
        return;
    }
    
    const year = yearSelect.value;
    analyzeData(uploadedData, year);
});

// Reset button handler
document.getElementById('reset-btn').addEventListener('click', () => {
    uploadSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    fileInput.value = '';
    fileLabel.textContent = 'Choose watch-history.json';
    analyzeBtn.disabled = true;
    uploadedData = null;
});

// OAuth: Handle Google Sign-In credential response
window.handleCredentialResponse = function(response) {
    console.log('OAuth sign-in successful');
    
    // Decode JWT to get user info (basic decoding for display only)
    try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        userEmail = payload.email;
        oauthToken = response.credential;
        
        // Update UI
        document.getElementById('oauth-user').textContent = `Signed in as ${userEmail}`;
        document.getElementById('oauth-status').style.display = 'inline-block';
        document.getElementById('signout-btn').style.display = 'inline-block';
        document.getElementById('google-signin-container').style.display = 'none';
        
        console.log('User signed in:', userEmail);
    } catch (error) {
        console.error('Error parsing credential:', error);
        alert('Sign-in succeeded but could not parse user info');
    }
};

// Sign out button handler
document.getElementById('signout-btn').addEventListener('click', () => {
    oauthToken = null;
    userEmail = null;
    
    // Update UI
    document.getElementById('oauth-status').style.display = 'none';
    document.getElementById('signout-btn').style.display = 'none';
    document.getElementById('google-signin-container').style.display = 'flex';
    
    // Google Sign-Out
    if (window.google && window.google.accounts) {
        window.google.accounts.id.disableAutoSelect();
    }
    
    console.log('User signed out');
});

// Share button handler
document.getElementById('share-btn').addEventListener('click', () => {
    const year = yearSelect.value;
    const totalVideos = document.getElementById('total-videos').textContent;
    const watchTime = document.getElementById('watch-time').textContent;
    
    const shareText = `My YouTube Wrapped ${year}:\n📺 ${totalVideos} videos watched\n⏱️ ${watchTime} watch time\n\nCheck yours at: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: `My YouTube Wrapped ${year}`,
            text: shareText
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Stats copied to clipboard!');
        });
    }
});

// Fetch watch history using OAuth token
async function fetchYouTubeDataWithOAuth(token, year) {
    console.log('Fetching data from YouTube with OAuth...');
    
    const watchHistory = [];
    
    try {
        // Note: Google Sign-In provides an ID token, not an access token
        // We need to exchange it or use a different flow
        // For now, we'll show a helpful message
        
        alert(
            'OAuth Sign-In Detected!\n\n' +
            'Currently, the OAuth flow requires additional setup:\n' +
            '1. Backend server to exchange tokens\n' +
            '2. Access token (not just ID token)\n\n' +
            'For now, please use one of these options:\n' +
            '• Upload Takeout file (recommended)\n' +
            '• Use API key with Takeout for enhanced mode'
        );
        
        return null;
    } catch (error) {
        console.error('OAuth fetch error:', error);
        return null;
    }
}

// Fetch watch history from YouTube API (liked videos + subscriptions)
async function fetchYouTubeData(apiKey, year) {
    console.log('Fetching data from YouTube API...');
    
    const watchHistory = [];
    
    try {
        // Fetch liked videos (best approximation of watch history)
        let pageToken = null;
        let fetchedCount = 0;
        
        do {
            const url = `https://www.googleapis.com/youtube/v3/videos?` +
                `part=snippet,contentDetails&` +
                `myRating=like&` +
                `maxResults=50&` +
                `key=${apiKey}` +
                (pageToken ? `&pageToken=${pageToken}` : '');
            
            const response = await fetch(url);
            
            if (!response.ok) {
                const error = await response.json();
                console.error('API Error:', error);
                
                if (error.error.code === 403 || error.error.code === 401) {
                    alert(
                        'This API key does not have permission to access your YouTube data.\n\n' +
                        'To use API-only mode, you need OAuth authentication (not just an API key).\n\n' +
                        'For now, please use the "Upload Takeout file" option instead.'
                    );
                } else {
                    alert(`YouTube API Error: ${error.error.message}`);
                }
                return null;
            }
            
            const data = await response.json();
            
            // Convert to watch history format
            for (const item of data.items) {
                watchHistory.push({
                    title: item.snippet.title,
                    titleUrl: `https://www.youtube.com/watch?v=${item.id}`,
                    subtitles: [{ name: item.snippet.channelTitle }],
                    time: item.snippet.publishedAt // Note: This is publish time, not watch time
                });
            }
            
            fetchedCount += data.items.length;
            pageToken = data.pageToken;
            
            console.log(`Fetched ${fetchedCount} liked videos...`);
            
        } while (pageToken && fetchedCount < 1000); // Limit to 1000 for performance
        
        if (watchHistory.length === 0) {
            alert(
                'No data found with this API key.\n\n' +
                'Note: A simple API key can only access public data.\n' +
                'For watch history, please use "Upload Takeout file" instead.'
            );
            return null;
        }
        
        console.log(`Total items fetched: ${watchHistory.length}`);
        return watchHistory;
        
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to connect to YouTube API. Please check your connection and API key.');
        return null;
    }
}

// Extract video ID from URL
function extractVideoId(url) {
    if (!url) return null;
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

// Parse ISO 8601 duration (PT15M33S) to seconds
function parseISO8601Duration(duration) {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    return hours * 3600 + minutes * 60 + seconds;
}

// Enrich watch history with YouTube API data
async function enrichWithAPI(watchHistory, apiKey) {
    console.log('Enriching data with YouTube API...');
    
    // Extract video IDs
    const videoIds = [];
    for (const entry of watchHistory) {
        const videoId = extractVideoId(entry.titleUrl);
        if (videoId) videoIds.push(videoId);
    }
    
    if (videoIds.length === 0) {
        console.warn('No video IDs found in watch history');
        return { durations: {}, categories: {} };
    }
    
    console.log(`Fetching data for ${videoIds.length} videos...`);
    
    const durations = {};
    const categories = {};
    const batchSize = 50; // YouTube API allows 50 IDs per request
    
    // Process in batches
    for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        const ids = batch.join(',');
        
        try {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?` +
                `part=contentDetails,snippet&` +
                `id=${ids}&` +
                `key=${apiKey}`
            );
            
            if (!response.ok) {
                const error = await response.json();
                console.error('API Error:', error);
                if (i === 0) {
                    alert(`YouTube API Error: ${error.error.message}\n\nPlease check your API key.`);
                    return null;
                }
                break;
            }
            
            const data = await response.json();
            
            for (const item of data.items) {
                durations[item.id] = parseISO8601Duration(item.contentDetails.duration);
                categories[item.id] = item.snippet.categoryId;
            }
            
            // Update progress
            const progress = Math.min(100, Math.round((i + batch.length) / videoIds.length * 100));
            console.log(`Progress: ${progress}%`);
            
        } catch (error) {
            console.error('Fetch error:', error);
            if (i === 0) {
                alert('Failed to connect to YouTube API. Using estimated data instead.');
                return null;
            }
            break;
        }
    }
    
    console.log(`Enriched ${Object.keys(durations).length} videos`);
    return { durations, categories };
}

// Category ID to name mapping
const CATEGORY_NAMES = {
    '1': 'Film & Animation',
    '2': 'Autos & Vehicles',
    '10': 'Music',
    '15': 'Pets & Animals',
    '17': 'Sports',
    '18': 'Short Movies',
    '19': 'Travel & Events',
    '20': 'Gaming',
    '21': 'Videoblogging',
    '22': 'People & Blogs',
    '23': 'Comedy',
    '24': 'Entertainment',
    '25': 'News & Politics',
    '26': 'Howto & Style',
    '27': 'Education',
    '28': 'Science & Technology',
    '29': 'Nonprofits & Activism',
    '30': 'Movies',
    '31': 'Anime/Animation',
    '32': 'Action/Adventure',
    '33': 'Classics',
    '34': 'Documentary',
    '35': 'Drama',
    '36': 'Family',
    '37': 'Foreign',
    '38': 'Horror',
    '39': 'Sci-Fi/Fantasy',
    '40': 'Thriller',
    '41': 'Shorts',
    '42': 'Shows',
    '43': 'Trailers',
    '44': 'Anime'
};

// Main analysis function
async function analyzeData(data, yearStr) {
    // Show loading
    uploadSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    
    try {
        let enrichedData = null;
        let actualData = data;
        
        // If no file provided, try to fetch from OAuth or API
        if (!actualData && oauthToken) {
            const loadingText = loadingSection.querySelector('p');
            loadingText.textContent = 'Fetching your YouTube data with OAuth...';
            actualData = await fetchYouTubeDataWithOAuth(oauthToken, yearStr);
            
            if (!actualData) {
                // Failed to fetch with OAuth
                loadingSection.classList.add('hidden');
                uploadSection.classList.remove('hidden');
                return;
            }
            
            loadingText.textContent = 'Analyzing your YouTube data...';
        } else if (!actualData && apiKey) {
            const loadingText = loadingSection.querySelector('p');
            loadingText.textContent = 'Fetching your YouTube data...';
            actualData = await fetchYouTubeData(apiKey, yearStr);
            
            if (!actualData) {
                // Failed to fetch from API
                loadingSection.classList.add('hidden');
                uploadSection.classList.remove('hidden');
                return;
            }
            
            loadingText.textContent = 'Analyzing your YouTube data...';
        }
        
        // If API key provided and we have data, enrich it
        if (apiKey && actualData) {
            const loadingText = loadingSection.querySelector('p');
            loadingText.textContent = 'Enriching with YouTube API...';
            enrichedData = await enrichWithAPI(actualData, apiKey);
            
            if (enrichedData === null) {
                // API failed, fall back to estimates
                enrichedData = null;
            }
            
            loadingText.textContent = 'Analyzing your YouTube history...';
        }
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            const stats = processData(actualData, yearStr, enrichedData);
            displayResults(stats, yearStr);
            
            // Hide loading, show results
            loadingSection.classList.add('hidden');
            resultsSection.classList.remove('hidden');
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    } catch (error) {
        console.error('Analysis error:', error);
        alert('An error occurred during analysis. Please try again.');
        loadingSection.classList.add('hidden');
        uploadSection.classList.remove('hidden');
    }
}

// Process the watch history data
function processData(data, yearStr, enrichedData = null) {
    const year = yearStr === 'all' ? null : parseInt(yearStr);
    
    let totalVideos = 0;
    const videoTitles = [];
    const channels = {};
    const monthlyData = {
        'January': 0, 'February': 0, 'March': 0, 'April': 0,
        'May': 0, 'June': 0, 'July': 0, 'August': 0,
        'September': 0, 'October': 0, 'November': 0, 'December': 0
    };
    
    let earliestDate = null;
    let latestDate = null;
    let totalWatchSeconds = 0;
    const categoryCounts = {};
    
    for (const entry of data) {
        if (!entry.time) continue;
        
        const timestamp = new Date(entry.time);
        
        // Filter by year if specified
        if (year && timestamp.getFullYear() !== year) continue;
        
        totalVideos++;
        
        // Track date range
        if (!earliestDate || timestamp < earliestDate) earliestDate = timestamp;
        if (!latestDate || timestamp > latestDate) latestDate = timestamp;
        
        // Track video titles
        const title = entry.title || 'Unknown';
        if (title !== 'Unknown') {
            videoTitles.push(title);
        }
        
        // Track channels
        if (entry.subtitles && entry.subtitles.length > 0) {
            const channel = entry.subtitles[0].name || 'Unknown';
            channels[channel] = (channels[channel] || 0) + 1;
        }
        
        // Track monthly data
        const monthName = timestamp.toLocaleString('en-US', { month: 'long' });
        if (monthlyData.hasOwnProperty(monthName)) {
            monthlyData[monthName]++;
        }
        
        // Track watch time and categories if enriched data available
        if (enrichedData) {
            const videoId = extractVideoId(entry.titleUrl);
            if (videoId && enrichedData.durations[videoId]) {
                totalWatchSeconds += enrichedData.durations[videoId];
            }
            
            if (videoId && enrichedData.categories[videoId]) {
                const categoryId = enrichedData.categories[videoId];
                const categoryName = CATEGORY_NAMES[categoryId] || 'Other';
                categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
            }
        }
    }
    
    // Calculate unique videos
    const uniqueVideos = new Set(videoTitles).size;
    
    // Sort channels by count
    const topChannels = Object.entries(channels)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    // Sort categories by count
    const topCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);
    
    // Calculate days in range
    let daysInRange = 365;
    if (earliestDate && latestDate) {
        daysInRange = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) || 1;
    }
    
    return {
        totalVideos,
        uniqueVideos,
        topChannels,
        monthlyData,
        daysInRange,
        totalWatchSeconds: totalWatchSeconds || null,
        topCategories: topCategories.length > 0 ? topCategories : null,
        usingAPI: enrichedData !== null
    };
}

// Display results
function displayResults(stats, yearStr) {
    // Update title
    const titleText = yearStr === 'all' 
        ? '🎬 YOUR YOUTUBE WRAPPED - ALL TIME 🎬'
        : `🎬 YOUR YOUTUBE WRAPPED ${yearStr} 🎬`;
    document.getElementById('results-title').textContent = titleText;
    
    // Total videos
    document.getElementById('total-videos').textContent = stats.totalVideos.toLocaleString();
    
    // Unique videos
    document.getElementById('unique-videos').textContent = stats.uniqueVideos.toLocaleString();
    
    // Watch time - use API data if available
    let watchTimeText;
    let totalMinutes;
    let isExact = false;
    
    if (stats.totalWatchSeconds) {
        // Exact time from API
        totalMinutes = stats.totalWatchSeconds / 60;
        watchTimeText = formatWatchTime(totalMinutes) + ' ✓';
        isExact = true;
    } else {
        // Estimated time
        const avgMinutes = 11.7; // Average YouTube video length
        totalMinutes = stats.totalVideos * avgMinutes;
        watchTimeText = '~' + formatWatchTime(totalMinutes);
    }
    document.getElementById('watch-time').textContent = watchTimeText;
    
    // Total minutes as number
    const minutesText = isExact 
        ? Math.round(totalMinutes).toLocaleString()
        : '~' + Math.round(totalMinutes).toLocaleString();
    document.getElementById('total-minutes').textContent = minutesText;
    
    // Unique videos
    document.getElementById('unique-videos').textContent = stats.uniqueVideos.toLocaleString();
    
    // Key metrics summary (prominently displayed)
    document.getElementById('key-minutes').textContent = minutesText;
    document.getElementById('key-videos').textContent = stats.totalVideos.toLocaleString();
    if (stats.topChannels && stats.topChannels.length > 0) {
        document.getElementById('key-channel').textContent = stats.topChannels[0][0];
    } else {
        document.getElementById('key-channel').textContent = '-';
    }
    
    // Top channels
    displayTopChannels(stats.topChannels);
    
    // Monthly chart
    displayMonthlyChart(stats.monthlyData);
    
    // Categories chart (if API data available)
    if (stats.topCategories) {
        displayCategoriesChart(stats.topCategories);
        document.getElementById('categories-card').style.display = 'block';
    } else {
        document.getElementById('categories-card').style.display = 'none';
    }
}

// Format watch time
function formatWatchTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
        return `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
        return `${hours}h`;
    } else {
        return `${Math.floor(minutes)}m`;
    }
}

// Display top channels
function displayTopChannels(channels) {
    const container = document.getElementById('top-channels');
    container.innerHTML = '';
    
    channels.forEach(([name, count], index) => {
        const item = document.createElement('div');
        item.className = 'channel-item';
        
        const medals = ['🥇', '🥈', '🥉'];
        const medal = medals[index] || `#${index + 1}`;
        
        item.innerHTML = `
            <div class="channel-rank">${medal}</div>
            <div class="channel-name">${escapeHtml(name)}</div>
            <div class="channel-count">${count} videos</div>
        `;
        
        container.appendChild(item);
    });
}

// Display monthly chart
function displayMonthlyChart(monthlyData) {
    const container = document.getElementById('monthly-chart');
    container.innerHTML = '';
    
    const maxCount = Math.max(...Object.values(monthlyData));
    
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    months.forEach(month => {
        const count = monthlyData[month];
        if (count === 0) return; // Skip months with no data
        
        const percentage = (count / maxCount) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.innerHTML = `
            <div class="chart-label">${month}</div>
            <div class="chart-bar-fill" style="width: ${percentage}%"></div>
            <div class="chart-value">${count}</div>
        `;
        
        container.appendChild(bar);
    });
}

// Display categories chart
function displayCategoriesChart(categories) {
    const container = document.getElementById('categories-chart');
    container.innerHTML = '';
    
    const maxCount = Math.max(...categories.map(c => c[1]));
    
    categories.forEach(([name, count]) => {
        const percentage = (count / maxCount) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.innerHTML = `
            <div class="chart-label">${escapeHtml(name)}</div>
            <div class="chart-bar-fill" style="width: ${percentage}%; background: linear-gradient(90deg, #ffa726, #ffb74d);"></div>
            <div class="chart-value">${count}</div>
        `;
        
        container.appendChild(bar);
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
