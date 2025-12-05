# Deployment Guide

## Deploy to Netlify

This project is configured to deploy as a static web application on Netlify. All data processing happens client-side in the browser for privacy.

### Quick Deploy (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/erinmikailstaples/youtube-stats)

### Manual Deployment

#### Option 1: Deploy via GitHub

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add web version"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your `youtube-stats` repository

3. **Configure Build Settings**:
   - Build command: `echo 'No build needed'`
   - Publish directory: `public`
   - Click "Deploy site"

4. **Done!** Your site will be live at `https://[random-name].netlify.app`

#### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   # From project root
   netlify deploy --prod --dir=public
   ```

#### Option 3: Drag & Drop Deploy

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `public` folder onto the page
3. Your site is live instantly!

### Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow instructions to configure DNS

### Environment Variables

No environment variables are needed! The app runs entirely client-side.

### Features

✅ **100% Client-Side** - Your data never leaves your browser  
✅ **No Backend Required** - Pure static HTML/CSS/JS  
✅ **Free Hosting** - Netlify free tier is perfect for this  
✅ **Instant Updates** - Changes deploy in seconds  
✅ **HTTPS by Default** - Secure out of the box  

### Updating Your Site

After making changes:

```bash
git add .
git commit -m "Update site"
git push origin main
```

Netlify will automatically rebuild and deploy!

### Troubleshooting

**Site not loading?**
- Check that `public` folder exists and contains `index.html`
- Verify netlify.toml is in the project root

**File upload not working?**
- Check browser console for errors
- Ensure the file is valid JSON
- Try a smaller file first to test

**Need help?**
- Check [Netlify docs](https://docs.netlify.com/)
- Open an issue on GitHub
