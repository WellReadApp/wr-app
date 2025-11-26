# PWA Update Flow - Testing & Verification Guide

## How the Update System Works

### The Complete Update Flow

1. **New Version Deployed**
   - You push changes to main branch
   - Build creates new service worker with unique timestamp version
   - New `sw.js` is deployed with updated `CACHE_VERSION`

2. **User Opens App**
   - Service worker checks for updates (compares `sw.js` byte-by-byte)
   - If different, starts installing new service worker
   - Console shows: `[SW] Installing new service worker, version: {timestamp}`

3. **New Service Worker Installed**
   - New SW completes installation
   - Enters "waiting" state (doesn't activate immediately)
   - Update notification appears to user
   - Console shows: `[Update] New version ready to activate`

4. **User Clicks "Update Now"**
   - Button sends `SKIP_WAITING` message to waiting service worker
   - Service worker calls `self.skipWaiting()` to activate immediately
   - Service worker sends `RELOAD_PAGE` message back to app
   - Page reloads automatically with new version
   - Console shows:
     ```
     [Update] Activating new service worker
     [SW] Received SKIP_WAITING message, activating new version
     [SW] Activating new service worker, version: {new_timestamp}
     [SW] Deleting old cache: wellread-v{old_timestamp}-static
     [Update] Received reload message from service worker
     ```

5. **User Clicks "Later"**
   - Notification dismisses
   - Waiting service worker stays in waiting state
   - When user fully closes the app (all tabs/windows)
   - Next time they open, new service worker activates automatically
   - No notification needed, seamless update

## Testing the Update Flow

### Local Testing

1. **Initial Setup**
   ```bash
   # Build the app
   npm run build
   
   # Serve it locally
   npx serve -s dist -p 3000
   ```

2. **Install the PWA**
   - Open http://localhost:3000 in your browser
   - Install the PWA (Add to Home Screen)
   - Open the installed PWA
   - Open DevTools Console

3. **Make a Change**
   ```bash
   # In another terminal, make any small change
   # For example, edit a text string in any component
   
   # Build again
   npm run build
   ```

4. **Trigger Update Check**
   - In the installed PWA, open DevTools Console
   - Run this command to manually trigger update check:
   ```javascript
   navigator.serviceWorker.getRegistration().then(reg => reg.update())
   ```
   - Wait 5-10 seconds
   - You should see update notification appear

5. **Test "Update Now" Button**
   - Click "Update Now"
   - Watch console logs
   - Page should reload automatically
   - New version should be active

### Production Testing

1. **Deploy Changes**
   ```bash
   git add .
   git commit -m "test: verify update flow"
   git push origin main
   ```

2. **Wait for Deployment** (~2-3 minutes)

3. **Open Installed PWA**
   - Launch your installed PWA
   - Keep it open for 60 seconds (update check runs every 60s)
   - Watch for update notification

4. **Click "Update Now"**
   - Should reload and show new version
   - Check console for logs

## Console Logs Reference

### Successful Update Flow

```
// Initial load
[SW] Registered successfully, scope: /
[SW] Activating new service worker, version: 1764172036998

// Update check finds new version
[Update] Checking for updates...
[Update] New service worker found, state: installing
[Update] Service worker state changed to: installed
[Update] New version ready to activate
[Update] Found waiting service worker

// User clicks "Update Now"
[Update] Activating new service worker
[SW] Received SKIP_WAITING message, activating new version
[SW] Activating new service worker, version: 1764172500000
[SW] Deleting old cache: wellread-v1764172036998-static
[SW] Deleting old cache: wellread-v1764172036998-runtime
[SW] Controller changed, reloading all clients
[Update] Received reload message from service worker
```

### If User Clicks "Later"

```
[Update] New version ready to activate
[Update] Found waiting service worker
[Update] User dismissed update notification

// User closes app and reopens later
[SW] Activating new service worker, version: 1764172500000
[SW] Deleting old cache: wellread-v1764172036998-static
// App now running new version, no notification needed
```

## Troubleshooting

### Update Notification Doesn't Appear

**Check:**
1. Open DevTools → Application → Service Workers
2. Verify there's a waiting service worker
3. Check console for `[Update]` logs
4. Manually trigger update check:
   ```javascript
   navigator.serviceWorker.getRegistration().then(reg => reg.update())
   ```

**Common Causes:**
- Service worker not registered
- No actual changes in the build (cache version is same)
- Browser cache preventing SW update
- App not running in installed mode

### "Update Now" Button Doesn't Work

**Check Console For:**
- `[Update] No waiting worker found` → Service worker issue
- `[SW] Received SKIP_WAITING message` → Should appear when clicked
- `[Update] Fallback reload` → Automatic reload after 1 second

**Try:**
1. Click button multiple times
2. Wait 1-2 seconds for fallback reload
3. Manually reload: `window.location.reload()`

**Debug:**
```javascript
// Check if waiting worker exists
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Registration:', reg);
  console.log('Waiting:', reg.waiting);
  console.log('Active:', reg.active);
});
```

### Page Doesn't Reload After Clicking Update

**If page doesn't reload:**
- Fallback timer (1 second) should trigger reload
- Check if page is frozen/hung
- Check browser console for errors
- Manually reload the page

**Service Worker Message Not Received:**
- Check if service worker supports `postMessage`
- Verify message event listener is attached
- Try opening/closing DevTools (sometimes helps)

### Old Version Still Shows After Update

**Clear Everything:**
1. DevTools → Application → Clear storage → Clear site data
2. Unregister service worker
3. Close all tabs/windows
4. Reinstall PWA
5. Test update flow again

## Best Practices

### When Deploying

1. **Always test locally first**
   ```bash
   npm run build
   npx serve -s dist -p 3000
   ```

2. **Check build output**
   - Verify you see: `✅ Service worker versioned: {timestamp}`
   - Timestamp should be different from previous build

3. **Deploy and monitor**
   - Push to production
   - Test with installed PWA after 2-3 minutes
   - Watch console logs
   - Verify update notification appears

4. **Document breaking changes**
   - If update is critical, inform users
   - Consider adding update notes to notification

### For Users

1. **When you see update notification:**
   - Click "Update Now" for immediate update with latest features
   - Click "Later" if busy - update happens next time you open app

2. **If app seems outdated:**
   - Close app completely (swipe away/quit)
   - Reopen app - should get latest version
   - If still old, check for update notification

3. **Nuclear option (if nothing works):**
   - Uninstall PWA
   - Clear browser data for the site
   - Reinstall PWA
   - Should get fresh version

## Update Notification Behavior

### When It Appears
- New service worker installed and waiting
- User is actively using the app
- Shows once per update (doesn't spam)

### When It Doesn't Appear
- No new version available
- App just opened (gives time to load)
- User already updated
- App closed (updates automatically on reopen)

### Button Behavior

**"Update Now"**
- Activates new service worker immediately
- Reloads page within 1 second
- Shows new version right away
- Best for getting latest features/fixes

**"Later"**
- Dismisses notification
- Keeps waiting service worker ready
- Update happens automatically on next app open
- Good if user is in middle of something

## Technical Details

### Service Worker Lifecycle

```
[New SW deployed]
    ↓
[Installing] ← Downloading and caching assets
    ↓
[Installed/Waiting] ← Ready but not active yet
    ↓ (user clicks "Update Now" OR closes app)
[Activating] ← Cleaning old caches, taking control
    ↓
[Activated] ← New version is live!
```

### Message Flow

```
User clicks "Update Now"
    ↓
UpdateNotification.tsx: waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    ↓
sw.js: Receives message, calls self.skipWaiting()
    ↓
sw.js: Activates, sends postMessage({ type: 'RELOAD_PAGE' })
    ↓
UpdateNotification.tsx: Receives message, calls window.location.reload()
    ↓
Page reloads with new version
```

### Cache Versioning

- **Format:** `wellread-v{timestamp}`
- **Example:** `wellread-v1764172036998`
- **Uniqueness:** Timestamp from `Date.now()` at build time
- **Storage:** Two caches per version:
  - `wellread-v{timestamp}-static` - Precached assets
  - `wellread-v{timestamp}-runtime` - Dynamically cached
- **Cleanup:** Old caches deleted on activation

## Performance Impact

### Update Check
- Runs every 60 seconds
- Lightweight HTTP request to check `sw.js`
- No impact on app performance
- Only downloads if different

### Update Activation
- ~1-2 seconds to activate
- Deletes old caches (few KB to few MB)
- Page reload required (unavoidable)
- New assets already cached

### Network Usage
- Initial install: Downloads all assets
- Updates: Only downloads changed files
- Service worker: ~10KB
- Most bandwidth from app bundle (~130KB gzipped)

## Security Considerations

### Service Worker Scope
- Limited to app origin
- Cannot access other sites
- Runs in isolated context
- No access to DOM directly

### Update Authenticity
- Must come from same origin
- HTTPS required (except localhost)
- Browser verifies signature
- No man-in-the-middle attacks

### User Control
- User must click to update immediately
- Can always choose "Later"
- No forced updates without interaction
- Respects user's workflow

## FAQ

**Q: How often does it check for updates?**  
A: Every 60 seconds, plus on page load.

**Q: What if I don't click either button?**  
A: Notification shows until you click. Update happens automatically when you close and reopen the app.

**Q: Can I force an update without the notification?**  
A: Yes, in DevTools Console:
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg.waiting) {
    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(() => window.location.reload(), 100);
  }
});
```

**Q: What happens if I close the app while update is installing?**  
A: No problem! The new service worker will activate automatically when you reopen.

**Q: How do I know what version I'm on?**  
A: Check DevTools → Application → Service Workers → Active worker source.

**Q: Can I disable auto-updates?**  
A: Not recommended, but you can set the interval to a very high value in `UpdateNotification.tsx` (line 64).

**Q: What if update fails?**  
A: Old version keeps running. Update will retry on next check (60s).

**Q: Does this work offline?**  
A: Update check requires network. If offline, update happens when back online.

## Support

If you encounter issues:
1. Check console logs (match against examples above)
2. Verify service worker state in DevTools
3. Try the troubleshooting steps
4. If all else fails: Uninstall and reinstall PWA
