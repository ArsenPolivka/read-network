"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { BookOpen, ChevronRight, ChevronLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "Horror",
  "Biography",
  "History",
  "Self-Help",
  "Science",
  "Poetry",
  "Comics",
  "Young Adult",
]

export default function Onboarding() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [booksRead, setBooksRead] = useState<string>("0-10")
  const [pagesPerDay, setPagesPerDay] = useState<number>(30)
  const [yearlyGoal, setYearlyGoal] = useState<number>(12)
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Save onboarding data
      saveOnboardingData()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const saveOnboardingData = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to complete onboarding",
        variant: "destructive",
      })
      router.push("/auth/signin")
      return
    }

    setIsLoading(true)

    try {
      const onboardingData = {
        selectedGenres,
        booksRead,
        pagesPerDay,
        yearlyGoal,
      }

      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to save onboarding data")
      }

      toast({
        title: "Onboarding complete!",
        description: "Your preferences have been saved.",
      })

      // Navigate to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving onboarding data:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save your preferences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8 flex items-center gap-2">
        <BookOpen className="h-8 w-8" />
        <span className="text-2xl font-bold">Read.</span>
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Set Up Your Profile</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
          <CardDescription>Tell us about your reading preferences to personalize your experience</CardDescription>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select your favorite genres</h3>
              <p className="text-sm text-gray-500">Choose at least 3 genres that interest you</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => handleGenreChange(genre)}
                    />
                    <Label htmlFor={genre} className="text-sm">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your reading habits</h3>
                <div className="space-y-2">
                  <Label htmlFor="books-read">How many books have you read in your life?</Label>
                  <RadioGroup
                    id="books-read"
                    value={booksRead}
                    onValueChange={setBooksRead}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-10" id="0-10" />
                      <Label htmlFor="0-10">0-10 books</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="11-30" id="11-30" />
                      <Label htmlFor="11-30">11-30 books</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="31-100" id="31-100" />
                      <Label htmlFor="31-100">31-100 books</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="100+" id="100+" />
                      <Label htmlFor="100+">100+ books</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pages-per-day">How many pages do you read daily?</Label>
                  <span className="text-sm font-medium">{pagesPerDay} pages</span>
                </div>
                <Slider
                  id="pages-per-day"
                  min={5}
                  max={200}
                  step={5}
                  value={[pagesPerDay]}
                  onValueChange={(value) => setPagesPerDay(value[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5</span>
                  <span>100</span>
                  <span>200</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Set your reading goals</h3>
                <p className="text-sm text-gray-500">
                  Setting a goal can help you stay motivated and track your progress
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="yearly-goal">Books to read this year</Label>
                    <span className="text-sm font-medium">{yearlyGoal} books</span>
                  </div>
                  <Slider
                    id="yearly-goal"
                    min={1}
                    max={100}
                    step={1}
                    value={[yearlyGoal]}
                    onValueChange={(value) => setYearlyGoal(value[0])}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="rounded-lg bg-gray-100 p-4">
                  <p className="text-sm">
                    That's about {Math.round((yearlyGoal / 12) * 10) / 10} books per month or{" "}
                    {Math.round((yearlyGoal / 52) * 10) / 10} books per week.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={step === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? "Saving..." : step === totalSteps ? "Finish" : "Next"}
            {!isLoading && step !== totalSteps && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
