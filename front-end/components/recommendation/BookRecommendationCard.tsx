"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { BookRecommendation } from "@/types"
import { useEffect, useState } from "react"
import { Book, Inbox } from "lucide-react"

interface BookRecommendationCardProps {
  book: BookRecommendation
  onAddToCollection: (item: BookRecommendation, type: "book") => void
  animationDelay?: number
}

export default function BookRecommendationCard({
  book,
  onAddToCollection,
  animationDelay = 0,
}: BookRecommendationCardProps) {
  const handleDetailClick = () => {
    const searchUrl = `https://www.nl.go.kr/NL/contents/search.do?kwd=${encodeURIComponent(
      book.title
    )}`

    window.open(searchUrl, "_blank")
  }
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
          {book.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300 mb-3">
          {book.genre}
        </Badge>
        {book.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{book.description}</p>
        )}
        <div className="flex space-x-2">
          <Button className="w-full" variant="outline" onClick={handleDetailClick}>
            <Book className="w-4 h-4 mr-2" />
            자세히
          </Button>
          <Button className="w-full" variant="outline" onClick={() => onAddToCollection(book, "book")}>
            <Inbox className="w-4 h-4 mr-2" />
            컬렉션에 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
