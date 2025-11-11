# Testing Checklist ✅

Use this checklist to verify your authentication system is working correctly.

## Backend Setup
- [ ] Backend server is running on `http://localhost:4000`
- [ ] GraphQL endpoint is accessible at `http://localhost:4000/graphql` (or your configured path)
- [ ] CORS is enabled for `http://localhost:5173`

## Frontend Setup
- [ ] `.env` file exists with `VITE_GRAPH_URL=http://localhost:4000`
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server starts without errors (`npm run dev`)
- [ ] Build succeeds (`npm run build`)

## Signup Flow
- [ ] Navigate to `http://localhost:5173`
- [ ] Automatically redirected to `/login`
- [ ] Click "Sign up" link
- [ ] Redirected to `/signup`
- [ ] Fill out signup form with valid data
- [ ] Password validation works (min 8 characters)
- [ ] Password confirmation validation works (must match)
- [ ] Click "Create Account"
- [ ] Shows loading state
- [ ] Account created successfully
- [ ] Automatically logs in after signup
- [ ] Redirected to home page (`/`)
- [ ] User data appears in Profile page

## Login Flow
- [ ] Start at login page (`/login`)
- [ ] Enter valid email and password
- [ ] Click "Sign In"
- [ ] Shows loading state
- [ ] Successfully logs in
- [ ] Token stored in localStorage (check DevTools → Application → Local Storage)
- [ ] Redirected to home page
- [ ] User data loaded correctly

## Login Error Handling
- [ ] Enter invalid email → shows error message
- [ ] Enter wrong password → shows error message
- [ ] Error message is user-friendly
- [ ] Error clears when resubmitting

## Signup Error Handling
- [ ] Try to signup with existing email → shows error
- [ ] Password too short → shows error
- [ ] Passwords don't match → shows error
- [ ] All required fields validated

## Protected Routes
- [ ] Logged out state: visiting `/` redirects to `/login`
- [ ] Logged out state: visiting `/profile` redirects to `/login`
- [ ] Logged out state: visiting `/book/1` redirects to `/login`
- [ ] Logged out state: visiting `/search` redirects to `/login`
- [ ] Logged in state: can access all routes
- [ ] Logged in state: `/login` still accessible (could redirect to home if preferred)

## Profile Page
- [ ] Navigate to Profile page
- [ ] User's initials/photo displayed correctly
- [ ] User's full name displayed
- [ ] User's email displayed
- [ ] Statistics displayed (uses mock data for now)
- [ ] Click "Sign Out" button
- [ ] Logs out successfully
- [ ] Redirected to `/login`
- [ ] Token removed from localStorage

## Token Persistence
- [ ] Log in successfully
- [ ] Refresh the page
- [ ] Still logged in (token persists)
- [ ] User data reloaded correctly
- [ ] Can navigate between pages without re-authenticating

## Token Expiration/Invalid Token
- [ ] Log in successfully
- [ ] Manually edit token in localStorage to invalid value
- [ ] Refresh page
- [ ] Redirected to login (invalid token handled)
- [ ] Old token removed from localStorage

## GraphQL Integration
- [ ] Open DevTools → Network tab
- [ ] Perform login → verify GraphQL request sent
- [ ] Check request headers include Authorization when logged in
- [ ] Check response contains expected data structure
- [ ] Verify all queries/mutations working:
  - [ ] `login` query
  - [ ] `signup` mutation
  - [ ] `get_me` query
  - [ ] `logout` mutation

## UI/UX
- [ ] Login page design matches WellRead color palette
- [ ] Signup page design matches WellRead color palette
- [ ] Forms are responsive on mobile
- [ ] Error messages are clearly visible
- [ ] Loading states show appropriate feedback
- [ ] Buttons disabled during loading
- [ ] Focus states work properly on form inputs
- [ ] Can tab through form fields

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Edge Cases
- [ ] Clear localStorage and refresh → redirects to login
- [ ] Backend is down → shows appropriate error
- [ ] Slow network → loading states work properly
- [ ] Navigate directly to `/signup` when logged in → allowed (or redirect to home)
- [ ] Navigate to non-existent route → redirects to home

## Security
- [ ] Password fields use `type="password"`
- [ ] Password not visible in DevTools Network tab (sent in request body)
- [ ] Token stored securely in localStorage
- [ ] Logout properly invalidates token on backend
- [ ] Protected routes cannot be accessed without token

## Ready for Production?
- [ ] All tests above pass
- [ ] No console errors
- [ ] No console warnings (or acceptable ones documented)
- [ ] Environment variables properly configured
- [ ] Build succeeds without errors
- [ ] Built app works in production mode (`npm run preview`)

---

## Notes Section
Use this space to note any issues found during testing:

```
Date: ___________
Tester: ___________

Issues Found:
1. 
2. 
3. 

Resolved:
1. 
2. 
3. 
```

## Backend Response Format Reference

Expected GraphQL responses:

**Login:**
```json
{
  "data": {
    "login": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Signup:**
```json
{
  "data": {
    "signup": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "picture_url": null
    }
  }
}
```

**Get Me:**
```json
{
  "data": {
    "get_me": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "picture_url": null,
      "created_at": "2025-11-11T...",
      "updated_at": "2025-11-11T..."
    }
  }
}
```

**Logout:**
```json
{
  "data": {
    "logout": true
  }
}
```
