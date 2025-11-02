import React, { useEffect, useState } from 'react';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, XIcon } from 'lucide-react';
interface AudioPlayerProps {
  bookTitle: string;
  onClose: () => void;
}
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  bookTitle,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const totalTime = 1080; // 18 minutes in seconds
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, totalTime));
      }, 1000 / speed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, totalTime]);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const progress = currentTime / totalTime * 100;
  return <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">NOW PLAYING</p>
            <p className="font-semibold text-[#333333] text-sm">{bookTitle}</p>
          </div>
          <button onClick={onClose} className="p-2">
            <XIcon size={20} className="text-gray-400" />
          </button>
        </div>
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div className="bg-[#E87968] rounded-full h-1.5 transition-all" style={{
            width: `${progress}%`
          }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalTime)}</span>
          </div>
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <button onClick={() => setSpeed(speed === 2.0 ? 1.0 : speed + 0.25)} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-[#333333]">
            {speed}x
          </button>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentTime(Math.max(0, currentTime - 15))} className="p-2">
              <SkipBackIcon size={24} className="text-[#333333]" />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-14 h-14 bg-[#E87968] rounded-full flex items-center justify-center shadow-lg">
              {isPlaying ? <PauseIcon size={24} className="text-white" fill="white" /> : <PlayIcon size={24} className="text-white" fill="white" />}
            </button>
            <button onClick={() => setCurrentTime(Math.min(totalTime, currentTime + 15))} className="p-2">
              <SkipForwardIcon size={24} className="text-[#333333]" />
            </button>
          </div>
          <div className="w-12" />
        </div>
      </div>
    </div>;
};
export default AudioPlayer;