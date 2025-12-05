// YouTube Wrapped - Client-side Analysis
let uploadedData = null;

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
        analyzeBtn.disabled = false;
        
        // Read file
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                uploadedData = JSON.parse(event.target.result);
                console.log(`Loaded ${uploadedData.length} entries`);
            } catch (error) {
                alert('Error reading file. Please make sure it\'s a valid JSON file.');
                analyzeBtn.disabled = true;
            }
        };
        reader.readAsText(file);
    }
});

// Analyze button handler
analyzeBtn.addEventListener('click', () => {
    if (!uploadedData) return;
    
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

// Main analysis function
function analyzeData(data, yearStr) {
    // Show loading
    uploadSection.classList.add('hidden');
    loadingSection.classList.remove('hidden');
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
        const stats = processData(data, yearStr);
        displayResults(stats, yearStr);
        
        // Hide loading, show results
        loadingSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// Process the watch history data
function processData(data, yearStr) {
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
    }
    
    // Calculate unique videos
    const uniqueVideos = new Set(videoTitles).size;
    
    // Sort channels by count
    const topChannels = Object.entries(channels)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
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
        daysInRange
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
    
    // Estimated watch time
    const avgMinutes = 11.7; // Average YouTube video length
    const totalMinutes = stats.totalVideos * avgMinutes;
    const watchTimeText = formatWatchTime(totalMinutes);
    document.getElementById('watch-time').textContent = watchTimeText;
    
    // Average per day
    const avgPerDay = (stats.totalVideos / stats.daysInRange).toFixed(1);
    document.getElementById('avg-per-day').textContent = avgPerDay;
    
    // Top channels
    displayTopChannels(stats.topChannels);
    
    // Monthly chart
    displayMonthlyChart(stats.monthlyData);
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

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
