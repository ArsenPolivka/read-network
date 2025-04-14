"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send } from "lucide-react"

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [messageText, setMessageText] = useState("")

  // Mock data - in a real app, this would come from an API
  const conversations = [
    {
      id: 1,
      user: {
        id: 1,
        name: "Alex Johnson",
        username: "alexreads",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      lastMessage: {
        text: "Have you started reading Project Hail Mary yet?",
        timestamp: "10:42 AM",
        isRead: true,
      },
      messages: [
        {
          id: 1,
          text: "Hey, have you read The Midnight Library?",
          timestamp: "Yesterday, 9:30 AM",
          isUser: false,
        },
        {
          id: 2,
          text: "Yes! I finished it last week. It was amazing!",
          timestamp: "Yesterday, 9:45 AM",
          isUser: true,
        },
        {
          id: 3,
          text: "I thought so too! The concept was so unique.",
          timestamp: "Yesterday, 10:00 AM",
          isUser: false,
        },
        {
          id: 4,
          text: "What are you reading now?",
          timestamp: "Yesterday, 10:05 AM",
          isUser: true,
        },
        {
          id: 5,
          text: "I just started Project Hail Mary by Andy Weir.",
          timestamp: "Yesterday, 10:15 AM",
          isUser: false,
        },
        {
          id: 6,
          text: "Have you started reading Project Hail Mary yet?",
          timestamp: "10:42 AM",
          isUser: false,
        },
      ],
    },
    {
      id: 2,
      user: {
        id: 2,
        name: "Sarah Williams",
        username: "bookworm_sarah",
        avatar: "/placeholder.svg?height=40&width=40",
        online: false,
      },
      lastMessage: {
        text: "I'll lend you my copy when we meet next week!",
        timestamp: "Yesterday",
        isRead: false,
      },
      messages: [
        {
          id: 1,
          text: "Hi! I saw you're reading Dune. How is it?",
          timestamp: "2 days ago, 3:30 PM",
          isUser: false,
        },
        {
          id: 2,
          text: "It's fantastic! The world-building is incredible.",
          timestamp: "2 days ago, 4:00 PM",
          isUser: true,
        },
        {
          id: 3,
          text: "I've been wanting to read it for ages!",
          timestamp: "2 days ago, 4:05 PM",
          isUser: false,
        },
        {
          id: 4,
          text: "You should definitely pick it up. It's a classic for a reason.",
          timestamp: "2 days ago, 4:10 PM",
          isUser: true,
        },
        {
          id: 5,
          text: "Do you have a copy I could borrow?",
          timestamp: "Yesterday, 11:30 AM",
          isUser: false,
        },
        {
          id: 6,
          text: "I'll lend you my copy when we meet next week!",
          timestamp: "Yesterday, 12:15 PM",
          isUser: true,
        },
      ],
    },
    {
      id: 3,
      user: {
        id: 3,
        name: "Michael Chen",
        username: "mike_reads",
        avatar: "/placeholder.svg?height=40&width=40",
        online: true,
      },
      lastMessage: {
        text: "Thanks for the book recommendation!",
        timestamp: "2 days ago",
        isRead: true,
      },
      messages: [
        {
          id: 1,
          text: "Hey, do you have any good non-fiction recommendations?",
          timestamp: "3 days ago, 2:30 PM",
          isUser: false,
        },
        {
          id: 2,
          text: "Definitely! Have you read 'Atomic Habits' by James Clear?",
          timestamp: "3 days ago, 2:45 PM",
          isUser: true,
        },
        {
          id: 3,
          text: "No, what's it about?",
          timestamp: "3 days ago, 3:00 PM",
          isUser: false,
        },
        {
          id: 4,
          text: "It's about building good habits and breaking bad ones. Really practical advice!",
          timestamp: "3 days ago, 3:10 PM",
          isUser: true,
        },
        {
          id: 5,
          text: "Sounds interesting! I'll check it out.",
          timestamp: "2 days ago, 10:30 AM",
          isUser: false,
        },
        {
          id: 6,
          text: "Thanks for the book recommendation!",
          timestamp: "2 days ago, 10:35 AM",
          isUser: false,
        },
      ],
    },
  ]

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConversationData = conversations.find((conversation) => conversation.id === selectedConversation)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedConversation) return

    // In a real app, you would send this to your API
    console.log("Sending message:", messageText, "to conversation:", selectedConversation)

    // Clear the input
    setMessageText("")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col h-[calc(100vh-8rem)] overflow-hidden rounded-lg border bg-background shadow">
        <div className="flex h-full">
          {/* Conversation List */}
          <div className="w-full md:w-80 border-r">
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold">Messages</h1>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-accent ${
                    selectedConversation === conversation.id ? "bg-accent" : ""
                  } ${
                    !conversation.lastMessage.isRead && conversation.lastMessage.isUser === false ? "font-medium" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
                      <AvatarFallback>{conversation.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {conversation.user.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium truncate">{conversation.user.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.lastMessage.timestamp}</span>
                    </div>
                    <p className="text-sm truncate text-muted-foreground">{conversation.lastMessage.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Area */}
          {selectedConversationData ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-4 p-4 border-b">
                <Avatar>
                  <AvatarImage
                    src={selectedConversationData.user.avatar || "/placeholder.svg"}
                    alt={selectedConversationData.user.name}
                  />
                  <AvatarFallback>{selectedConversationData.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedConversationData.user.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    @{selectedConversationData.user.username} •{" "}
                    {selectedConversationData.user.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversationData.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-medium">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a conversation from the list to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
