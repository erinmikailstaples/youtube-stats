# OAuth Setup Guide

To enable Google Sign-In for your YouTube Stats app, follow these steps.

## Step 1: Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**

## Step 2: Configure OAuth Consent Screen

If you haven't configured the consent screen yet:

1. Click **Configure Consent Screen**
2. Choose **External** (unless you have a Google Workspace account)
3. Fill in required fields:
   - **App name**: YouTube Stats
   - **User support email**: Your email
   - **Developer contact**: Your email
4. Click **Save and Continue**
5. **Scopes**: Click **Add or Remove Scopes**
   - Add: `https://www.googleapis.com/auth/youtube.readonly`
   - This allows reading YouTube data
6. Click **Save and Continue**
7. **Test users**: Add your email address
8. Click **Save and Continue**

## Step 3: Create OAuth Client ID

1. **Application type**: Web application
2. **Name**: YouTube Stats Web
3. **Authorized JavaScript origins**:
   - Add: `https://your-netlify-site.netlify.app`
   - Add: `http://localhost:8000` (for local testing)
4. **Authorized redirect URIs**: (Leave empty for now)
5. Click **Create**

## Step 4: Copy Your Client ID

You'll get a **Client ID** that looks like:
```
1234567890-abc123def456.apps.googleusercontent.com
```

## Step 5: Update Your App

### Option A: Environment Variable (Recommended for Netlify)

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add new variable:
   - **Key**: `GOOGLE_CLIENT_ID`
   - **Value**: Your client ID
3. Redeploy your site

### Option B: Direct Update (Quick but less secure)

1. Open `public/index.html`
2. Find this line:
   ```html
   data-client_id="YOUR_CLIENT_ID_HERE"
   ```
3. Replace `YOUR_CLIENT_ID_HERE` with your actual Client ID
4. Commit and push

## Step 6: Test

1. Visit your deployed site
2. Click "Sign in with Google"
3. Grant permissions
4. You should see "Signed in as [your-email]"

## Current Limitations

⚠️ **Important**: The current implementation has a limitation:

Google Sign-In provides an **ID token** (for authentication), but to access YouTube data, we need an **access token**.

### What Works Now:
- ✅ Sign in with Google
- ✅ Display user email
- ✅ Show signed-in status

### What Doesn't Work Yet:
- ❌ Fetch YouTube data (requires access token)
- ❌ API calls to YouTube

### The Problem:

Google's new Sign-In library (GSI) provides ID tokens for authentication, but YouTube API calls require access tokens. There are two solutions:

#### Solution 1: Use Google Identity Services with Token Model

Update the implementation to request an access token instead of an ID token:

```html
<!-- Replace the current g_id_onload div with: -->
<script>
function handleAuthResponse(response) {
    // response.access_token is what we need
    const accessToken = response.access_token;
    // Use this to make YouTube API calls
}

google.accounts.oauth2.initTokenClient({
    client_id: 'YOUR_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    callback: handleAuthResponse,
}).requestAccessToken();
</script>
```

#### Solution 2: Server-Side Token Exchange (More Complex)

Set up a backend to exchange the ID token for an access token.

## Recommended Approach

For now, **I recommend keeping the current setup**:

1. **Best option**: Upload Takeout file (complete data)
2. **Enhanced option**: Takeout + API key (exact times + categories)
3. **OAuth option**: Coming soon (needs token implementation)

## Why OAuth is Complex

- Google deprecated the old OAuth flow
- New GSI library requires different token handling
- Access tokens need proper scope configuration
- Token refresh logic needed for long sessions

## Next Steps

If you want full OAuth support:

1. Implement token model (Solution 1 above)
2. Test locally
3. Deploy and verify
4. Add token refresh logic

Would you like me to implement the full access token flow?

## Security Notes

- Never commit Client IDs to public repos (use environment variables)
- Client IDs are safe to expose (they're meant to be public)
- Client Secrets should NEVER be in client-side code
- Always use HTTPS in production

## Troubleshooting

**"Invalid client ID"**
- Check that the Client ID is correct
- Verify your domain is in Authorized JavaScript origins

**"Redirect URI mismatch"**
- Not needed for GSI credential flow
- Only needed for redirect-based OAuth

**Sign-in button doesn't appear**
- Check browser console for errors
- Verify Google GSI script is loaded
- Check that Client ID is set

## Resources

- [Google Identity Services](https://developers.google.com/identity/gsi/web)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [OAuth 2.0 Scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
