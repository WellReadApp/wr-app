import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from './services/apolloClient';
import { AuthProvider } from './utils/AuthContext';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import PWAInstallationGate from './components/PWAInstallationGate';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import ReadView from './pages/ReadView';
import GrowthPlan from './pages/GrowthPlan';
import Search from './pages/Search';
import ReadingList from './pages/ReadingList';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

// PWA installation detection
const isStandalone = () => {
  // Check if running in standalone mode (actually installed as PWA)
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check iOS standalone
  const isIOSStandalone = (window.navigator as any).standalone;
  
  // Check for Android app referrer
  const hasAndroidAppReferrer = document.referrer.includes('android-app://');
  
  // Check for PWA source parameter
  const hasPWASource = window.location.search.includes('source=pwa');
  
  // Only return true if actually in standalone mode, not just on desktop
  return isStandaloneMode || isIOSStandalone || hasAndroidAppReferrer || hasPWASource;
};

// Development bypass for testing (only in development)
const hasBypass = () => {
  // Only allow bypass in development environment
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
  
  return isDevelopment && window.location.search.includes('bypass=true');
};

export function App() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isCheckingInstallation, setIsCheckingInstallation] = useState(true);

  useEffect(() => {
    // Check if the app is running in standalone mode or has bypass
    const checkInstallation = () => {
      const installed = isStandalone() || hasBypass();
      setIsInstalled(installed);
      setIsCheckingInstallation(false);
    };

    // Check immediately
    checkInstallation();

    // Periodic check to prevent bypass attempts (every 5 seconds)
    const periodicCheck = setInterval(() => {
      if (!isStandalone() && !hasBypass()) {
        setIsInstalled(false);
      }
    }, 5000);

    // Also listen for changes in display mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => {
      setIsInstalled(isStandalone() || hasBypass());
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      clearInterval(periodicCheck);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Show loading while checking installation
  if (isCheckingInstallation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FCF8F5] to-[#F7B8A1] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E87968] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#333333] font-medium">Loading WellRead...</p>
        </div>
      </div>
    );
  }

  // Show installation gate if not installed
  if (!isInstalled) {
    return <PWAInstallationGate />;
  }

  // Show main app if installed
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppErrorBoundary>
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
                    <Home />
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
                    <BookDetail />
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book/:id/read"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5]">
                    <ReadView />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/growth-plan"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
                    <GrowthPlan />
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
                    <Search />
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reading-list"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
                    <ReadingList />
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
                    <Profile />
                    <BottomNav />
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}