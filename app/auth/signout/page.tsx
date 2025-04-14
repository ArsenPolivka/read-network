"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function SignOut() {
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">Read.</span>
            </Link>
          </div>
          <div className="flex justify-center">
            <LogOut className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign Out</CardTitle>
          <CardDescription className="text-center">Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-500">
            You will be logged out of your account and redirected to the home page.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
