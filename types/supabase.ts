export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
          books_read: number | null
          pages_read: number | null
          reading_time: number | null
          current_streak: number | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          books_read?: number | null
          pages_read?: number | null
          reading_time?: number | null
          current_streak?: number | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
          books_read?: number | null
          pages_read?: number | null
          reading_time?: number | null
          current_streak?: number | null
        }
      }
      user_preferences: {
        Row: {
          id: string
          favorite_genres: string[] | null
          books_read_count: string | null
          pages_per_day: number | null
          yearly_goal: number | null
          onboarding_completed: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          favorite_genres?: string[] | null
          books_read_count?: string | null
          pages_per_day?: number | null
          yearly_goal?: number | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          favorite_genres?: string[] | null
          books_read_count?: string | null
          pages_per_day?: number | null
          yearly_goal?: number | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}
