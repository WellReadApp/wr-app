import apolloClient from '../services/apolloClient';
import { gql } from '@apollo/client';
import { UPDATE_LIBRARY_STATUS, ADD_TO_LIBRARY, GET_USER_LIBRARY, RESET_PROGRESS } from '../services/libraryQueries';

export interface ProgressData {
  bookId: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  timeSpent: number;
}

class ProgressTracker {
  private readingSessions: Map<string, ProgressData> = new Map();
  private readingStartTime: Map<string, number> = new Map();

  // Start tracking reading session
  startReading(bookId: string, totalPages: number = 10) {
    this.readingStartTime.set(bookId, Date.now());
    
    // If we don't have progress data for this book, initialize it
    if (!this.readingSessions.has(bookId)) {
      this.readingSessions.set(bookId, {
        bookId,
        currentPage: 1,
        totalPages,
        progress: 0,
        timeSpent: 0
      });
    }
  }

  // Update reading progress for a book
  updateProgress(bookId: string, currentPage: number, totalPages: number) {
    // Validate inputs
    if (!bookId || typeof bookId !== 'string') {
      console.error(`Invalid bookId:`, bookId);
      return;
    }
    
    if (currentPage <= 0 || totalPages <= 0) {
      console.error(`Invalid page numbers: currentPage=${currentPage}, totalPages=${totalPages}`);
      return;
    }

    // Calculate progress percentage (rounded to integer for backend consistency)
    const progressPercent = Math.round((currentPage / totalPages) * 100);

    // Update or create session
    if (!this.readingSessions.has(bookId)) {
      this.readingSessions.set(bookId, {
        bookId,
        currentPage: 0,
        totalPages,
        progress: 0,
        timeSpent: 0
      });
    }

    const session = this.readingSessions.get(bookId)!;
    session.currentPage = currentPage;
    session.totalPages = totalPages;
    session.progress = progressPercent;

    // Save to local storage immediately
    this.saveToStorage();

    // Sync with backend
    setTimeout(() => {
      this.syncWithLibrary(bookId, progressPercent);
    }, 100);
  }

  // Mark reading as completed
  completeReading(bookId: string) {
    const session = this.readingSessions.get(bookId);
    if (session) {
      session.progress = 100;
      session.currentPage = session.totalPages;
      this.readingSessions.set(bookId, session);
      
      this.saveToStorage();
      this.syncWithLibrary(bookId, 100);
    }
  }

  // Get current progress for a book
  getProgress(bookId: string): ProgressData | null {
    return this.readingSessions.get(bookId) || null;
  }

  // Reset progress for a specific book
  async resetProgress(bookId: string) {
    this.readingSessions.delete(bookId);
    this.readingStartTime.delete(bookId);
    this.saveToStorage();
    
    try {
      await apolloClient.mutate({
        mutation: RESET_PROGRESS,
        variables: { bookId },
        optimisticResponse: {
          reset_reading_progress: true
        }
      });
    } catch (error) {
      console.warn('Failed to reset progress in backend:', error);
    }
  }

  // Sync progress with library
  private async syncWithLibrary(bookId: string, progress: number) {
    try {
      // Determine status based on progress - but NEVER set to 'completed' automatically
      // Only 'Mark as Read' button should set status to 'completed'
      let status = 'want-to-read';
      if (progress > 0 && progress < 100) {
        status = 'reading';
      } else if (progress >= 100) {
        // Keep as 'reading' even at 100% - only Mark as Read button sets to 'completed'
        status = 'reading';
      }

      // Check if book is already in library
      const { data } = await apolloClient.query({
        query: GET_USER_LIBRARY,
        fetchPolicy: 'cache-first'
      });

      const bookInLibrary = (data as any)?.get_library?.find((item: any) => item.book_id === bookId);

      // Update reading progress
      try {
        await this.updateReadingProgressDirectly(bookId, progress);
      } catch (progressError) {
        console.error('Failed to update reading progress:', progressError);
      }

      // Update library status - only if not already completed
      try {
        if (bookInLibrary) {
          // Don't override 'completed' status
          if (bookInLibrary.status !== 'completed') {
            await apolloClient.mutate({
              mutation: UPDATE_LIBRARY_STATUS,
              variables: { bookId, status },
              update: (cache) => {
                // Update relevant queries in cache instead of refetching
                try {
                  // Update GET_USER_LIBRARY cache
                  const existingLibrary = cache.readQuery({ query: GET_USER_LIBRARY });
                  if (existingLibrary) {
                    const updatedLibrary = (existingLibrary as any).get_library.map((item: any) => 
                      item.book_id === bookId ? { ...item, status } : item
                    );
                    cache.writeQuery({
                      query: GET_USER_LIBRARY,
                      data: { get_library: updatedLibrary }
                    });
                  }
                } catch (cacheError) {
                  // Cache update failed - not critical for functionality
                }
              }
            });
          }
        } else {
          await apolloClient.mutate({
            mutation: ADD_TO_LIBRARY,
            variables: { bookId, status },
            update: (cache, { data }) => {
              // Optimistically add to cache instead of refetching
              try {
                const existingLibrary = cache.readQuery({ query: GET_USER_LIBRARY });
                if (existingLibrary && data) {
                  const newEntry = (data as any).add_to_library;
                  cache.writeQuery({
                    query: GET_USER_LIBRARY,
                    data: { 
                      get_library: [...(existingLibrary as any).get_library, newEntry] 
                    }
                  });
                }
              } catch (cacheError) {
                // Cache update failed - not critical for functionality
              }
            }
          });
        }
      } catch (libraryError) {
        console.error('Failed to update library status:', libraryError);
      }
      
    } catch (error) {
      console.error('Failed to sync progress with library:', error);
    }
  }

  // Direct progress update method - using exact curl test format
  private async updateReadingProgressDirectly(bookId: string, progress: number) {
    let sessionData = this.readingSessions.get(bookId);
    if (!sessionData) {
      sessionData = {
        bookId,
        currentPage: 1,
        totalPages: 10,
        progress: 0,
        timeSpent: 0
      };
      this.readingSessions.set(bookId, sessionData);
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required - please login first');
      }
      
      const clampedProgress = Math.round(Math.min(100, Math.max(0, progress)));
      const currentPage = sessionData.currentPage || 1;
      
      const inlineQuery = `
        mutation UpdateReadingProgressApp {
          update_reading_progress(bookId: "${bookId}", progress: ${clampedProgress}, currentPage: ${currentPage}) {
            progress
            current_page
            last_read_at
          }
        }
      `;
      
      const result = await apolloClient.mutate({
        mutation: gql`${inlineQuery}`,
        errorPolicy: 'all',
        fetchPolicy: 'no-cache',
        context: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      });
      
      if (result.data && (result.data as any).update_reading_progress) {
        const progressData = (result.data as any).update_reading_progress;
        
        // Update local session with backend response
        sessionData.progress = progressData.progress;
        if (progressData.current_page) {
          sessionData.currentPage = progressData.current_page;
        }
        this.readingSessions.set(bookId, sessionData);
        this.saveToStorage();
        
        return progressData;
      } else {
        if (result.error) {
          throw new Error(`GraphQL Error: ${result.error.message}`);
        }
        throw new Error('UPDATE_READING_PROGRESS mutation failed - no data returned');
      }
      
    } catch (error) {
      console.error('UPDATE_READING_PROGRESS MUTATION FAILED:', error);
      throw error;
    }
  }

  // Load progress from local storage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('reading-progress');
      if (stored) {
        const data = JSON.parse(stored);
        this.readingSessions = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load progress from storage:', error);
    }
  }

  // Save progress to local storage
  saveToStorage() {
    try {
      const data = Object.fromEntries(this.readingSessions);
      localStorage.setItem('reading-progress', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save progress to storage:', error);
    }
  }

  // Get all reading sessions
  getAllSessions(): ProgressData[] {
    return Array.from(this.readingSessions.values());
  }
}

export const progressTracker = new ProgressTracker();

// Load saved progress on initialization
progressTracker.loadFromStorage();

// Save progress periodically
setInterval(() => {
  progressTracker.saveToStorage();
}, 30000); // Save every 30 seconds