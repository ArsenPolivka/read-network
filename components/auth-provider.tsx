"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
    redirectTo?: string
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Protected routes that require authentication
const PROTECTED_ROUTES = ['/dashboard', '/books', '/friends', '/messages', '/profile']
const PUBLIC_ROUTES = ['/auth/signin', '/auth/signup', '/auth/signout']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const supabase = createClientSupabaseClient()

  // Check if current route requires auth
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname?.startsWith(route))
  const isAuthRoute = pathname?.startsWith('/auth') && pathname !== '/auth/signout'
  const isRootPath = pathname === '/'

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          return
        }

        setSession(session)
        setUser(session?.user || null)

        // Handle routing based on auth state
        if (session) {
          // User is authenticated
          if (isAuthRoute) {
            // If on auth page while logged in, redirect to intended destination or dashboard
            const redirectTo = searchParams.get('redirect')
            router.push(redirectTo || '/dashboard')
          } else if (isRootPath) {
            // If on root path while logged in, redirect to dashboard
            router.push('/dashboard')
          }
        } else {
          // User is not authenticated
          if (isProtectedRoute) {
            // If trying to access protected route, redirect to signin
            const currentPath = pathname
            router.push(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`)
          }
        }
      } catch (error) {
        console.error("Session retrieval error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email)
      setSession(session)
      setUser(session?.user || null)

      // Handle routing on auth state change
      if (session) {
        if (isAuthRoute) {
          const redirectTo = searchParams.get('redirect')
          router.push(redirectTo || '/dashboard')
        } else if (isRootPath) {
          router.push('/dashboard')
        }
      } else {
        if (isProtectedRoute) {
          router.push('/auth/signin')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname, searchParams, isProtectedRoute, isAuthRoute, isRootPath])

  const signIn = async (email: string, password: string, redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Auth state change listener will handle the redirect
      return { error: null, success: true }
    } catch (error) {
      console.error("Sign in error:", error)
      return {
        error: error instanceof Error ? error : new Error("Failed to sign in"),
        success: false,
      }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      if (user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          full_name: name,
          username: email.split("@")[0],
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
        }

        router.push("/auth/signin?email=" + encodeURIComponent(email) + "&signupSuccess=true")
      }

      return { error: null, success: true }
    } catch (error) {
      console.error("Sign up error:", error)
      return {
        error: error instanceof Error ? error : new Error("Failed to sign up"),
        success: false,
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
