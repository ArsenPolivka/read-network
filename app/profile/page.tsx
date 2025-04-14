"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Edit, BookOpen, Clock, Calendar, BookMarked } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Jane Reader",
    username: "janereader",
    bio: "Book lover, coffee enthusiast, and aspiring writer. I read mostly fiction and science fiction, but I'm trying to expand my horizons.",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "January 2023",
    favoriteGenres: ["Fiction", "Science Fiction", "Mystery"],
    favoriteBooks: [
      {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        cover: "/placeholder.svg?height=80&width=60",
      },
      {
        id: 2,
        title: "Project Hail Mary",
        author: "Andy Weir",
        cover: "/placeholder.svg?height=80&width=60",
      },
    ],
    stats: {
      booksRead: 12,
      pagesRead: 3840,
      readingTime: 64,
      currentStreak: 7,
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)

  const handleSaveProfile = () => {
    setUser(editedUser)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                      <DialogDescription>Make changes to your profile information.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editedUser.username}
                          onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editedUser.bio}
                          onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile}>Save changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm">{user.bio}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {user.favoriteGenres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center text-sm text-muted-foreground pt-2">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Read</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.booksRead}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.pagesRead}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.readingTime} hours</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.stats.currentStreak} days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="books" className="space-y-4">
        <TabsList>
          <TabsTrigger value="books">Favorite Books</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="books" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Favorite Books</CardTitle>
                <CardDescription>Books that {user.name} loves the most</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Favorites
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {user.favoriteBooks.map((book) => (
                  <div key={book.id} className="flex items-center space-x-4 rounded-md border p-4">
                    <Avatar className="h-20 w-16 rounded-md">
                      <AvatarImage src={book.cover || "/placeholder.svg"} alt={book.title} />
                      <AvatarFallback className="rounded-md">{book.title.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-medium">{book.title}</p>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>{user.name}'s reading activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Started reading "The Alchemist"</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Finished reading "Project Hail Mary"</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">Added "Dune" to reading list</p>
                    <p className="text-sm text-muted-foreground">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Book Reviews</CardTitle>
              <CardDescription>{user.name}'s thoughts on books</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">The Midnight Library</h3>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    A beautiful exploration of the roads not taken. This book made me think about all the possibilities
                    in life and how our choices shape our existence.
                  </p>
                  <p className="text-xs text-muted-foreground">April 10, 2023</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Atomic Habits</h3>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">
                    Life-changing book on habit formation. Clear's practical approach to building good habits and
                    breaking bad ones has already helped me improve my daily routines.
                  </p>
                  <p className="text-xs text-muted-foreground">March 22, 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
