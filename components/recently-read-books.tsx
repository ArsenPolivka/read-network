import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function RecentlyReadBooks() {
  // This would come from your API in a real app
  const recentBooks = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/placeholder.svg?height=80&width=60",
      progress: 100,
      rating: 4,
      dateFinished: "2023-04-10",
      genre: "Fiction",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/placeholder.svg?height=80&width=60",
      progress: 100,
      rating: 5,
      dateFinished: "2023-03-22",
      genre: "Self-Help",
    },
    {
      id: 3,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/placeholder.svg?height=80&width=60",
      progress: 75,
      rating: null,
      dateFinished: null,
      genre: "Science Fiction",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Read Books</CardTitle>
        <CardDescription>Your reading activity from the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBooks.map((book) => (
            <div key={book.id} className="flex items-center space-x-4 rounded-md border p-4">
              <Avatar className="h-20 w-16 rounded-md">
                <AvatarImage src={book.cover || "/placeholder.svg"} alt={book.title} />
                <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{book.title}</p>
                  <Badge variant="outline">{book.genre}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">by {book.author}</p>
                <div className="flex items-center text-sm">
                  <div className="flex items-center">
                    {book.progress === 100 ? (
                      <span className="text-green-600 font-medium">Completed</span>
                    ) : (
                      <span>{book.progress}% complete</span>
                    )}
                  </div>
                  {book.dateFinished && (
                    <span className="text-muted-foreground ml-4">
                      Finished on {new Date(book.dateFinished).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {book.rating && (
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
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
