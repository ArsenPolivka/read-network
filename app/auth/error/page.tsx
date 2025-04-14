"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, AlertTriangle } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>("An unknown error occurred")

  useEffect(() => {
    const error = searchParams.get("error")

    if (error) {
      switch (error) {
        case "CredentialsSignin":
          setErrorMessage("Invalid email or password.")
          break
        case "OAuthAccountNotLinked":
          setErrorMessage("This email is already associated with another account.")
          break
        default:
          setErrorMessage("An authentication error occurred.")
          break
      }
    }
  }, [searchParams])

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
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
          <CardDescription className="text-center">{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-gray-500">
            Please try again or contact support if the problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/auth/signin">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
