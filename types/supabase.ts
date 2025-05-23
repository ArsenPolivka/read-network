export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type BookStatus = 'want_to_read' | 'reading' | 'completed' | 'on_hold' | 'dropped'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string // UUID, PK, FK to auth.users.id
          username: string | null // TEXT, UNIQUE
          full_name: string | null // TEXT
          avatar_url: string | null // TEXT
          bio: string | null // TEXT
          created_at: string // TIMESTAMPTZ, not null, default now()
          updated_at: string // TIMESTAMPTZ, not null, default now()
          // Aggregated stats, can be updated via triggers or batch jobs
          books_read_count: number | null // INTEGER, default 0
          pages_read_total: number | null // INTEGER, default 0
          reading_time_total_minutes: number | null // INTEGER, default 0
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          books_read_count?: number | null
          pages_read_total?: number | null
          reading_time_total_minutes?: number | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          updated_at?: string
          books_read_count?: number | null
          pages_read_total?: number | null
          reading_time_total_minutes?: number | null
        }
      }
      books: {
        Row: {
          id: string // UUID, PK
          google_books_id: string | null // TEXT, UNIQUE
          title: string // TEXT, not null
          author: string | null // TEXT
          cover_url: string | null // TEXT
          description: string | null // TEXT
          total_pages: number | null // INTEGER
          published_date: string | null // DATE (YYYY-MM-DD)
          publisher: string | null // TEXT
          isbn_13: string | null // TEXT, UNIQUE
          isbn_10: string | null // TEXT, UNIQUE
          genre: string | null // TEXT
          created_at: string // TIMESTAMPTZ, not null, default now()
          updated_at: string // TIMESTAMPTZ, not null, default now()
        }
        Insert: {
          id?: string // Default is uuid_generate_v4()
          google_books_id?: string | null
          title: string
          author?: string | null
          cover_url?: string | null
          description?: string | null
          total_pages?: number | null
          published_date?: string | null
          publisher?: string | null
          isbn_13?: string | null
          isbn_10?: string | null
          genre?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          google_books_id?: string | null
          title?: string
          author?: string | null
          cover_url?: string | null
          description?: string | null
          total_pages?: number | null
          published_date?: string | null
          publisher?: string | null
          isbn_13?: string | null
          isbn_10?: string | null
          genre?: string | null
          updated_at?: string
        }
      }
      user_books: {
        Row: {
          id: string // UUID, PK
          user_id: string // UUID, FK to profiles.id
          book_id: string // UUID, FK to books.id
          status: BookStatus // ENUM, not null
          current_page: number | null // INTEGER, default 0
          rating: number | null // INTEGER, CHECK (1-5)
          start_date: string | null // DATE
          finish_date: string | null // DATE
          notes: string | null // TEXT (general notes for this book on shelf)
          added_to_shelf_at: string // TIMESTAMPTZ, not null, default now()
          last_progress_at: string // TIMESTAMPTZ, not null, default now()
          updated_at: string // TIMESTAMPTZ, not null, default now()
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          status?: BookStatus
          current_page?: number | null
          rating?: number | null
          start_date?: string | null
          finish_date?: string | null
          notes?: string | null
          added_to_shelf_at?: string
          last_progress_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: BookStatus
          current_page?: number | null
          rating?: number | null
          start_date?: string | null
          finish_date?: string | null
          notes?: string | null
          last_progress_at?: string
          updated_at?: string
        }
      }
      reading_progress_updates: {
        Row: {
          id: string // UUID, PK
          user_book_id: string // UUID, FK to user_books.id
          user_id: string // UUID, FK to profiles.id (denormalized)
          pages_read_in_session: number | null // INTEGER
          time_spent_minutes: number | null // INTEGER
          session_notes: string | null // TEXT (notes for this specific session)
          is_public_update: boolean | null // BOOLEAN, default false
          created_at: string // TIMESTAMPTZ, not null, default now()
        }
        Insert: {
          id?: string
          user_book_id: string
          user_id: string
          pages_read_in_session?: number | null
          time_spent_minutes?: number | null
          session_notes?: string | null
          is_public_update?: boolean | null
          created_at?: string
        }
        Update: {
          // Typically immutable, but maybe allow editing notes or public status
          session_notes?: string | null
          is_public_update?: boolean | null
        }
      }
      reviews: {
        Row: {
          id: string // UUID, PK
          user_id: string // UUID, FK to profiles.id
          book_id: string // UUID, FK to books.id
          user_book_id: string | null // UUID, FK to user_books.id (optional)
          rating: number // INTEGER, not null, CHECK (1-5)
          review_title: string | null // TEXT
          review_text: string | null // TEXT
          is_public: boolean | null // BOOLEAN, default true
          created_at: string // TIMESTAMPTZ, not null, default now()
          updated_at: string // TIMESTAMPTZ, not null, default now()
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          user_book_id?: string | null
          rating: number
          review_title?: string | null
          review_text?: string | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rating?: number
          review_title?: string | null
          review_text?: string | null
          is_public?: boolean | null
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string // UUID, PK, FK to profiles.id
          favorite_genres: string[] | null // TEXT[]
          onboarding_completed: boolean | null // BOOLEAN, default false
          created_at: string // TIMESTAMPTZ, not null, default now()
          updated_at: string // TIMESTAMPTZ, not null, default now()
        }
        Insert: {
          user_id: string
          favorite_genres?: string[] | null
          onboarding_completed?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          favorite_genres?: string[] | null
          onboarding_completed?: boolean | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      handle_updated_at: {
        Args: Record<string, unknown>
        Returns: unknown // More specific: 'trigger' if possible
      }
      handle_new_user: {
        Args: Record<string, unknown>
        Returns: unknown // More specific: 'trigger' if possible
      }
    }
    Enums: {
      book_status: BookStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
