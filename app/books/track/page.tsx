"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Clock, Calendar as CalendarIcon, Loader2, CheckCircle, Info, BookPlus, Library } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Interface for Google Books API item
interface GoogleBookItem {
  id: string; // Google Books ID
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
    categories?: string[];
  };
}

// Interface for a book processed from Google Books API or manual entry, ready for our DB
interface ProcessedBook {
  google_books_id?: string | null; // Store Google Books ID if available
  title: string;
  author: string; // Assuming single primary author for simplicity here
  cover_url: string | null;
  total_pages: number;
  description?: string | null;
  published_date?: string | null;
  isbn_13?: string | null; // Prefer ISBN-13
  isbn_10?: string | null;
  genre?: string | null; // Could be primary category
  // This ID will be from *our* database after the book is added/found
  db_id?: string | null; 
}


interface ManualBookEntry {
  title: string;
  author: string;
  total_pages: number;
  cover_url?: string | null;
  isbn_13?: string | null;
  genre?: string | null;
}

export default function TrackBookPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GoogleBookItem[]>([]);
  
  // This state will hold the book details (either from search or manual)
  // that the user intends to track or add to their shelf.
  // It will also hold `db_id` once the book is confirmed in our database.
  const [bookToProcess, setBookToProcess] = useState<ProcessedBook | null>(null);
  
  const [manualBookEntry, setManualBookEntry] = useState<ManualBookEntry>({ title: "", author: "", total_pages: 0, isbn_13: "", genre: "" });

  const [trackingType, setTrackingType] = useState<"progress" | "time" | "completed">("progress");
  const [pagesRead, setPagesRead] = useState(0);
  // totalPagesForTracking will be derived from bookToProcess.total_pages
  const [readingTime, setReadingTime] = useState(30); // in minutes
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shelfStatus, setShelfStatus] = useState<'reading' | 'want_to_read' | 'completed'>('reading');


  // Pre-fill from query params if navigating from "My Books"
  useEffect(() => {
    const bookIdParam = searchParams.get("bookId"); // This would be our DB book_id
    const userBookIdParam = searchParams.get("userBookId"); // Our DB user_book_id
    const initialStatus = searchParams.get("status") as 'reading' | 'want_to_read' | 'completed' | null;

    if (initialStatus) {
      setShelfStatus(initialStatus);
      if (initialStatus === 'completed') setTrackingType('completed');
      else if (initialStatus === 'reading') setTrackingType('progress');
    }

    if (bookIdParam) {
      // If bookIdParam is present, it means the book is already in our DB.
      // We should fetch its details to populate `bookToProcess`.
      const fetchBookDetailsFromDB = async () => {
        setIsSearching(true); // Use isSearching to indicate loading book details
        try {
          // CONCEPTUAL API CALL: Fetch book details from your DB
          // const response = await fetch(`/api/books/${bookIdParam}`);
          // if (!response.ok) throw new Error("Failed to fetch book details");
          // const bookData: ProcessedBook = await response.json(); // Assuming API returns ProcessedBook structure with db_id
          
          // Simulated fetch:
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockBookFromDB: ProcessedBook = { // Replace with actual fetched data
            db_id: bookIdParam,
            google_books_id: searchParams.get("googleId") || null, // if you pass it
            title: searchParams.get("title") || "Fetched Book Title",
            author: searchParams.get("author") || "Fetched Author",
            cover_url: searchParams.get("cover") || "/placeholder.svg?height=80&width=60",
            total_pages: parseInt(searchParams.get("pages") || "0", 10),
          };
          setBookToProcess(mockBookFromDB);
          setActiveTab("track"); // Directly go to tracking section
        } catch (error) {
          toast({ title: "Error", description: "Could not load book details.", variant: "destructive" });
        } finally {
          setIsSearching(false);
        }
      };
      fetchBookDetailsFromDB();
    }
  }, [searchParams, toast]);


  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchResults([]); // Clear previous results
    try {
      // IMPORTANT: Replace YOUR_GOOGLE_BOOKS_API_KEY with an actual API key or handle this server-side
      // For security, API keys should ideally be used in backend (API route) calls.
      // This frontend call is for demonstration; in production, proxy this through your backend.
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY || ""; // Ensure this is in your .env.local
      if (!apiKey) {
          console.warn("Google Books API key is missing. Search will use mock data.");
          // Fallback to mock data if no API key
          await new Promise(resolve => setTimeout(resolve, 1000));
           const mockApiSearchResults: GoogleBookItem[] = [ /* ... your mock GoogleBookItems ... */ ];
           setSearchResults(mockApiSearchResults.filter(item => 
            item.volumeInfo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.volumeInfo.authors && item.volumeInfo.authors.join(" ").toLowerCase().includes(searchQuery.toLowerCase()))
          ));
          setIsSearching(false);
          return;
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&maxResults=10`
      );
      if (!response.ok) {
        throw new Error(`Google Books API error: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
      toast({
        title: "Search Error",
        description: error instanceof Error ? error.message : "Could not fetch search results.",
        variant: "destructive",
      });
      setSearchResults([]); // Clear results on error
    } finally {
      setIsSearching(false);
    }
  };

  const processAndSetBook = (item: GoogleBookItem | ManualBookEntry, isManual = false) => {
    let processed: ProcessedBook;
    if (isManual) {
        const manualItem = item as ManualBookEntry;
        processed = {
            title: manualItem.title,
            author: manualItem.author,
            total_pages: manualItem.total_pages,
            cover_url: manualItem.cover_url || null,
            isbn_13: manualItem.isbn_13 || null,
            genre: manualItem.genre || null,
            google_books_id: null, // No Google ID for purely manual entries
            db_id: null // Not in our DB yet
        };
    } else {
        const googleItem = item as GoogleBookItem;
        const isbn13 = googleItem.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier;
        const isbn10 = googleItem.volumeInfo.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier;
        processed = {
            google_books_id: googleItem.id,
            title: googleItem.volumeInfo.title,
            author: googleItem.volumeInfo.authors ? googleItem.volumeInfo.authors.join(', ') : "Unknown Author",
            cover_url: googleItem.volumeInfo.imageLinks?.thumbnail || googleItem.volumeInfo.imageLinks?.smallThumbnail || null,
            total_pages: googleItem.volumeInfo.pageCount || 0,
            description: googleItem.volumeInfo.description || null,
            published_date: googleItem.volumeInfo.publishedDate || null,
            isbn_13: isbn13 || null,
            isbn_10: isbn10 || null,
            genre: googleItem.volumeInfo.categories ? googleItem.volumeInfo.categories[0] : null,
            db_id: null // Not in our DB yet
        };
    }
    setBookToProcess(processed);
    setPagesRead(0); // Reset progress for the new book
    setActiveTab("track"); // Move to tracking section
  };

  const handleManualEntryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualBookEntry(prev => ({ ...prev, [name]: name === 'total_pages' ? parseInt(value, 10) || 0 : value }));
  };

  const handleUseManualEntry = () => {
    if (!manualBookEntry.title || !manualBookEntry.author || manualBookEntry.total_pages <= 0) {
        toast({ title: "Missing Information", description: "Please provide title, author, and total pages for manual entry.", variant: "destructive"});
        return;
    }
    processAndSetBook(manualBookEntry, true);
  };

  // This function would be called when the user confirms adding the selected book to their shelf
  const handleAddBookToShelfAndTrack = async () => {
    if (!user || !bookToProcess) return;
    setIsSaving(true);

    try {
      // CONCEPTUAL API CALL:
      // 1. Check if book exists in your `books` table (by google_books_id or ISBN).
      //    If not, add it to `books` table. This API call should return your internal `book.db_id`.
      // const bookResponse = await fetch('/api/books/find-or-create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bookToProcess), // Send all processed book details
      // });
      // if (!bookResponse.ok) throw new Error("Failed to save book to library");
      // const bookDataFromDB: { id: string /* other fields */ } = await bookResponse.json();
      // const book_db_id = bookDataFromDB.id;

      // Simulated:
      await new Promise(resolve => setTimeout(resolve, 700));
      const book_db_id = bookToProcess.google_books_id || `manual_${Date.now()}`; // Simulated DB ID
      
      setBookToProcess(prev => prev ? { ...prev, db_id: book_db_id } : null);


      // 2. Add to `user_books` table (user's shelf)
      // const userBookData = {
      //   user_id: user.id,
      //   book_id: book_db_id,
      //   status: shelfStatus, // 'reading', 'want_to_read'
      //   current_page: shelfStatus === 'reading' ? pagesRead : 0,
      //   // ... other fields like start_date if status is 'reading'
      // };
      // const userBookResponse = await fetch('/api/user-books', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userBookData),
      // });
      // if (!userBookResponse.ok) throw new Error("Failed to add book to your shelf");
      // const addedUserBook = await userBookResponse.json();

      toast({
        title: `Book ${shelfStatus === 'reading' ? 'added and tracking started' : 'added to "Want to Read"'}!`,
        description: `"${bookToProcess.title}" is now on your shelf.`,
      });

      // If status is 'reading', proceed to tracking or directly save initial progress.
      // If 'want_to_read', maybe redirect to My Books page.
      if (shelfStatus === 'reading') {
        // If tracking immediately, call handleTrack or similar logic.
        // For this example, we assume the user will now fill out the tracking form.
        // The `handleTrack` function will then use `bookToProcess.db_id`.
      } else {
        router.push('/books');
      }

    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };


  const handleTrack = async () => {
    if (!user || !bookToProcess || !bookToProcess.db_id) {
      toast({ title: "Error", description: "Book information is missing or not saved to library yet. Please add the book to your shelf first.", variant: "destructive" });
      setIsSaving(false);
      return;
    }
    setIsSaving(true);

    const trackingPayload = {
      userId: user.id,
      book_id: bookToProcess.db_id, // Use our internal DB ID
      trackingType,
      status: trackingType === "completed" ? 'completed' : shelfStatus, // shelfStatus is 'reading' if we got here
      current_page: trackingType === "progress" || trackingType === "completed" ? (trackingType === "completed" ? bookToProcess.total_pages : pagesRead) : undefined,
      total_pages: bookToProcess.total_pages, // Send total pages for reference
      time_spent_minutes: trackingType === "time" ? readingTime : undefined,
      notes,
      is_public_update: isPublic,
      date: new Date().toISOString(),
      // If it's a new book being marked as 'reading' for the first time, you might also send start_date
      start_date: (trackingType === 'progress' && pagesRead > 0 && !searchParams.get("userBookId")) ? new Date().toISOString() : undefined,
      finish_date: trackingType === 'completed' ? new Date().toISOString() : undefined,
    };

    console.log("Tracking data to be sent to /api/reading-progress:", trackingPayload);

    try {
      // CONCEPTUAL API CALL to save progress
      // const response = await fetch("/api/reading-progress", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(trackingPayload),
      // });
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to save progress");
      // }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate save

      toast({
        title: "Progress Saved!",
        description: `Your reading progress for "${bookToProcess.title}" has been saved.`,
        action: <CheckCircle className="text-green-500" />,
      });
      router.push("/books");
    } catch (error) {
      toast({ title: "Error Saving Progress", description: (error as Error).message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const totalPagesForDisplay = bookToProcess?.total_pages || 0;

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (!user) {
    return <div className="container mx-auto py-6 text-center"><p>Please <Link href="/auth/signin" className="underline text-primary">sign in</Link> to track books.</p></div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Track Your Reading</h1>
      </div>

      {/* Section 1: Book Selection (Search or Manual) or Display Selected Book */}
      {activeTab !== "track" ? (
         <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            setBookToProcess(null); 
            setSearchResults([]);
            // setSearchQuery(""); // Keep search query if user wants to refine
         }} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Online</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="search" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Find Your Book Online</CardTitle>
                <CardDescription>Search for the book you're reading.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Search by title, author, or ISBN"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isSearching}>
                      {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                      Search
                    </Button>
                  </div>
                </form>

                {isSearching && !searchResults.length && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-md" />)}
                  </div>
                )}
                {!isSearching && searchQuery && searchResults.length === 0 && (
                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription>No books found for "{searchQuery}". Try a different search or manual entry.</AlertDescription>
                  </Alert>
                )}
                {searchResults.length > 0 && (
                  <div className="mt-6 space-y-2 max-h-[50vh] overflow-y-auto">
                    <h3 className="text-sm font-medium text-muted-foreground">Select a book to track:</h3>
                    {searchResults.map((item) => (
                      <Card key={item.id} className="p-3 flex items-center space-x-3 hover:shadow-md transition-shadow cursor-pointer" onClick={() => processAndSetBook(item)}>
                        <img 
                            src={item.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=64&width=48&text=Book"} 
                            alt={item.volumeInfo.title} 
                            className="h-16 w-12 object-cover rounded-sm flex-shrink-0"
                        />
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{item.volumeInfo.title}</p>
                            <p className="text-xs text-muted-foreground">{item.volumeInfo.authors?.join(', ')}</p>
                            <p className="text-xs text-muted-foreground">{item.volumeInfo.pageCount || 'N/A'} pages</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); processAndSetBook(item); }}>Select</Button>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manual Book Entry</CardTitle>
                <CardDescription>Enter book details if you can't find it or prefer manual input.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Manual entry form fields */}
                <div className="space-y-2">
                  <Label htmlFor="manual-title">Book Title <span className="text-red-500">*</span></Label>
                  <Input id="manual-title" name="title" placeholder="e.g., The Great Gatsby" value={manualBookEntry.title} onChange={handleManualEntryChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-author">Author <span className="text-red-500">*</span></Label>
                  <Input id="manual-author" name="author" placeholder="e.g., F. Scott Fitzgerald" value={manualBookEntry.author} onChange={handleManualEntryChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-total-pages">Total Pages <span className="text-red-500">*</span></Label>
                  <Input id="manual-total-pages" name="total_pages" type="number" placeholder="e.g., 180" value={manualBookEntry.total_pages || ""} onChange={handleManualEntryChange} required min="1" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="manual-isbn13">ISBN-13 (Optional)</Label>
                  <Input id="manual-isbn13" name="isbn_13" placeholder="e.g., 9780743273565" value={manualBookEntry.isbn_13 || ""} onChange={handleManualEntryChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-genre">Genre (Optional)</Label>
                  <Input id="manual-genre" name="genre" placeholder="e.g., Classic Literature" value={manualBookEntry.genre || ""} onChange={handleManualEntryChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manual-cover-url">Cover Image URL (Optional)</Label>
                  <Input id="manual-cover-url" name="cover_url" placeholder="https://example.com/book.jpg" value={manualBookEntry.cover_url || ""} onChange={handleManualEntryChange} />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUseManualEntry} className="w-full" disabled={!manualBookEntry.title || !manualBookEntry.author || manualBookEntry.total_pages <= 0}>
                    <Library className="mr-2 h-4 w-4" /> Use This Book
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Section 2: Tracking Form (shown after a book is selected/processed)
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                    <img 
                        src={bookToProcess?.cover_url || "/placeholder.svg?height=96&width=72&text=Book"} 
                        alt={bookToProcess?.title} 
                        className="h-24 w-18 object-cover rounded-md flex-shrink-0"
                    />
                    <div>
                        <CardTitle className="text-xl">{bookToProcess?.title}</CardTitle>
                        <CardDescription>by {bookToProcess?.author}</CardDescription>
                        <p className="text-xs text-muted-foreground">{bookToProcess?.total_pages || 'N/A'} pages</p>
                        {bookToProcess?.db_id && <Badge variant="secondary" className="mt-1">In Your Library</Badge>}
                    </div>
                </div>
                <Button variant="link" size="sm" onClick={() => {
                    setBookToProcess(null);
                    setManualBookEntry({ title: "", author: "", total_pages: 0 });
                    setActiveTab("search"); 
                }}>
                    Change Book
                </Button>
            </div>
          </CardHeader>

          {!bookToProcess?.db_id && ( // If book is not yet in our DB (i.e., no db_id)
            <CardContent className="border-t pt-4">
                <p className="text-sm mb-2">This book isn't in your library yet. How would you like to add it?</p>
                <div className="flex space-x-2 mb-4">
                    <Button onClick={() => {setShelfStatus('reading'); handleAddBookToShelfAndTrack();}} disabled={isSaving}>
                        <BookOpen className="mr-2 h-4 w-4" /> {isSaving && shelfStatus==='reading' ? <Loader2 className="animate-spin mr-2"/> : null} Start Reading
                    </Button>
                    <Button variant="outline" onClick={() => {setShelfStatus('want_to_read'); handleAddBookToShelfAndTrack();}} disabled={isSaving}>
                        <BookPlus className="mr-2 h-4 w-4" /> {isSaving && shelfStatus==='want_to_read' ? <Loader2 className="animate-spin mr-2"/> : null} Add to Want to Read
                    </Button>
                </div>
            </CardContent>
          )}

          {bookToProcess?.db_id && ( // Only show tracking options if book is in our DB
            <>
              <CardContent className="border-t pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Update your reading activity:</Label>
                  <RadioGroup
                    value={trackingType}
                    onValueChange={(value) => setTrackingType(value as "progress" | "time" | "completed")}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-3"
                  >
                    <Label htmlFor="track-progress" className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${trackingType === 'progress' ? 'border-primary ring-2 ring-primary' : ''}`}>
                      <RadioGroupItem value="progress" id="track-progress" />
                      <BookOpen className="h-4 w-4" />
                      <span>Update Pages</span>
                    </Label>
                    <Label htmlFor="track-time" className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${trackingType === 'time' ? 'border-primary ring-2 ring-primary' : ''}`}>
                      <RadioGroupItem value="time" id="track-time" />
                      <Clock className="h-4 w-4" />
                      <span>Log Time</span>
                    </Label>
                    <Label htmlFor="track-completed" className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:border-primary ${trackingType === 'completed' ? 'border-primary ring-2 ring-primary' : ''}`}>
                      <RadioGroupItem value="completed" id="track-completed" />
                      <CalendarIcon className="h-4 w-4" />
                      <span>Mark Completed</span>
                    </Label>
                  </RadioGroup>
                </div>

                {trackingType === "progress" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pages-read">Current Page</Label>
                      <span className="text-sm font-medium">
                        {pagesRead} of {totalPagesForDisplay}
                      </span>
                    </div>
                    <Slider
                      id="pages-read"
                      min={0}
                      max={totalPagesForDisplay}
                      step={1}
                      value={[pagesRead]}
                      onValueChange={(value) => setPagesRead(value[0])}
                      disabled={totalPagesForDisplay <= 0}
                    />
                    {totalPagesForDisplay <=0 && <p className="text-xs text-red-500">Total pages not set for this book.</p>}
                  </div>
                )}

                {trackingType === "time" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reading-time">Time Spent Reading (minutes)</Label>
                      <span className="text-sm font-medium">{readingTime} minutes</span>
                    </div>
                    <Slider
                      id="reading-time"
                      min={5}
                      max={180}
                      step={5}
                      value={[readingTime]}
                      onValueChange={(value) => setReadingTime(value[0])}
                    />
                  </div>
                )}

                {trackingType === "completed" && (
                  <Alert variant="default" className="bg-green-50 border-green-200 text-green-700">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription>You're marking this book as completed. Well done!</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add your thoughts, favorite quotes, or reflections..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="public-update" checked={isPublic} onCheckedChange={setIsPublic} />
                  <Label htmlFor="public-update">Share this update with friends</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleTrack} className="w-full" disabled={isSaving || (totalPagesForDisplay <=0 && (trackingType === 'progress' || trackingType === 'completed'))}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSaving ? "Saving..." : "Save Reading Activity"}
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
