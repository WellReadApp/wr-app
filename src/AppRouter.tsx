import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Onboarding } from './pages/Onboarding';
import { BookDetails } from './pages/BookDetails';
import { Reader } from './pages/Reader';
import { AudioPlayer } from './pages/AudioPlayer';
import { Quiz } from './pages/Quiz';
import { Profile } from './pages/Profile';
export function AppRouter() {
  return <BrowserRouter>
      <div className="mobile-container">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/audio/:id" element={<AudioPlayer />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>;
}