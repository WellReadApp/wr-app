import { gql } from '@apollo/client';

// Get user's complete library
export const GET_USER_LIBRARY = gql`
  query GetUserLibrary {
    get_library {
      user_id
      book_id
      status
      added_at
      updated_at
      book {
        id
        title
        primary_author_name
        picture_url
        first_publish_year
      }
      reading_progress {
        progress
        current_page
        last_read_at
      }
    }
  }
`;

// Get current reading book
export const GET_CURRENT_BOOK = gql`
  query GetCurrentBook {
    get_current_book {
      user_id
      book_id
      status
      added_at
      updated_at
      book {
        id
        title
        primary_author_name
        picture_url
        first_publish_year
      }
      reading_progress {
        progress
        current_page
        last_read_at
      }
    }
  }
`;

// Get library by status
export const GET_LIBRARY_BY_STATUS = gql`
  query GetLibraryByStatus($status: String!) {
    get_library_by_status(status: $status) {
      user_id
      book_id
      status
      added_at
      updated_at
      book {
        id
        title
        primary_author_name
        picture_url
        first_publish_year
      }
      reading_progress {
        progress
        current_page
        last_read_at
      }
    }
  }
`;

// Get library statistics
export const GET_LIBRARY_STATS = gql`
  query GetLibraryStats {
    get_library_stats {
      totalBooks
      reading
      completed
      wantToRead
    }
  }
`;

// Get reading statistics
export const GET_READING_STATS = gql`
  query GetReadingStats {
    get_reading_stats {
      booksRead
      totalBooksInList
      progressPercentage
    }
  }
`;

// Add book to library
export const ADD_TO_LIBRARY = gql`
  mutation AddToLibrary($bookId: String!, $status: String) {
    add_to_library(bookId: $bookId, status: $status) {
      user_id
      book_id
      status
      added_at
      updated_at
    }
  }
`;

// Update library status
export const UPDATE_LIBRARY_STATUS = gql`
  mutation UpdateLibraryStatus($bookId: String!, $status: String!) {
    update_library_status(bookId: $bookId, status: $status) {
      user_id
      book_id
      status
      added_at
      updated_at
    }
  }
`;

// Update reading progress - matches backend exactly
export const UPDATE_PROGRESS = gql`
  mutation UpdateReadingProgress($bookId: String!, $progress: Int!, $currentPage: Int) {
    update_reading_progress(bookId: $bookId, progress: $progress, currentPage: $currentPage) {
      progress
      current_page
      last_read_at
    }
  }
`;

// Remove from library
export const REMOVE_FROM_LIBRARY = gql`
  mutation RemoveFromLibrary($bookId: String!) {
    remove_from_library(bookId: $bookId)
  }
`;

// Reset reading progress
export const RESET_PROGRESS = gql`
  mutation ResetReadingProgress($bookId: String!) {
    reset_reading_progress(bookId: $bookId)
  }
`;

// Get progress for specific book
export const GET_PROGRESS = gql`
  query GetReadingProgress($bookId: String!) {
    get_reading_progress(bookId: $bookId) {
      progress
      current_page
      time_spent
      status
      started_at
      completed_at
      last_read_at
    }
  }
`;

// Get last reading book
export const GET_LAST_READING_BOOK = gql`
  query GetLastReadingBook {
    get_current_book {
      user_id
      book_id
      status
      added_at
      updated_at
      book {
        id
        title
        primary_author_name
        picture_url
      }
      reading_progress {
        progress
        current_page
        last_read_at
      }
    }
  }
`;

// Get library entry for specific book
export const GET_LIBRARY_ENTRY = gql`
  query GetLibraryEntry($bookId: String!) {
    get_library {
      user_id
      book_id
      status
      added_at
      updated_at
      reading_progress {
        progress
        current_page
        last_read_at
      }
    }
  }
`;

// Mark book as completed
export const MARK_AS_COMPLETED = gql`
  mutation MarkBookCompleted($bookId: String!) {
    mark_book_completed(bookId: $bookId) {
      progress
      current_page
      time_spent
      status
      started_at
      completed_at
      last_read_at
    }
  }
`;

// Enhanced book query to check if book is in library
export const CHECK_BOOK_IN_LIBRARY = gql`
  query CheckBookInLibrary($bookId: String!) {
    get_library {
      user_id
      book_id
      status
      reading_progress {
        progress
        current_page
        last_read_at
      }
    }
  }
`;
