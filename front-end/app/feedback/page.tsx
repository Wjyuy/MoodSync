"use client"

import type React from "react"

import { Heart, Star, ThumbsUp, MessageSquare, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { SuccessModal } from "@/components/feedback/success-modal"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createFeedback } from "@/lib/api/feedback"

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    category: "",
    rating: 0,
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const categories = [
    "음악 추천 기능",
    "활동 추천 기능",
    "사용자 인터페이스",
    "성능 및 속도",
    "새로운 기능 제안",
    "기타",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 입력값 검증
    if (!formData.category) {
      toast({
        title: "입력 오류",
        description: "피드백 카테고리를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (formData.rating === 0) {
      toast({
        title: "입력 오류",
        description: "만족도를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!formData.message.trim()) {
      toast({
        title: "입력 오류",
        description: "피드백 내용을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createFeedback({
        feedback_category: formData.category,
        feedback_score: formData.rating,
        feedback_content: formData.message.trim(),
      })

      if (response.status === "success") {
        // 폼 초기화
        setFormData({ category: "", rating: 0, message: "" })

        // 성공 모달 표시
        setShowSuccessModal(true)
      } else {
        toast({
          title: "전송 실패",
          description: response.message || "피드백 전송에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Feedback submission error:", error)

      let errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

      // if (error.response?.status === 401) {
      //   errorMessage = "로그인이 필요합니다. 로그인 후 다시 시도해주세요."
      // } else if (error.response?.data?.message) {
      //   errorMessage = error.response.data.message
      // }

      toast({
        title: "오류 발생",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    // 메인 페이지로 이동
    router.push("/")
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRating = (rating: number) => {
    setFormData({
      ...formData,
      rating,
    })
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                피드백
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
              MoodSync를 더 나은 서비스로 만들기 위해 여러분의 소중한 의견을 들려주세요
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feedback Info */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white transition-colors duration-300">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  피드백이 중요한 이유
                </h2>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <p>• 사용자 경험 개선에 직접적으로 반영됩니다</p>
                  <p>• 새로운 기능 개발의 우선순위를 결정합니다</p>
                  <p>• 버그 수정과 성능 최적화에 도움이 됩니다</p>
                  <p>• 더 나은 MoodSync를 만드는 원동력입니다</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800/30 transition-colors duration-300">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2 transition-colors duration-300">
                  <MessageSquare className="w-4 h-4" />
                  피드백 작성 가이드
                </h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 transition-colors duration-300">
                  <li>• 구체적인 상황과 예시를 포함해주세요</li>
                  <li>• 개선되었으면 하는 점을 명확히 해주세요</li>
                  <li>• 긍정적인 부분도 함께 알려주세요</li>
                  <li>• 새로운 아이디어나 제안도 환영합니다</li>
                </ul>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
                  피드백 양식
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                    >
                      피드백 카테고리 *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">카테고리를 선택해주세요</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                      전체적인 만족도 *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRating(star)}
                          disabled={isSubmitting}
                          className={`p-1 rounded transition-colors disabled:cursor-not-allowed ${
                            star <= formData.rating
                              ? "text-yellow-400"
                              : "text-gray-300 dark:text-gray-600 hover:text-yellow-300 disabled:hover:text-gray-300 dark:disabled:hover:text-gray-600"
                          }`}
                        >
                          <Star className="w-6 h-6 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        {formData.rating > 0 && `${formData.rating}/5`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                    >
                      피드백 내용 *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="MoodSync에 대한 솔직한 의견을 자유롭게 작성해주세요. 좋았던 점, 개선이 필요한 점, 새로운 아이디어 등 무엇이든 환영합니다."
                      rows={6}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        전송 중...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        피드백 보내기
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="피드백 전송 완료"
        description="소중한 피드백을 보내주셔서 감사합니다! 서비스 개선에 적극 반영하겠습니다."
      />
    </>
  )
}
