import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database, BookStatus } from '@/types/supabase';

type BookRow = Database['public']['Tables']['books']['Row'];

interface UserBookWithDetails {
  id: string; 
  user_id: string;
  status: BookStatus;
  current_page: number | null;
  rating: number | null;
  start_date: string | null;
  finish_date: string | null;
  notes: string | null;
  added_to_shelf_at: string;
  last_progress_at: string;
  updated_at: string; 
  books: BookRow | null; 
}

export async function GET() {
  const cookieStore = cookies(); // This is ReadonlyRequestCookies

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // In a Route Handler, cookies are set on the NextResponse.
          // The Supabase client calls this function if it needs to set a cookie (e.g., after token refresh).
          // Without middleware or direct response manipulation here, this cookie won't be sent to the client.
          // This try/catch is a pattern for server components/actions where direct response access is not available.
          try {
            // cookieStore.set({ name, value, ...options }); // THIS LINE CAUSES THE ERROR as cookieStore is Readonly
            console.warn(`Supabase client attempting to SET cookie in GET handler: ${name}. This requires middleware or response manipulation to be effective.`);
          } catch (error) {
            // Log error if needed, but the main issue is cookieStore is read-only here.
            console.error("Error in custom 'set' cookie method (expected if not using middleware for writes):", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          // Similar to set, this needs to operate on NextResponse for Route Handlers.
          try {
            // cookieStore.set({ name, value: '', ...options }); // THIS LINE CAUSES THE ERROR
            console.warn(`Supabase client attempting to REMOVE cookie in GET handler: ${name}. This requires middleware or response manipulation.`);
          } catch (error) {
            console.error("Error in custom 'remove' cookie method (expected if not using middleware for writes):", error);
          }
        },
      },
    }
  );

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session with @supabase/ssr:', sessionError);
      return NextResponse.json({ error: 'Failed to get session', details: sessionError.message }, { status: 500 });
    }

    if (!session) {
      console.warn('/api/my-books: No session found using @supabase/ssr, returning 401.');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = session.user.id;

    const { data: userBooksData, error: userBooksError } = await supabase
      .from('user_books')
      .select(`
        id,
        user_id,
        status,
        current_page,
        rating,
        start_date,
        finish_date,
        notes,
        added_to_shelf_at,
        last_progress_at,
        updated_at,
        books (
          id,
          google_books_id,
          title,
          author,
          cover_url,
          description,
          total_pages,
          published_date,
          publisher,
          isbn_13,
          isbn_10,
          genre,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId)
      .order('last_progress_at', { ascending: false, nullsFirst: false }); 

    if (userBooksError) {
      console.error('Error fetching user books with @supabase/ssr:', userBooksError);
      return NextResponse.json({ error: 'Failed to fetch user books', details: userBooksError.message }, { status: 500 });
    }
    
    if (!userBooksData) {
        return NextResponse.json({
            currentlyReading: [],
            readingList: [],
            completedBooks: [],
        }, { status: 200 });
    }

    const currentlyReading: UserBookWithDetails[] = [];
    const readingList: UserBookWithDetails[] = [];
    const completedBooks: UserBookWithDetails[] = [];

    userBooksData.forEach((item) => {
      const bookData = item.books 
        ? (Array.isArray(item.books) ? item.books[0] : item.books) 
        : null;

      if (!bookData) {
        console.warn(`User book entry ${item.id} is missing book details. Original item.books:`, item.books);
        return;
      }

      const bookEntry: UserBookWithDetails = {
        id: item.id,
        user_id: item.user_id,
        status: item.status,
        current_page: item.current_page,
        rating: item.rating,
        start_date: item.start_date,
        finish_date: item.finish_date,
        notes: item.notes,
        added_to_shelf_at: item.added_to_shelf_at,
        last_progress_at: item.last_progress_at,
        updated_at: item.updated_at,
        books: bookData as BookRow, 
      };

      switch (bookEntry.status) {
        case 'reading':
          currentlyReading.push(bookEntry);
          break;
        case 'want_to_read':
          readingList.push(bookEntry);
          break;
        case 'completed':
          completedBooks.push(bookEntry);
          break;
        default:
          break;
      }
    });

    return NextResponse.json({
      currentlyReading,
      readingList,
      completedBooks,
    }, { status: 200 });

  } catch (e: any) {
    console.error('Unexpected error in /api/my-books with @supabase/ssr:', e);
    return NextResponse.json({ error: 'An unexpected error occurred', details: e.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
