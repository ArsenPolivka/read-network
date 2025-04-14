"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, BookOpen } from "lucide-react"

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - in a real app, this would come from an API
  const friends = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alexreads",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 42,
      currentlyReading: "Project Hail Mary",
      lastActive: "2 hours ago",
      favoriteGenres: ["Science Fiction", "Fantasy"],
    },
    {
      id: 2,
      name: "Sarah Williams",
      username: "bookworm_sarah",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 87,
      currentlyReading: "The Midnight Library",
      lastActive: "1 day ago",
      favoriteGenres: ["Fiction", "Mystery"],
    },
    {
      id: 3,
      name: "Michael Chen",
      username: "mike_reads",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 63,
      currentlyReading: "Atomic Habits",
      lastActive: "3 days ago",
      favoriteGenres: ["Self-Help", "Non-Fiction"],
    },
  ]

  const friendRequests = [
    {
      id: 4,
      name: "Emily Davis",
      username: "em_reads",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 29,
      mutualFriends: 2,
    },
    {
      id: 5,
      name: "David Wilson",
      username: "david_bookshelf",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 51,
      mutualFriends: 1,
    },
  ]

  const suggestions = [
    {
      id: 6,
      name: "Jessica Brown",
      username: "jess_books",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 38,
      mutualFriends: 3,
    },
    {
      id: 7,
      name: "Robert Taylor",
      username: "rob_reader",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 72,
      mutualFriends: 2,
    },
    {
      id: 8,
      name: "Lisa Martinez",
      username: "lisa_lit",
      avatar: "/placeholder.svg?height=40&width=40",
      booksRead: 45,
      mutualFriends: 1,
    },
  ]

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Friend
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="friends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="friends">
            <Users className="mr-2 h-4 w-4" />
            My Friends
          </TabsTrigger>
          <TabsTrigger value="requests">
            <UserPlus className="mr-2 h-4 w-4" />
            Friend Requests
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Users className="mr-2 h-4 w-4" />
            Suggestions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="friends" className="space-y-4">
          {filteredFriends.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFriends.map((friend) => (
                <Card key={friend.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                        <AvatarFallback>{friend.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{friend.name}</h3>
                        <p className="text-sm text-muted-foreground">@{friend.username}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          Currently reading: <span className="font-medium">{friend.currentlyReading}</span>
                        </span>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">{friend.booksRead}</span> books read
                      </p>
                      <p className="text-sm text-muted-foreground">Last active {friend.lastActive}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {friend.favoriteGenres.map((genre) => (
                          <Badge key={genre} variant="secondary">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No friends found matching your search</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="requests" className="space-y-4">
          {friendRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {friendRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                        <AvatarFallback>{request.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{request.name}</h3>
                        <p className="text-sm text-muted-foreground">@{request.username}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">{request.booksRead}</span> books read
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {request.mutualFriends} mutual {request.mutualFriends === 1 ? "friend" : "friends"}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="outline" size="sm">
                        Ignore
                      </Button>
                      <Button size="sm">Accept</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No pending friend requests</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={suggestion.avatar || "/placeholder.svg"} alt={suggestion.name} />
                        <AvatarFallback>{suggestion.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold">{suggestion.name}</h3>
                        <p className="text-sm text-muted-foreground">@{suggestion.username}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">{suggestion.booksRead}</span> books read
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.mutualFriends} mutual {suggestion.mutualFriends === 1 ? "friend" : "friends"}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add Friend
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No friend suggestions available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
