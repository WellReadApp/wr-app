import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import apolloClient from './services/apolloClient';
import { AuthProvider } from './utils/AuthContext';
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

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  );
}