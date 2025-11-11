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
      status
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
