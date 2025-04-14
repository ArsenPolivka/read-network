import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Edit, Plus } from "lucide-react"

export function ReadingGoals() {
  // This would come from your API in a real app
  const goals = [
    {
      id: 1,
      title: "Read 12 books this year",
      current: 5,
      target: 12,
      progress: 42,
      timeframe: "2023",
    },
    {
      id: 2,
      title: "Read 30 minutes daily",
      current: 25,
      target: 30,
      progress: 83,
      timeframe: "Daily",
    },
    {
      id: 3,
      title: "Finish current book",
      current: 245,
      target: 320,
      progress: 77,
      timeframe: "Book progress",
      bookTitle: "Project Hail Mary",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reading Goals</CardTitle>
          <CardDescription>Track your progress towards your reading goals</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {goal.timeframe}
                    {goal.bookTitle && ` • ${goal.bookTitle}`}
                  </p>
                </div>
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>
                  {goal.current} / {goal.target}
                  {goal.id === 2 ? " minutes" : goal.id === 3 ? " pages" : " books"}
                </span>
                <span className="font-medium">{goal.progress}%</span>
              </div>
              <Progress value={goal.progress} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
