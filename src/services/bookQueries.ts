import { gql } from '@apollo/client';

// Fetch a single book by ID
export const GET_BOOK = gql`
  query GetBook($id: String!) {
    get_book(id: $id) {
      id
      title
      primary_author_name
      description
      picture_url
      first_publish_year
      readinglog_count
      type
      library_status {
        user_id
        book_id
        status
        added_at
        updated_at
      }
      reading_progress {
        progress
        current_page
        last_read_at
      }
      quotes {
        id
        text
        author
        page_number
        order_index
      }
      key_points {
        id
        point
        order_index
      }
      book_themes {
        id
        title
        description
      }
      enjoyment_criteria {
        id
        criteria
        order_index
      }
      actionable_benefits {
        id
        benefit
        order_index
      }
      contrasting_viewpoints {
        id
        viewpoint
        order_index
      }
    }
  }
`;

// Fetch recently added books (last 30 days)
export const LIST_RECENT_BOOKS = gql`
  query ListRecentBooks($limit: Int, $offset: Int) {
    list_recent_books(limit: $limit, offset: $offset) {
      id
      title
      primary_author_name
      picture_url
      first_publish_year
      readinglog_count
      status
    }
  }
`;

// Fetch all summary pages for a book
export const LIST_BOOK_SUMMARY_PAGES = gql`
  query ListBookSummaryPages($bookId: String!) {
    list_book_summary_pages(bookId: $bookId) {
      id
      page_number
      content
    }
  }
`;

// Fetch book quotes (using service method getBookQuotes)
export const GET_BOOK_QUOTES = gql`
  query GetBookQuotes($bookId: String!) {
    getBookQuotes(bookId: $bookId) {
      id
      text
      author
      page_number
      order_index
    }
  }
`;

// Fetch book key points (using service method getBookKeyPoints) 
export const GET_BOOK_KEY_POINTS = gql`
  query GetBookKeyPoints($bookId: String!) {
    getBookKeyPoints(bookId: $bookId) {
      id
      point
      order_index
    }
  }
`;

// Search books by query (using BookService.searchBooks)
export const SEARCH_BOOKS = gql`
  query SearchBooks($query: String!, $limit: Int, $offset: Int) {
    search_books(query: $query, limit: $limit, offset: $offset) {
      id
      title
      primary_author_name
      description
      picture_url
      first_publish_year
      readinglog_count
      status
    }
  }
`;

// Fetch popular books (using BookService.listPopularBooks)
export const LIST_POPULAR_BOOKS = gql`
  query ListPopularBooks($limit: Int, $offset: Int) {
    list_popular_books(limit: $limit, offset: $offset) {
      id
      title
      primary_author_name
      description
      picture_url
      first_publish_year
      readinglog_count
      status
    }
  }
`;

// Search autocomplete for books (using BookService.searchAutocomplete)
export const SEARCH_AUTOCOMPLETE = gql`
  query SearchAutocomplete($query: String!, $limit: Int) {
    searchAutocomplete(query: $query, limit: $limit) {
      id
      title
      primary_author_name
      picture_url
      first_publish_year
      readinglog_count
      status
    }
  }
`;
