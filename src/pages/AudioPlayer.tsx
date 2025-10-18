import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppBar } from '../components/Layout/AppBar';
import { books } from '../utils/mockData';
import { PlayIcon, PauseIcon, SkipBackIcon, FastForwardIcon, GaugeIcon, XIcon } from 'lucide-react';
export const AudioPlayer: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const book = books.find(b => b.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speedMenuOpen, setSpeedMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  if (!book) {
    return <div>Book not found</div>;
  }
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  const setSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    setSpeedMenuOpen(false);
  };
  return <div className="min-h-screen bg-background flex flex-col">
      <AppBar title="" showBack={true} backTo={`/book/${id}`} rightAction={<button>
            <XIcon size={20} />
          </button>} />
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-64 h-64 rounded-lg shadow-md overflow-hidden mb-8">
          <img src={book.cover} alt={`${book.title} cover`} className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-semibold text-center">{book.title}</h2>
        <p className="text-text-secondary mb-8">{book.author}</p>
        <div className="w-full mb-2">
          <input type="range" min="0" max="100" value={progress} onChange={handleProgressChange} className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer" style={{
          background: `linear-gradient(to right, #F7941D ${progress}%, #E5E7EB ${progress}%)`
        }} />
        </div>
        <div className="flex justify-between w-full text-xs text-text-secondary mb-8">
          <span>{formatTime(Math.floor(progress * 15 / 100))}</span>
          <span>{formatTime(15 * 60)}</span>
        </div>
        <div className="flex items-center justify-center space-x-8">
          <button className="p-2">
            <SkipBackIcon size={24} />
          </button>
          <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white" onClick={togglePlay}>
            {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
          </button>
          <button className="p-2">
            <FastForwardIcon size={24} />
          </button>
        </div>
        <div className="relative mt-8">
          <button className="flex items-center text-text-secondary" onClick={() => setSpeedMenuOpen(!speedMenuOpen)}>
            <GaugeIcon size={16} className="mr-1" />
            <span>{playbackSpeed}x</span>
          </button>
          {speedMenuOpen && <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-lg p-2 w-32">
              {[0.8, 1, 1.2, 1.5, 2].map(speed => <button key={speed} className={`block w-full text-left px-3 py-2 rounded ${playbackSpeed === speed ? 'bg-gray-100' : ''}`} onClick={() => setSpeed(speed)}>
                  {speed}x
                </button>)}
            </div>}
        </div>
      </div>
    </div>;
};