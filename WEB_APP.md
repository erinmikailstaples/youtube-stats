# YouTube Stats Web App

A beautiful, privacy-focused web application for analyzing your YouTube watch history.

## Features

- 🎨 **Beautiful UI** - YouTube-themed dark interface with smooth animations
- 🔒 **100% Private** - All processing happens in your browser, nothing is uploaded
- 📊 **Comprehensive Stats** - View total watch time, videos watched, top channels, and more
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
- 🚀 **Fast** - Instant analysis, no waiting for server processing
- 📤 **Shareable** - Share your stats with friends

## How It Works

1. **Upload** your `watch-history.json` file from Google Takeout
2. **Select** the year you want to analyze (or "All Time")
3. **View** your personalized YouTube Wrapped stats
4. **Share** your results with friends!

## Technical Details

### Architecture

- **Frontend**: Vanilla JavaScript (no framework needed!)
- **Styling**: CSS3 with CSS variables for theming
- **Processing**: Client-side JSON parsing and analysis
- **Hosting**: Static files on Netlify CDN

### Privacy & Security

- ✅ No server-side processing
- ✅ No data storage
- ✅ No cookies or tracking
- ✅ No external dependencies or CDNs
- ✅ HTTPS enforced
- ✅ Security headers configured

### Performance

- Lightning-fast analysis of large JSON files (100K+ entries)
- Optimized DOM updates for smooth animations
- Lazy loading for better initial page load
- Minimal CSS/JS bundle size

## Local Development

Run locally:

```bash
# Option 1: Python
python -m http.server 8000 --directory public
# Then open http://localhost:8000

# Option 2: Node.js
npx serve public
# Then open http://localhost:3000

# Option 3: PHP
php -S localhost:8000 -t public
```

## File Structure

```
public/
├── index.html      # Main HTML structure
├── styles.css      # All styling and animations
├── app.js          # Client-side analysis logic
└── _redirects      # Netlify routing config
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE not supported (uses modern JS features)

## Customization

### Theming

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #ff0000;  /* YouTube red */
    --background: #0f0f0f;     /* Dark background */
    --card-bg: #1f1f1f;        /* Card background */
}
```

### Analytics Logic

Modify analysis in `app.js`:

```javascript
// Change average video length estimate
const avgMinutes = 11.7;  // Current estimate

// Adjust top channels count
.slice(0, 10);  // Show top 10 channels
```

## API Reference

### Main Functions

#### `analyzeData(data, yearStr)`
Orchestrates the analysis process
- **Parameters**: 
  - `data`: Array of watch history entries
  - `yearStr`: Year to analyze or 'all'
- **Returns**: void (updates UI)

#### `processData(data, yearStr)`
Processes raw watch history data
- **Parameters**:
  - `data`: Array of watch history entries  
  - `yearStr`: Year to analyze or 'all'
- **Returns**: Object with stats

#### `displayResults(stats, yearStr)`
Updates DOM with analysis results
- **Parameters**:
  - `stats`: Processed statistics object
  - `yearStr`: Year analyzed
- **Returns**: void

## Roadmap

Future enhancements:

- [ ] Export results as image
- [ ] Dark/light theme toggle
- [ ] More detailed analytics
- [ ] Video category breakdown
- [ ] Watch time heatmap
- [ ] Compare years side-by-side
- [ ] Download stats as PDF

## Contributing

Want to improve the web app? Check out the [main README](README.md) for contribution guidelines.

## License

MIT - See [LICENSE](LICENSE) for details
