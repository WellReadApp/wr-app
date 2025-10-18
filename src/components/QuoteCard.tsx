import React from 'react';
interface QuoteCardProps {
  quote: string;
  attribution: string;
}
export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  attribution
}) => {
  return <div className="bg-surface p-6 rounded-xl shadow-md mb-4">
      <p className="text-lg italic font-serif mb-4">{quote}</p>
      <p className="text-sm text-text-secondary">— {attribution}</p>
    </div>;
};