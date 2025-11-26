import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, TypeIcon, CheckCircleIcon } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client/react';
import { LIST_BOOK_SUMMARY_PAGES } from '../services/bookQueries';
import { UPDATE_LIBRARY_STATUS, GET_USER_LIBRARY } from '../services/libraryQueries';
import { progressTracker } from '../utils/progressTracker';

interface SummaryPage {
  id: string;
  page_number: number;
  content: string;
}

interface SummaryData {
  list_book_summary_pages: SummaryPage[];
}

interface SummaryVars { bookId: string; }

const ReadView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'small' | 'base' | 'large' | 'xlarge'>('base');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track where user came from (home or library)
  const sourceRoute = (location.state as any)?.from || '/';
  
  // Mutation to update library status
  const [updateLibraryStatus] = useMutation(UPDATE_LIBRARY_STATUS, {
    refetchQueries: [{ query: GET_USER_LIBRARY }],
    awaitRefetchQueries: true, // Wait for refetch to complete
    update: (cache, { data }) => {
      // Immediately update the cache
      try {
        const existingLibrary = cache.readQuery({ query: GET_USER_LIBRARY });
        if (existingLibrary && data) {
          const updatedLibrary = (existingLibrary as any).get_library.map((item: any) => 
            item.book_id === id ? { ...item, status: 'completed' } : item
          );
          cache.writeQuery({
            query: GET_USER_LIBRARY,
            data: { get_library: updatedLibrary }
          });
        }
      } catch (cacheError) {
        console.log('Cache update failed:', cacheError);
      }
    }
  });

  const { data, loading, error } = useQuery<SummaryData, SummaryVars>(LIST_BOOK_SUMMARY_PAGES, {
    variables: { bookId: id! },
    skip: !id,
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-first',
    errorPolicy: 'all',
    // Cache summary pages for a long time as they rarely change
    notifyOnNetworkStatusChange: true,
  });

  const pages = data?.list_book_summary_pages || [];
  const totalPages = pages.length;
  const progress = totalPages ? ((currentPageIndex + 1) / totalPages) * 100 : 0;

  // Initialize progress tracking and restore last page when component mounts
  useEffect(() => {
    if (id && totalPages > 0 && !isInitialized) {
      // Get saved progress
      const savedProgress = progressTracker.getProgress(id);
      
      if (savedProgress && savedProgress.currentPage > 0) {
        // Restore from last read page (convert to 0-based index)
        const lastPageIndex = Math.max(0, Math.min(savedProgress.currentPage - 1, totalPages - 1));
        setCurrentPageIndex(lastPageIndex);
        console.log(`📖 Restored reading position: Page ${savedProgress.currentPage} of ${totalPages}`);
      } else {
        // Start fresh reading session
        progressTracker.startReading(id, totalPages);
        console.log(`📖 Starting new reading session: Page 1 of ${totalPages}`);
      }
      
      setIsInitialized(true);
    }
  }, [id, totalPages, isInitialized]);

  // Update progress when page changes (only after initialization)
  useEffect(() => {
    if (id && totalPages > 0 && isInitialized) {
      const pageNumber = currentPageIndex + 1;
      progressTracker.updateProgress(id, pageNumber, totalPages);
    }
  }, [currentPageIndex, id, totalPages, isInitialized, progress]);

  const fontSizes: Record<string, string> = {
    small: 'text-sm',
    base: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const cycleFont = () => {
    const order: Array<'small' | 'base' | 'large' | 'xlarge'> = ['small', 'base', 'large', 'xlarge'];
    const idx = order.indexOf(fontSize);
    setFontSize(order[(idx + 1) % order.length]);
  };

  const handleMarkAsDone = async () => {
    if (!id) return;
    
    console.log('📕 Marking book as read:', id);
    
    // First, update progress to 100% in backend
    progressTracker.updateProgress(id, totalPages, totalPages);
    await progressTracker.saveToStorage();
    
    // Give a moment for the progress mutation to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Then update library status to 'completed' in backend
    try {
      const result = await updateLibraryStatus({
        variables: { 
          bookId: id, 
          status: 'completed' 
        },
      });
      console.log('✅ Book marked as completed in library:', result);
    } catch (error) {
      console.error('❌ Error marking book as completed:', error);
    }
    
    // Navigate back to source (home or library)
    navigate(sourceRoute, { replace: true });
  };

  const handlePageChange = (newIndex: number) => {
    setCurrentPageIndex(newIndex);
    // Progress is automatically updated via useEffect
  };

  const handleGoBack = () => {
    // Save progress before leaving
    if (id && totalPages > 0) {
      const pageNumber = currentPageIndex + 1;
      progressTracker.updateProgress(id, pageNumber, totalPages);
      progressTracker.saveToStorage();
    }
    navigate(-1);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FCF8F5]">
      {/* Header */}
      <div className="sticky top-0 bg-[#FCF8F5] z-10 px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handleGoBack} className="p-2">
            <ArrowLeftIcon className="text-[#333333]" size={24} />
          </button>
          <div className="flex gap-2">
            <button onClick={cycleFont} className="p-2">
              <TypeIcon className="text-[#333333]" size={22} />
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#F7B8A1] to-[#E87968] rounded-full h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {loading ? 'Loading…' : totalPages ? `Page ${currentPageIndex + 1} of ${totalPages}` : 'No pages'}
          </span>
          {totalPages > 0 && (
            <span className="text-xs font-semibold text-[#E87968]">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 min-h-[60vh]">
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">Failed to load summary.</p>
          </div>
        ) : loading ? (
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        ) : totalPages > 0 ? (
          <div className={`${fontSizes[fontSize]} text-gray-700 leading-relaxed whitespace-pre-line`}>
            {pages[currentPageIndex].content}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No summary pages available.</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      {totalPages > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPageIndex - 1))}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold ${currentPageIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#F7B8A1] text-white'}`}
            >
              <ChevronLeftIcon size={20} />
              Previous
            </button>
            {currentPageIndex === totalPages - 1 ? (
              <button
                onClick={handleMarkAsDone}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-[#E87968] text-white hover:shadow-lg transition-all"
              >
                <CheckCircleIcon size={20} />
                Mark as Read
              </button>
            ) : (
              <button
                onClick={() => handlePageChange(Math.min(totalPages - 1, currentPageIndex + 1))}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-[#E87968] text-white"
              >
                Next
                <ChevronRightIcon size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadView;