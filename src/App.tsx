import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import ReadView from './pages/ReadView';
import GrowthPlan from './pages/GrowthPlan';
import Search from './pages/Search';
import ReadingList from './pages/ReadingList';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
export function App() {
  return <BrowserRouter>
      <div className="w-full min-h-screen bg-[#FCF8F5] pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/book/:id/read" element={<ReadView />} />
          <Route path="/growth-plan" element={<GrowthPlan />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reading-list" element={<ReadingList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>;
}