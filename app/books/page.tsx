"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, BookOpen, BookMarked, Clock, Loader2 } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

// Define interfaces for book data based on conceptual schema
interface Book {
  id: string; // Assuming UUID from Supabase
  title: string;
  author: string;
  cover_url: string | null;
  total_pages?: number;
  genre?: string;
}

interface UserBook extends Book {
  user_book_id: string; // ID from the user_books table
  status: 'reading' | 'want_to_read' | 'completed';
  current_page?: number;
  rating?: number;
  start_date?: string | null;
  finish_date?: string | null;
  added_to_shelf_at?: string;
  last_read?: string; // For display, might be derived or stored
}

interface CurrentlyReadingBook extends UserBook {
  status: 'reading';
  progress: number; // Calculated as (current_page / total_pages) * 100
}

interface ReadingListBook extends UserBook {
  status: 'want_to_read';
}

interface CompletedBook extends UserBook {
  status: 'completed';
}

export default function BooksPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [currentlyReading, setCurrentlyReading] = useState<CurrentlyReadingBook[]>([]);
  const [readingList, setReadingList] = useState<ReadingListBook[]>([]);
  const [completedBooks, setCompletedBooks] = useState<CompletedBook[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      const fetchUserBooks = async () => {
        setIsLoadingBooks(true);
        try {
          // SIMULATED API CALL
          // In a real app, you would fetch this from an API endpoint:
          // const response = await fetch("/api/user-books"); // Your API route
          // if (!response.ok) throw new Error("Failed to fetch books");
          // const data = await response.json();
          // setCurrentlyReading(data.currentlyReading || []);
          // setReadingList(data.readingList || []);
          // setCompletedBooks(data.completedBooks || []);

          // Mock data simulation (replace with actual API call)
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

          const mockCurrentlyReading: CurrentlyReadingBook[] = [
            {
              user_book_id: "ub1",
              id: "book1",
              title: "The Alchemist (Live)",
              author: "Paulo Coelho",
              cover_url: "/placeholder.svg?height=80&width=60",
              status: 'reading',
              current_page: 70,
              total_pages: 197,
              progress: Math.round((70 / 197) * 100),
              last_read: "2 days ago",
            },
            {
              user_book_id: "ub2",
              id: "book2",
              title: "Project Hail Mary (Live)",
              author: "Andy Weir",
              cover_url: "/placeholder.svg?height=80&width=60",
              status: 'reading',
              current_page: 245,
              total_pages: 320,
              progress: Math.round((245 / 320) * 100),
              last_read: "Yesterday",
            },
          ];

          const mockReadingList: ReadingListBook[] = [
            { user_book_id: "ub3", id: "book3", title: "Dune (Live)", author: "Frank Herbert", cover_url: "/placeholder.svg?height=80&width=60", status: 'want_to_read', added_to_shelf_at: "2 weeks ago", genre: "Science Fiction" },
            { user_book_id: "ub4", id: "book4", title: "The Hobbit (Live)", author: "J.R.R. Tolkien", cover_url: "/placeholder.svg?height=80&width=60", status: 'want_to_read', added_to_shelf_at: "1 month ago", genre: "Fantasy" },
          ];

          const mockCompletedBooks: CompletedBook[] = [
            { user_book_id: "ub5", id: "book5", title: "The Midnight Library (Live)", author: "Matt Haig", cover_url: "/placeholder.svg?height=80&width=60", status: 'completed', finish_date: "2023-04-10", rating: 4, genre: "Fiction" },
          ];

          setCurrentlyReading(mockCurrentlyReading);
          setReadingList(mockReadingList);
          setCompletedBooks(mockCompletedBooks);

        } catch (error) {
          console.error("Error fetching books:", error);
          toast({
            title: "Error",
            description: "Could not fetch your books. Please try again later.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingBooks(false);
        }
      };

      fetchUserBooks();
    } else if (!authLoading && !user) {
      setIsLoadingBooks(false); // Not logged in, no books to load
    }
  }, [user, authLoading, toast]);

  const StatCardSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-1/3 mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );

  const BookCardSkeleton = () => (
    <Card>
      <CardContent className="p-6">
        <div className="flex space-x-4">
          <Skeleton className="h-24 w-16 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-3 w-1/2 mt-1" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-6 py-4 pt-0">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-32" />
      </CardFooter>
    </Card>
  );


  if (authLoading) {
    return ( // Full page loader if auth is still loading
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p>Please <Link href="/auth/signin" className="underline text-primary">sign in</Link> to view your books.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">My Books</h1>
        <div className="flex items-center gap-2">
          <Link href="/books/track">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Track Book
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {isLoadingBooks ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Currently Reading</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentlyReading.length}</div>
                <p className="text-xs text-muted-foreground">
                  {currentlyReading.length === 1 ? "book" : "books"} in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Want to Read</CardTitle>
                <BookMarked className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{readingList.length}</div>
                <p className="text-xs text-muted-foreground">{readingList.length === 1 ? "book" : "books"} on your list</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedBooks.length}</div>
                <p className="text-xs text-muted-foreground">{completedBooks.length === 1 ? "book" : "books"} finished</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Currently Reading ({isLoadingBooks ? '...' : currentlyReading.length})</TabsTrigger>
          <TabsTrigger value="list">Reading List ({isLoadingBooks ? '...' : readingList.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({isLoadingBooks ? '...' : completedBooks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          {isLoadingBooks ? (
            <div className="grid gap-4 md:grid-cols-2">
              <BookCardSkeleton />
              <BookCardSkeleton />
            </div>
          ) : currentlyReading.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {currentlyReading.map((book) => (
                <Card key={book.user_book_id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar className="h-24 w-16 rounded-md">
                        <AvatarImage src={book.cover_url || "/placeholder.svg?height=80&width=60"} alt={book.title} />
                        <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-bold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {book.current_page} of {book.total_pages} pages
                            </span>
                            {book.last_read && <span>Last read {book.last_read}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between px-6 py-4 pt-0">
                    <Button variant="outline" size="sm" onClick={() => {/* TODO: Navigate to book details page */}}>
                      View Details
                    </Button>
                    {/* Pass user_book_id to track page to continue tracking this specific instance */}
                    <Link href={`/books/track?userBookId=${book.user_book_id}&bookId=${book.id}`}>
                      <Button size="sm">Continue Reading</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">You are not currently reading any books.</p>
          )}
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
           {isLoadingBooks ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
            </div>
          ) : readingList.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {readingList.map((book) => (
                <Card key={book.user_book_id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar className="h-24 w-16 rounded-md">
                        <AvatarImage src={book.cover_url || "/placeholder.svg?height=80&width=60"} alt={book.title} />
                        <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-bold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        {book.genre && <Badge variant="outline">{book.genre}</Badge>}
                        {book.added_to_shelf_at && <p className="text-xs text-muted-foreground">Added {book.added_to_shelf_at}</p>}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between px-6 py-4 pt-0">
                     <Button variant="outline" size="sm" onClick={() => {/* TODO: Navigate to book details page */}}>
                      View Details
                    </Button>
                    {/* Pass book_id to track page to start reading this book */}
                    <Link href={`/books/track?bookId=${book.id}&status=reading`}>
                      <Button size="sm">Start Reading</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
             <p className="text-muted-foreground text-center py-8">Your reading list is empty.</p>
          )}
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          {isLoadingBooks ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <BookCardSkeleton />
              <BookCardSkeleton />
              <BookCardSkeleton />
            </div>
          ) : completedBooks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedBooks.map((book) => (
                <Card key={book.user_book_id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar className="h-24 w-16 rounded-md">
                        <AvatarImage src={book.cover_url || "/placeholder.svg?height=80&width=60"} alt={book.title} />
                        <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="font-bold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        {book.genre && <Badge variant="outline">{book.genre}</Badge>}
                        {book.rating && (
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < (book.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                        {book.finish_date && <p className="text-xs text-muted-foreground">Completed on {new Date(book.finish_date).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between px-6 py-4 pt-0">
                    <Button variant="outline" size="sm" onClick={() => {/* TODO: Navigate to book details page */}}>
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {/* TODO: Open review modal or navigate */}}>
                      Write Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">You haven't completed any books yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
