"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BookOpen, Home, Library, Search, User, Users, MessageSquare, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-lg font-semibold tracking-tight">Read.</h2>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/books">
              <Button
                variant={pathname.startsWith("/books") ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Library className="mr-2 h-4 w-4" />
                My Books
              </Button>
            </Link>
            <Link href="/search">
              <Button
                variant={pathname === "/search" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Search className="mr-2 h-4 w-4" />
                Discover
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                variant={pathname === "/profile" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/friends">
              <Button
                variant={pathname === "/friends" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Friends
              </Button>
            </Link>
            <Link href="/messages">
              <Button
                variant={pathname === "/messages" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Settings</h2>
          <div className="space-y-1">
            <Link href="/settings">
              <Button
                variant={pathname === "/settings" ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
