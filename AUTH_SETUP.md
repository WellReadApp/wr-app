# WellRead Authentication Setup

## Overview
Complete authentication system with login, signup, route protection, and Apollo Client integration.

## Features Implemented

### 🔐 Authentication System
- **Login Page**: Email/password authentication with error handling
- **Signup Page**: User registration with password confirmation
- **Protected Routes**: All app routes secured with authentication
- **Logout**: Secure logout functionality integrated in Profile page

### 🔌 Apollo Client Integration
- GraphQL client configured with authentication headers
- Automatic token management via localStorage
- Network-first fetch policy for fresh data

### 🎨 UI/UX
- Beautiful gradient design using WellRead's color palette (#E87968, #F7B8A1)
- Responsive forms with validation
- Loading states and error messages
- Consistent design language across all auth screens

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
VITE_GRAPH_URL=http://localhost:4000
```

### Backend GraphQL API
The app connects to your GraphQL backend with these operations:

**Queries:**
- `login(email, password)` - Returns auth token
- `get_me` - Returns current user data

**Mutations:**
- `signup(email, password, first_name, last_name)` - Creates new user
- `logout` - Invalidates current token
- `update_user_profile` - Updates user information
- `change_password` - Changes user password
- `forgot_password` - Initiates password reset
- `reset_password` - Completes password reset

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx      # Route wrapper for authentication
├── pages/
│   ├── Login.tsx               # Login page component
│   ├── Signup.tsx              # Signup page component
│   └── Profile.tsx             # Updated with real user data
├── services/
│   ├── apolloClient.ts         # Apollo Client configuration
│   └── userQueries.ts          # GraphQL queries and mutations
├── utils/
│   └── AuthContext.tsx         # Authentication context provider
└── vite-env.d.ts              # TypeScript environment types
```

## How It Works

### 1. Authentication Flow
1. User enters credentials on Login/Signup page
2. GraphQL mutation/query sent to backend
3. Token received and stored in localStorage
4. User data fetched with `get_me` query
5. User redirected to home page

### 2. Route Protection
All routes are wrapped with `<ProtectedRoute>`:
- Checks for valid auth token
- Shows loading state while verifying
- Redirects to `/login` if not authenticated

### 3. Token Management
- Stored in localStorage as `authToken`
- Automatically included in GraphQL request headers
- Removed on logout

### 4. User Context
The `AuthContext` provides:
```typescript
{
  user: User | null,           // Current user data
  token: string | null,        // Auth token
  loading: boolean,            // Loading state
  login: (email, password),    // Login function
  signup: (...),               // Signup function
  logout: (),                  // Logout function
  refetchUser: ()              // Refresh user data
}
```

## Usage Examples

### Using Auth in Components
```typescript
import { useAuth } from '../utils/AuthContext';

function MyComponent() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Welcome, {user?.first_name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated GraphQL Requests
```typescript
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../services/userQueries';

function ProfileEditor() {
  const [updateProfile] = useMutation(UPDATE_USER_PROFILE);
  
  const handleUpdate = async () => {
    await updateProfile({
      variables: {
        firstName: 'John',
        lastName: 'Doe'
      }
    });
  };
}
```

## Running the App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Make sure your backend is running on:**
   ```
   http://localhost:4000
   ```

4. **Access the app:**
   ```
   http://localhost:5173
   ```

## Security Notes

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All authenticated routes are protected
- Passwords must be at least 8 characters
- Backend implements bcrypt password hashing
- Token validation happens on every protected route

## Next Steps

To replace mock data with real GraphQL data:
1. Create GraphQL schemas for books, reading progress, etc.
2. Update components to use Apollo hooks instead of mockData
3. Implement real-time sync for reading progress
4. Add optimistic UI updates for better UX

## TypeScript Support

Full TypeScript support with proper types for:
- User objects
- Auth context
- GraphQL responses
- Environment variables

## Dependencies

- `@apollo/client` - GraphQL client
- `graphql` - GraphQL query language
- `react-router-dom` - Routing
- `lucide-react` - Icons
