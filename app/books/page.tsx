import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, BookOpen, BookMarked, Clock } from "lucide-react"

export default function BooksPage() {
  // This would come from your API in a real app
  const currentlyReading = [
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "/placeholder.svg?height=80&width=60",
      progress: 35,
      pagesRead: 70,
      totalPages: 197,
      lastRead: "2 days ago",
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/placeholder.svg?height=80&width=60",
      progress: 75,
      pagesRead: 245,
      totalPages: 320,
      lastRead: "Yesterday",
    },
  ]

  const readingList = [
    {
      id: 3,
      title: "Dune",
      author: "Frank Herbert",
      cover: "/placeholder.svg?height=80&width=60",
      addedOn: "2 weeks ago",
      genre: "Science Fiction",
    },
    {
      id: 4,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      cover: "/placeholder.svg?height=80&width=60",
      addedOn: "1 month ago",
      genre: "Fantasy",
    },
    {
      id: 5,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      cover: "/placeholder.svg?height=80&width=60",
      addedOn: "3 weeks ago",
      genre: "Non-Fiction",
    },
  ]

  const completedBooks = [
    {
      id: 6,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/placeholder.svg?height=80&width=60",
      completedOn: "April 10, 2023",
      rating: 4,
      genre: "Fiction",
    },
    {
      id: 7,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/placeholder.svg?height=80&width=60",
      completedOn: "March 22, 2023",
      rating: 5,
      genre: "Self-Help",
    },
  ]

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
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Currently Reading</TabsTrigger>
          <TabsTrigger value="list">Reading List</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {currentlyReading.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="h-24 w-16 rounded-md">
                      <AvatarImage src={book.cover || "/placeholder.svg"} alt={book.title} />
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
                            {book.pagesRead} of {book.totalPages} pages
                          </span>
                          <span>Last read {book.lastRead}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between px-6 py-4 pt-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Link href={`/books/${book.id}/track`}>
                    <Button size="sm">Continue Reading</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {readingList.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="h-24 w-16 rounded-md">
                      <AvatarImage src={book.cover || "/placeholder.svg"} alt={book.title} />
                      <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      <Badge variant="outline">{book.genre}</Badge>
                      <p className="text-xs text-muted-foreground">Added {book.addedOn}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between px-6 py-4 pt-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Link href={`/books/${book.id}/start`}>
                    <Button size="sm">Start Reading</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedBooks.map((book) => (
              <Card key={book.id}>
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <Avatar className="h-24 w-16 rounded-md">
                      <AvatarImage src={book.cover || "/placeholder.svg"} alt={book.title} />
                      <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-bold">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      <Badge variant="outline">{book.genre}</Badge>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < book.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Completed on {book.completedOn}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between px-6 py-4 pt-0">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Write Review
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
