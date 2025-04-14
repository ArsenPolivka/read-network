"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip } from "recharts"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export function ReadingStats() {
  // This would come from your API in a real app
  const monthlyData = [
    { name: "Jan", books: 1 },
    { name: "Feb", books: 2 },
    { name: "Mar", books: 1 },
    { name: "Apr", books: 1 },
    { name: "May", books: 0 },
    { name: "Jun", books: 0 },
    { name: "Jul", books: 0 },
    { name: "Aug", books: 0 },
    { name: "Sep", books: 0 },
    { name: "Oct", books: 0 },
    { name: "Nov", books: 0 },
    { name: "Dec", books: 0 },
  ]

  const genreData = [
    { name: "Fiction", value: 3 },
    { name: "Non-Fiction", value: 1 },
    { name: "Science Fiction", value: 1 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const weeklyReadingTime = [
    { day: "Mon", minutes: 35 },
    { day: "Tue", minutes: 25 },
    { day: "Wed", minutes: 45 },
    { day: "Thu", minutes: 30 },
    { day: "Fri", minutes: 20 },
    { day: "Sat", minutes: 60 },
    { day: "Sun", minutes: 50 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading Statistics</CardTitle>
        <CardDescription>Visualize your reading habits and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="books" className="space-y-4">
          <TabsList>
            <TabsTrigger value="books">Books Read</TabsTrigger>
            <TabsTrigger value="genres">Genres</TabsTrigger>
            <TabsTrigger value="time">Reading Time</TabsTrigger>
          </TabsList>
          <TabsContent value="books" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="books" fill="#8884d8" name="Books Read" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="genres" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genreData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {genreData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="time" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyReadingTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="minutes" stroke="#8884d8" name="Reading Time (minutes)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
