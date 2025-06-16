"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Inbox } from "lucide-react"
import type { ActivityRecommendation } from "@/types"
import { useEffect, useState } from "react"

interface ActivityRecommendationCardProps {
  activity: ActivityRecommendation
  onAddToCollection: (item: ActivityRecommendation, type: "activity") => void
  animationDelay?: number
}

export default function ActivityRecommendationCard({
  activity,
  onAddToCollection,
  animationDelay = 0,
}: ActivityRecommendationCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(false)

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, animationDelay + 100)

    return () => clearTimeout(timer)
  }, [animationDelay])

  return (
    <Card
      className={`
        hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-500 
        bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600
        transform transition-all duration-700 ease-out
        ${isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-8"}
      `}
      style={{
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {activity.activity}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {activity.type} • {activity.duration}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300">
          {activity.type}
        </Badge>
        <div className="flex space-x-2 mt-4">
          <Button className="w-full" variant="outline" onClick={() => onAddToCollection(activity, "activity")}>
            <Inbox className="w-4 h-4 mr-2" />
            컬렉션에 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
