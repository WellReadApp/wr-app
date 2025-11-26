# PWA Auto-Update System

## Overview
Your PWA now has a robust auto-update system that prevents the blank screen issue when deploying new versions. Users will be notified when updates are available and can update with a single click.

## What Changed

### 1. Service Worker Updates (`public/sw.js`)
- **Dynamic Cache Versioning**: Cache version is now based on build timestamp, automatically changing with each deployment
- **Network-First Strategy**: For navigation and critical assets, ensures users get the latest content
- **Skip Waiting**: New service workers activate immediately instead of waiting for all tabs to close
- **Automatic Cache Cleanup**: Old caches are automatically deleted when new versions activate
- **Clients Claim**: New service worker takes control immediately after activation

### 2. Update Notification Component (`src/components/UpdateNotification.tsx`)
- Displays a user-friendly notification when updates are available
- Gives users control: "Update Now" or "Later"
- Automatically checks for updates every 60 seconds
- Positioned at bottom of screen (above bottom navigation)
- Smooth slide-up animation

### 3. Enhanced Service Worker Registration (`index.html`)
- Checks for updates immediately on load
- Periodic update checks every 5 minutes
- Improved logging for debugging
- Handles controller changes

### 4. Build-Time Versioning (`vite.config.ts`)
- Vite plugin automatically injects unique version into service worker
- Version based on build timestamp ensures every build is unique
- Asset files include content hashes for cache busting

## How It Works

### Automatic Update Flow
1. **User visits app** → Service worker checks for updates automatically
2. **New version detected** → New service worker installs in background
3. **Installation complete** → App automatically activates new version and reloads
4. **User sees fresh content** → No interaction needed, seamless update!

### What Users Experience
- **No notifications** - Updates happen silently in background
- **Automatic reload** - Page refreshes automatically (takes ~1 second)
- **Latest version** - Always running the newest code
- **Zero disruption** - Happens so fast users barely notice

### Automatic Checks
- On page load
- Every 60 seconds (background check)
- When service worker detects a new version
- Instant activation and reload when found

### Caching Strategy
- **Navigation requests**: Network-first (always try to get latest HTML/JS)
- **API requests**: Network-only (never cache GraphQL data)
- **Static assets**: Network-first with cache fallback
- **Images/icons**: Cache-first with background update

## Testing the Update System

### Local Testing
```bash
# 1. Build the app
npm run build

# 2. Serve the dist folder
npx serve -s dist -p 3000

# 3. Open in browser and install PWA
# Visit http://localhost:3000

# 4. Make a code change
# Edit any component file

# 5. Build again
npm run build

# 6. Refresh the served folder
# The app should detect the update and show notification
```

### Production Testing
```bash
# 1. Deploy to production
git push origin main

# 2. Wait for deployment to complete

# 3. Open the installed PWA
# The app will check for updates within 5 minutes

# 4. Update notification appears
# Click "Update Now" to get latest version
```

## Key Features

### ✅ No More Blank Screens
- Network-first strategy ensures latest content is always fetched
- Old caches are automatically cleaned up
- Service worker activates immediately

### ✅ Seamless Updates
- No user interaction required
- Automatic reload when new version detected
- Updates happen in background
- Fast transition (~1 second)

### ✅ Automatic Version Management
- Each build gets unique version number
- No manual version bumping required
- Build timestamp ensures uniqueness

### ✅ Smart Caching
- API requests never cached (always fresh data)
- Static assets cached for offline support
- HTML/JS always checked for updates

## Troubleshooting

### Update notification doesn't appear
1. Check browser console for service worker logs
2. Manually check for updates: DevTools → Application → Service Workers → Update
3. Ensure you're using the installed PWA (not browser tab)

### Old version still showing after update
1. Check if service worker is activated: DevTools → Application → Service Workers
2. Clear all caches: DevTools → Application → Clear storage
3. Unregister service worker and reinstall PWA

### Service worker not registering
1. Check browser console for errors
2. Ensure HTTPS (or localhost)
3. Verify sw.js is in dist folder after build

## Console Logs to Watch For

```
[Update] Checking for updates...
[Update] New service worker found, state: installing
[Update] Service worker state changed to: installed
[Update] New version installed, auto-updating...
[Update] Auto-activating new version...
[SW] Received SKIP_WAITING message, activating new version
[SW] Activating new service worker, version: 1764172650130
[SW] Deleting old cache: wellread-v1764172036998-static
[SW] Deleting old cache: wellread-v1764172036998-runtime
[Update] Reloading to apply update
// Page reloads automatically
✅ Service worker versioned: 1764172650130
```

## Best Practices

### When Deploying
1. Always test locally before deploying
2. Wait for build to complete before pushing
3. Monitor service worker logs after deployment
4. Keep an eye on user reports for first 24 hours

### For Users
- Updates happen automatically - no action needed
- App may refresh briefly when updates are applied
- This is normal and ensures you always have the latest features
- If experiencing issues, try closing and reopening the app

### Development
- Test update flow before each deployment
- Check console logs for service worker activity
- Use Chrome DevTools Application tab to debug

## Technical Details

### Cache Names
- **Static Cache**: `wellread-v{timestamp}-static` - Precached assets
- **Runtime Cache**: `wellread-v{timestamp}-runtime` - Dynamically cached assets

### Update Detection
- Service worker registration checks for updates
- Browser compares sw.js byte-by-byte
- If different, new service worker installs
- Update notification triggers when ready

### Version Format
- Format: Unix timestamp (milliseconds)
- Example: `1764156504081`
- Unique for every build
- Never repeats

## Future Enhancements

Potential improvements for the update system:
- [ ] Background sync for offline updates
- [ ] Update changelog display
- [ ] Analytics for update adoption rates
- [ ] A/B testing for update UI
- [ ] Force update for critical security patches

## Support

If you encounter issues with the auto-update system:
1. Check browser console for errors
2. Review service worker status in DevTools
3. Clear all caches and reinstall PWA
4. Report persistent issues with console logs
