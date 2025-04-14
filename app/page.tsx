import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-xl font-bold">Read.</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Reading Journey Starts Here</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Connect with fellow readers, track your books, and share your reading journey.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/signup">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Reading illustration"
                  className="rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Why Join Read.</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the features that make our platform unique
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 text-center">
                <BookOpen className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Track Your Reading</h3>
                <p className="text-gray-500">Log books, set goals, and monitor your reading progress</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <Users className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Connect with Readers</h3>
                <p className="text-gray-500">Find friends with similar tastes and discuss your favorite books</p>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <TrendingUp className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Reading Analytics</h3>
                <p className="text-gray-500">Visualize your reading habits and track your improvement</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            <span className="text-lg font-bold">Read.</span>
          </div>
          <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} Read. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
