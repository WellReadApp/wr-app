import React from 'react';
interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
}
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-accent'
}) => {
  return <div className="progress-bar">
      <div className={`${color}`} style={{
      width: `${progress}%`
    }}></div>
    </div>;
};