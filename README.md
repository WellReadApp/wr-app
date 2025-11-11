# WellRead - Personal Growth Reading App

A beautiful mobile-first reading app that helps users grow through curated book content, with complete authentication and GraphQL integration.

## ✨ Features

- 📚 **Curated Reading Experience** - Discover and read growth-focused books
- 🔐 **Complete Authentication** - Secure login/signup with JWT tokens
- 📊 **Progress Tracking** - Track your reading journey and achievements
- 🎯 **Growth Plans** - Set and achieve personal development goals
- 💬 **Interactive Features** - Flashcards, highlights, and more
- 🎨 **Beautiful UI** - Modern, gradient-based design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- GraphQL backend running on `http://localhost:4000`

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```env
   VITE_GRAPH_URL=http://localhost:4000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:5173
   ```

## 🔐 Authentication

Complete authentication system implemented with:
- Login and signup pages
- **Forgot Password** - Email-based password reset
- **Reset Password** - Token-based password recovery
- **Change Password** - In-app password updates
- Protected routes
- Token-based authentication
- User profile management
- Secure logout

**First time?** You'll be redirected to the login page. Click "Sign up" to create an account!

For detailed authentication documentation, see [AUTH_SETUP.md](./AUTH_SETUP.md)
For password features documentation, see [PASSWORD_FEATURES.md](./PASSWORD_FEATURES.md)

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── AudioPlayer.tsx
│   ├── BottomNav.tsx
│   ├── FlashcardQuotes.tsx
│   ├── InlineFlashcards.tsx
│   └── ProtectedRoute.tsx
├── pages/            # Page components
│   ├── Home.tsx
│   ├── BookDetail.tsx
│   ├── ReadView.tsx
│   ├── GrowthPlan.tsx
│   ├── Search.tsx
│   ├── ReadingList.tsx
│   ├── Profile.tsx
│   ├── Login.tsx
│   └── Signup.tsx
├── services/         # API and GraphQL
│   ├── apolloClient.ts
│   └── userQueries.ts
└── utils/           # Utilities and context
    ├── AuthContext.tsx
    └── mockData.ts
```

## 🎨 Design System

### Colors
- Primary: `#E87968` (Coral/Salmon)
- Secondary: `#F7B8A1` (Peach)
- Background: `#FCF8F5` (Light Cream)
- Text: `#333333` (Dark Gray)

### Design Philosophy
- Mobile-first responsive design
- Gradient backgrounds for visual depth
- Smooth animations and transitions
- Clean, modern interface

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Lint code
```

## 📚 Documentation

- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Detailed authentication documentation
- **[PASSWORD_FEATURES.md](./PASSWORD_FEATURES.md)** - Password management features
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide for developers
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Comprehensive testing guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Implementation details

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Apollo Client** - GraphQL client
- **Lucide React** - Icons

## 🔌 GraphQL Integration

The app connects to your GraphQL backend with these operations:

### Authentication
- `login` - User login
- `signup` - User registration
- `get_me` - Get current user
- `logout` - Logout user

### User Management
- `update_user_profile` - Update profile
- `change_password` - Change password
- `forgot_password` - Request password reset
- `reset_password` - Complete password reset

See `src/services/userQueries.ts` for all available operations.

## 🧪 Testing

Follow the comprehensive testing checklist in [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

Quick test:
```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

## 🚧 Roadmap

### Phase 1: Authentication ✅
- [x] Login/Signup pages
- [x] Protected routes
- [x] Apollo Client setup
- [x] Token management

### Phase 2: Real Data Integration (In Progress)
- [ ] Replace mock data with GraphQL queries
- [ ] Implement book fetching
- [ ] Track reading progress
- [ ] Sync user statistics

### Phase 3: Enhanced Features
- [ ] Password reset flow
- [ ] Email verification
- [ ] Social authentication
- [ ] Offline support

## 🐛 Troubleshooting

**Can't log in?**
- Ensure backend is running on `http://localhost:4000`
- Check browser console for errors
- Verify CORS is enabled on backend

**Build errors?**
- Delete `node_modules` and run `npm install` again
- Clear cache: `rm -rf node_modules/.vite`

**TypeScript errors?**
- Restart TypeScript server in VS Code
- Check `tsconfig.json` configuration

For more help, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

## 📄 License

This project was generated by [Magic Patterns](https://magicpatterns.com)

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

---

**Status:** ✅ Authentication Complete | 🚧 Data Integration In Progress

Made with ❤️ for personal growth and learning
