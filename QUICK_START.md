# Quick Start Guide - WellRead Authentication

## ✅ What's Been Completed

Your WellRead app now has a complete authentication system with:

1. **Login & Signup Pages** - Beautiful, responsive forms with validation
2. **Protected Routes** - All app routes secured behind authentication
3. **Apollo Client** - Configured to work with your GraphQL backend (URL configured in `.env`)
4. **User Profile** - Updated to show real user data and logout functionality
5. **Token Management** - Automatic token storage and injection into API requests

## 🚀 Getting Started

### 1. Start Your Backend
Make sure your GraphQL backend is running and accessible at the URL specified in your `.env` file

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Try It Out
- Visit `http://localhost:5173`
- You'll be redirected to `/login` (all routes are protected)
- Click "Sign up" to create a new account
- After signup, you'll be automatically logged in
- Navigate through the app - all routes are now protected

## 📁 Key Files Created/Modified

### New Files:
- `.env` - Environment configuration
- `src/services/apolloClient.ts` - Apollo Client setup
- `src/services/userQueries.ts` - GraphQL queries/mutations
- `src/utils/AuthContext.tsx` - Authentication state management
- `src/pages/Login.tsx` - Login page
- `src/pages/Signup.tsx` - Signup page
- `src/components/ProtectedRoute.tsx` - Route protection wrapper
- `src/vite-env.d.ts` - TypeScript environment types
- `AUTH_SETUP.md` - Detailed documentation

### Modified Files:
- `src/App.tsx` - Added ApolloProvider, AuthProvider, and route protection
- `src/pages/Profile.tsx` - Integrated real user data and logout

## 🎨 Design

All auth screens use your existing color palette:
- Primary: `#E87968` (coral/salmon)
- Secondary: `#F7B8A1` (peach)
- Background: `#FCF8F5` (light cream)

## 🔐 How Authentication Works

1. **Signup Flow:**
   - User fills out signup form → 
   - GraphQL `signup` mutation creates account → 
   - Automatic login with `login` query → 
   - Token stored in localStorage → 
   - User data fetched with `get_me` → 
   - Redirect to home

2. **Login Flow:**
   - User enters credentials → 
   - GraphQL `login` query validates → 
   - Token stored in localStorage → 
   - User data fetched → 
   - Redirect to home

3. **Protected Routes:**
   - Every route checks for token
   - If no token → redirect to `/login`
   - If token exists → fetch user data and render page

4. **Logout:**
   - Click "Sign Out" in Profile → 
   - GraphQL `logout` mutation → 
   - Token removed from localStorage → 
   - Redirect to `/login`

## 🔧 Using the Auth System

### In Any Component:
```typescript
import { useAuth } from '../utils/AuthContext';

function MyComponent() {
  const { user, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Hello {user?.first_name}!</h1>
      <p>{user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making GraphQL Requests:
```typescript
import { useMutation } from '@apollo/client/react';
import { UPDATE_USER_PROFILE } from '../services/userQueries';

function EditProfile() {
  const [updateProfile, { loading, error }] = useMutation(UPDATE_USER_PROFILE);
  
  const handleSubmit = async (firstName, lastName) => {
    try {
      await updateProfile({
        variables: { firstName, lastName }
      });
      // Success!
    } catch (err) {
      console.error(err);
    }
  };
}
```

## 📊 GraphQL Operations Available

All defined in `src/services/userQueries.ts`:

- `LOGIN` - Query to login user
- `SIGNUP` - Mutation to create account
- `GET_ME` - Query current user info
- `LOGOUT` - Mutation to logout
- `UPDATE_USER_PROFILE` - Mutation to update user
- `CHANGE_PASSWORD` - Mutation to change password
- `FORGOT_PASSWORD` - Mutation to request password reset
- `RESET_PASSWORD` - Mutation to complete password reset

## 🎯 Next Steps

### Replace Mock Data with Real Data:

1. **Books**: Create GraphQL queries for fetching books
2. **Reading Progress**: Track user's reading progress in the backend
3. **Growth Plan**: Store and fetch user's growth goals
4. **Stats**: Calculate real user statistics from backend

### Example - Replacing Books:
```typescript
// Instead of:
import { mockBooks } from '../utils/mockData';

// Do:
import { useQuery } from '@apollo/client/react';
import { GET_BOOKS } from '../services/bookQueries';

function Home() {
  const { data, loading } = useQuery(GET_BOOKS);
  const books = data?.books || [];
  
  // Use books instead of mockBooks
}
```

## ⚠️ Important Notes

- **Backend Required**: The app will show errors if backend is not running
- **Token Storage**: Currently using localStorage (consider httpOnly cookies for production)
- **CORS**: Make sure your backend allows requests from `http://localhost:5173`
- **GraphQL Schema**: Backend must match the queries/mutations in `userQueries.ts`

## 🐛 Troubleshooting

**"Network error" or "Failed to fetch":**
- Check if backend is running and accessible at the URL in your `.env` file
- Verify CORS is enabled on backend
- Check browser console for detailed errors

**Stuck on loading screen:**
- Clear localStorage: `localStorage.removeItem('authToken')`
- Refresh page

**Login/Signup not working:**
- Check backend logs for errors
- Verify GraphQL schema matches expected format
- Check Network tab in DevTools for response

## 📚 Documentation

For detailed information, see `AUTH_SETUP.md`

## 🎉 You're Ready!

Your authentication system is fully integrated and ready to use. Start your backend, run the app, and create your first account!
