"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, Clock, Calendar } from "lucide-react"

export default function TrackBookPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState<any>(null)
  const [trackingType, setTrackingType] = useState("progress")
  const [pagesRead, setPagesRead] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [readingTime, setReadingTime] = useState(30)
  const [notes, setNotes] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  // Mock search results - in a real app, this would come from an API
  const searchResults = [
    {
      id: 1,
      title: "The Alchemist",
      author: "Paulo Coelho",
      cover: "/placeholder.svg?height=80&width=60",
      totalPages: 197,
    },
    {
      id: 2,
      title: "Project Hail Mary",
      author: "Andy Weir",
      cover: "/placeholder.svg?height=80&width=60",
      totalPages: 320,
    },
    {
      id: 3,
      title: "Dune",
      author: "Frank Herbert",
      cover: "/placeholder.svg?height=80&width=60",
      totalPages: 412,
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would search an API here
    console.log("Searching for:", searchQuery)
  }

  const handleSelectBook = (book: any) => {
    setSelectedBook(book)
    setTotalPages(book.totalPages)
  }

  const handleTrack = () => {
    // In a real app, you would save this data to your database
    const trackingData = {
      bookId: selectedBook?.id,
      trackingType,
      pagesRead,
      totalPages,
      readingTime,
      notes,
      isPublic,
      date: new Date().toISOString(),
    }

    console.log("Tracking data:", trackingData)

    // Navigate back to books page
    router.push("/books")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Track Your Reading</h1>
      </div>

      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">Search Book</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Book</CardTitle>
              <CardDescription>Search for the book you're reading</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by title or author"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </form>

              {searchQuery && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium">Search Results</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((book) => (
                      <div
                        key={book.id}
                        className={`flex cursor-pointer items-center space-x-4 rounded-md border p-4 ${
                          selectedBook?.id === book.id ? "border-primary bg-primary/5" : ""
                        }`}
                        onClick={() => handleSelectBook(book)}
                      >
                        <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-sm text-muted-foreground">by {book.author}</p>
                          <p className="text-xs text-muted-foreground">{book.totalPages} pages</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Book Entry</CardTitle>
              <CardDescription>Enter the details of the book you're reading</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Book Title</Label>
                    <Input id="title" placeholder="Enter book title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input id="author" placeholder="Enter author name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="isbn">ISBN (optional)</Label>
                    <Input id="isbn" placeholder="Enter ISBN" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="total-pages">Total Pages</Label>
                    <Input
                      id="total-pages"
                      type="number"
                      placeholder="Enter total pages"
                      value={totalPages || ""}
                      onChange={(e) => setTotalPages(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre (optional)</Label>
                  <Input id="genre" placeholder="Enter genre" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedBook && (
        <Card>
          <CardHeader>
            <CardTitle>Track Your Progress</CardTitle>
            <CardDescription>Update your reading progress for {selectedBook.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>What would you like to track?</Label>
                <RadioGroup
                  value={trackingType}
                  onValueChange={setTrackingType}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                >
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="progress" id="progress" />
                    <Label htmlFor="progress" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Pages Read
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="time" id="time" />
                    <Label htmlFor="time" className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Reading Time
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-md border p-4">
                    <RadioGroupItem value="completed" id="completed" />
                    <Label htmlFor="completed" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Mark as Completed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {trackingType === "progress" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pages-read">Pages Read</Label>
                      <span className="text-sm font-medium">
                        {pagesRead} of {totalPages}
                      </span>
                    </div>
                    <Slider
                      id="pages-read"
                      min={0}
                      max={totalPages}
                      step={1}
                      value={[pagesRead]}
                      onValueChange={(value) => setPagesRead(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0</span>
                      <span>{totalPages}</span>
                    </div>
                  </div>
                </div>
              )}

              {trackingType === "time" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reading-time">Reading Time (minutes)</Label>
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
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 min</span>
                      <span>3 hours</span>
                    </div>
                  </div>
                </div>
              )}

              {trackingType === "completed" && (
                <div className="space-y-4">
                  <div className="rounded-md border p-4 bg-green-50">
                    <p className="text-sm">You're marking this book as completed. Great job!</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add your thoughts, favorite quotes, or reflections..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="public">Share this update with friends</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setSelectedBook(null)}>
              Cancel
            </Button>
            <Button onClick={handleTrack}>Save Progress</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
