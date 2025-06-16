"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Calendar, User, Loader2 } from "lucide-react"
import { fetchAllFeedbacks } from "@/lib/api/feedback"
import { useToast } from "@/hooks/use-toast"

interface Feedback {
  feedbackId: number
  userNumber: number
  userName: string
  feedbackCategory: string
  feedbackScore: number
  feedbackContent: string
  createdDate: string
}

// 피드백 카테고리 타입 정의
type FeedbackCategory =
  | "음악 추천 기능"
  | "활동 추천 기능"
  | "사용자 인터페이스"
  | "성능 및 속도"
  | "새로운 기능 제안"
  | "기타"

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  })
  const { toast } = useToast()

  const loadFeedbacks = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetchAllFeedbacks(page, 4)
      setFeedbacks(response.feedbacks)
      setPagination({
        totalPages: response.pagination.totalPages,
        hasNext: response.pagination.hasNext,
        hasPrevious: response.pagination.hasPrevious,
      })
      setCurrentPage(page)
    } catch (error) {
      console.error("Failed to load feedbacks:", error)
      toast({
        title: "오류",
        description: "피드백 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbacks()
  }, [])

  const getCategoryColor = (category: string): string => {
    const colors: Record<FeedbackCategory, string> = {
      "음악 추천 기능": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
      "활동 추천 기능": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
      "사용자 인터페이스": "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
      "성능 및 속도": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
      "새로운 기능 제안": "bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300",
      기타: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300",
    }

    // 타입 가드를 사용하여 안전하게 접근
    if (category in colors) {
      return colors[category as FeedbackCategory]
    }

    // 기본값 반환
    return colors["기타"]
  }

  const renderStars = (score: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= score ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}`}
          />
        ))}
      </div>
    )
  }

  // 날짜 포매팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date
      .toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\./g, "-")
      .replace(/\s/g, " ")
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-300">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Star className="w-5 h-5" />
            피드백 관리
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            사용자가 제출한 피드백을 확인하고 관리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">피드백 목록을 불러오는 중...</span>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <Star className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">등록된 피드백이 없습니다.</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {feedbacks.map((feedback) => (
                    <div
                      key={feedback.feedbackId}
                      className="py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={getCategoryColor(feedback.feedbackCategory)}>
                            {feedback.feedbackCategory}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {renderStars(feedback.feedbackScore)}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            ({feedback.feedbackScore} / 5)
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                        {feedback.feedbackContent}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {feedback.userName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {feedback.createdDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  페이지 {currentPage} / {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFeedbacks(currentPage - 1)}
                    disabled={!pagination.hasPrevious}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadFeedbacks(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    다음
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
