import React from 'react';
import { Link } from 'react-router-dom';
interface BookCoverCardProps {
  id: string;
  cover: string;
  title: string;
  author: string;
}
export const BookCoverCard: React.FC<BookCoverCardProps> = ({
  id,
  cover,
  title,
  author
}) => {
  return <Link to={`/book/${id}`} className="book-card">
      <div className="relative pb-[150%]">
        <img src={cover} alt={`${title} cover`} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-2">
        <h3 className="text-sm font-semibold truncate">{title}</h3>
        <p className="text-xs text-text-secondary truncate">{author}</p>
      </div>
    </Link>;
};