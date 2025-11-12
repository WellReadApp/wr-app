import { useState } from 'react';
import { RefreshCwIcon } from 'lucide-react';
import { refreshQuery, clearBookCaches } from '../utils/cacheUtils';

interface RefreshControlProps {
  onRefresh?: () => void;
  queryName?: string;
  variables?: Record<string, any>;
  className?: string;
}

const RefreshControl: React.FC<RefreshControlProps> = ({ 
  onRefresh, 
  queryName, 
  variables, 
  className = "p-2" 
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    try {
      if (queryName) {
        await refreshQuery(queryName, variables);
      } else {
        // Clear all book caches for a general refresh
        clearBookCaches();
      }
      
      onRefresh?.();
    } catch (error) {
      console.warn('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`${className} ${isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} rounded-full transition-colors`}
      title="Refresh content"
    >
      <RefreshCwIcon 
        size={20} 
        className={`text-[#333333] ${isRefreshing ? 'animate-spin' : ''}`} 
      />
    </button>
  );
};

export default RefreshControl;