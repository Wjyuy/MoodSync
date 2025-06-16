"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Inbox } from "lucide-react"
import type { MusicRecommendation } from "@/types"
import { useEffect, useState } from "react"

interface MusicRecommendationCardProps {
  music: MusicRecommendation
  onAddToCollection: (item: MusicRecommendation, type: "music") => void
  youtubeVideos?: {
    videoUrl: string
    thumbnail: string
    title: string
    channel: string
  }[]
  animationDelay?: number // 애니메이션 지연 시간 추가
}

export default function MusicRecommendationCard({
  music,
  onAddToCollection,
  youtubeVideos,
  animationDelay = 0,
}: MusicRecommendationCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const video = youtubeVideos?.[0]

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기 상태를 false로 설정
    setIsVisible(false)

    // 약간의 지연 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, animationDelay + 100) // 100ms 추가 지연으로 더 자연스럽게

    return () => clearTimeout(timer)
  }, [animationDelay]) // key가 변경되면 컴포넌트가 다시 마운트되므로 애니메이션이 다시 시작됩니다

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
      {video && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-3">
            <div className="font-semibold truncate">{video.title}</div>
            <div className="text-gray-300 truncate">{video.channel}</div>
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
          {music.title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
          {music.artist}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="dark:bg-gray-600 dark:text-gray-200 transition-colors duration-300">
          {music.genre}
        </Badge>
        <div className="flex space-x-2 mt-4">
          {video?.videoUrl ? (
            <a
              href={video?.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              <Music className="w-4 h-4 mr-2" />
              듣기
            </a>
          ) : (
            <Button className="w-full" variant="outline" disabled>
              <Music className="w-4 h-4 mr-2" />
              듣기 불가
            </Button>
          )}

          <Button className="w-full" variant="outline" onClick={() => onAddToCollection(music, "music")}>
            <Inbox className="w-4 h-4 mr-2" />
            컬렉션에 추가
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
