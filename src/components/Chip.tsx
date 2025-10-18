import React from 'react';
interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}
export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  active = false,
  onClick
}) => {
  return <button className={`chip ${active ? 'active' : ''}`} onClick={onClick}>
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </button>;
};