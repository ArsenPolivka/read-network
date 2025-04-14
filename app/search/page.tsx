"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, SearchIcon, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [sortBy, setSortBy] = useState("relevance")

  // Mock search results - in a real app, this would come from an API
  const books = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      cover: "/placeholder.svg?height=80&width=60",
      genre: "Fiction",
      rating: 4.2,
      year: 2020,
      description:
        "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/placeholder.svg?height=80&width=60",
      genre: "Science Fiction",
      rating: 4.5,
      year: 2021,
      description:
        "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the Earth itself will perish.",
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      cover: "/placeholder.svg?height=80&width=60",
      genre: "Self-Help",
      rating: 4.8,
      year: 2018,
      description:
        "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies that will teach you how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    },
    {
      id: 4,
      title: "Dune",
      author: "Frank Herbert",
      cover: "/placeholder.svg?height=80&width=60",
      genre: "Science Fiction",
      rating: 4.7,
      year: 1965,
      description:
        'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the "spice" melange, a drug capable of extending life and enhancing consciousness.',
    },
    {
      id: 5,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "/placeholder.svg?height=80&width=60",
      genre: "Fiction",
      rating: 4.6,
      year: 1988,
      description:
        "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure. His quest will lead him to riches far different—and far more satisfying—than he ever imagined.",
    },
    {
      id: 6,
      title: "Sapiens: A Brief History of Humankind",
      author: "Yuval Noah Harari",
      cover: "/placeholder.svg?height=80&width=60",
      genre: "Non-Fiction",
      rating: 4.5,
      year: 2011,
      description:
        "In Sapiens, Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical—and sometimes devastating—breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.",
    },
  ]

  const users = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alexreads",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 42,
      bio: "Sci-fi enthusiast and coffee lover",
    },
    {
      id: 2,
      name: "Sarah Williams",
      username: "bookworm_sarah",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 87,
      bio: "Reading is my escape from reality",
    },
    {
      id: 3,
      name: "Michael Chen",
      username: "mike_reads",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 63,
      bio: "Fantasy and mystery book lover",
    },
  ]

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Romance",
    "Biography",
    "History",
    "Self-Help",
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would search an API here
    console.log("Searching for:", searchQuery)
  }

  const filteredBooks = books.filter((book) => {
    if (selectedGenre && book.genre !== selectedGenre) {
      return false
    }
    if (searchQuery) {
      return (
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "rating") {
      return b.rating - a.rating
    } else if (sortBy === "newest") {
      return b.year - a.year
    } else if (sortBy === "oldest") {
      return a.year - b.year
    }
    // Default: relevance (no specific sorting)
    return 0
  })

  const filteredUsers = users.filter((user) => {
    if (searchQuery) {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-64 space-y-4 hidden md:block">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Genres</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-genres"
                      checked={selectedGenre === ""}
                      onCheckedChange={() => setSelectedGenre("")}
                    />
                    <Label htmlFor="all-genres">All Genres</Label>
                  </div>
                  {genres.map((genre) => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={genre}
                        checked={selectedGenre === genre}
                        onCheckedChange={() => setSelectedGenre(genre)}
                      />
                      <Label htmlFor={genre}>{genre}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search books, authors, or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <h3 className="font-medium mb-2">Genres</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="mobile-all-genres"
                          checked={selectedGenre === ""}
                          onCheckedChange={() => setSelectedGenre("")}
                        />
                        <Label htmlFor="mobile-all-genres">All Genres</Label>
                      </div>
                      {genres.map((genre) => (
                        <div key={`mobile-${genre}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-${genre}`}
                            checked={selectedGenre === genre}
                            onCheckedChange={() => setSelectedGenre(genre)}
                          />
                          <Label htmlFor={`mobile-${genre}`}>{genre}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Tabs defaultValue="books" className="space-y-4">
            <TabsList>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="books" className="space-y-4">
              {sortedBooks.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sortedBooks.map((book) => (
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
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(book.rating) ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-1 text-sm text-muted-foreground">{book.rating}</span>
                            </div>
                            <Badge variant="outline">{book.genre}</Badge>
                          </div>
                        </div>
                        <p className="mt-4 text-sm line-clamp-3">{book.description}</p>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Add to List
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No books found matching your criteria</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="users" className="space-y-4">
              {filteredUsers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredUsers.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm">{user.bio}</p>
                        <p className="mt-2 text-sm">
                          <span className="font-medium">{user.booksRead}</span> books read
                        </p>
                        <div className="mt-4 flex justify-end">
                          <Button size="sm">Follow</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
