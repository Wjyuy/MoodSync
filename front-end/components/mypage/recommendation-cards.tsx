import { Music, Activity, Book, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { UserRecord } from "@/lib/mypage/mypage-types"

interface RecommendationCardsProps {
  record: UserRecord
}

export function RecommendationCards({ record }: RecommendationCardsProps) {
  const findYoutubeVideo = (musicName: string) => {
    if (!record.youtubeSearchResults) return null

    return (
      record.youtubeSearchResults.find((video) => {
        return (
          video.title.toLowerCase().includes(musicName.toLowerCase()) ||
          (video.channel && video.channel.toLowerCase().includes(musicName.toLowerCase()))
        )
      }) ?? record.youtubeSearchResults.find((video) => video.title === "영상 없음")
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* 음악 추천 */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Music className="h-5 w-5 text-blue-600" />
            추천 음악
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {record.recommendedMusics?.map((music) => {
            const video = findYoutubeVideo(music.musicName)
            console.log("🎵 music:", music.musicName, "📹 video:", video)

            return (
              <div key={music.musicNumber} className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{music.musicName}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{music.musicAuthor}</div>
                  </div>
                </div>
                {video && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-20 h-[60px] object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate text-gray-900 dark:text-white">
                        {video.title === "영상 없음" ? "관련 영상을 찾을 수 없습니다." : video.title}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {video.channel === "미등록" ? "채널 정보 없음" : `채널: ${video.channel}`}
                      </div>
                    </div>
                    {video.videoUrl !== "#" && (
                      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </a>
                    )}
                  </div>
                )}
                {/* {video && (
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    {video.thumbnail && (
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-20 h-15 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{video.title}</div>
                      <div className="text-xs text-muted-foreground truncate">채널: {video.channel}</div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                )} */}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* 활동 추천 */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 text-green-600" />
            추천 활동
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {record.recommendedActions?.map((action, index) => (
              <li key={action.actingNumber} className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-400">{index + 1}.</span>
                <span className="text-gray-900 dark:text-white">{action.actingName}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 도서 추천 */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-gray-900 dark:text-white">
            <Book className="h-5 w-5 text-purple-600" />
            추천 도서
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {record.recommendedBooks?.map((book, index) => (
              <li key={book.bookNumber} className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-400">{index + 1}.</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{book.bookName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{book.bookAuthor}</div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
