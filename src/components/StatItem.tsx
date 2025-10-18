import React from 'react';
interface StatItemProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}
export const StatItem: React.FC<StatItemProps> = ({
  icon,
  value,
  label
}) => {
  return <div className="flex flex-col items-center">
      {icon}
      <span className="text-xl font-bold mt-1">{value}</span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>;
};