"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare, Star, TrendingUp, Clock } from "lucide-react"
import { fetchContactStats, fetchPendingContactsCount } from "@/lib/api/contact"
import { fetchFeedbackStats } from "@/lib/api/feedback"
import { fetchCohesiveEmotionStats } from "@/lib/api/emotion"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface Stats {
  totalContacts: number
  totalFeedbacks: number
  pendingContacts: number
  averageRating: number
}

interface EmotionCluster {
  mostCohesiveEmotion: string
  mostCohesiveValue: number
}

type EmotionStats = Record<string, EmotionCluster>

import { ContactTimeChart } from "@/components/analytics/contact-time-chart"
import { FeedbackCategoryChart } from "@/components/analytics/feedback-category-chart"
import { ChurnPredictionChart } from "@/components/analytics/churn-prediction-chart"

export function AdminStats() {
  const [emotionStats, setEmotionStats] = useState<EmotionStats>({})
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    totalFeedbacks: 0,
    pendingContacts: 0,
    averageRating: 0,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [emotionLoading, setEmotionLoading] = useState<boolean>(true)
  const [date, setDate] = useState<Date>(new Date())

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [contactStats, feedbackStats, pendingStats] = await Promise.all([
          fetchContactStats(),
          fetchFeedbackStats(),
          fetchPendingContactsCount(),
        ])
        setStats({
          totalContacts: contactStats.totalContacts,
          totalFeedbacks: feedbackStats.totalFeedbacks,
          pendingContacts: pendingStats.pendingContacts,
          averageRating: feedbackStats.averageScore || 0,
        })
      } catch (error) {
        console.error("Failed to load main stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  useEffect(() => {
    const loadEmotionStats = async () => {
      setEmotionLoading(true)
      try {
        const formattedDate = format(date, "yyyyMMdd")
        const emotionStatsData: EmotionStats = await fetchCohesiveEmotionStats(formattedDate)
        setEmotionStats(emotionStatsData)
      } catch (error) {
        console.error("Failed to load emotion stats:", error)
        setEmotionStats({})
      } finally {
        setEmotionLoading(false)
      }
    }

    loadEmotionStats()
  }, [date])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const emotions = Object.keys(emotionStats)
  const mostCohesiveValues = emotions.map((emotion) => emotionStats[emotion]?.mostCohesiveValue ?? 0)
  const mostCohesiveEmotions = emotions.map((emotion) => emotionStats[emotion]?.mostCohesiveEmotion ?? "")

  const emotionColors: Record<string, string> = {
    기쁨: "rgba(255, 193, 7, 0.7)",
    슬픔: "rgba(3, 169, 244, 0.7)",
    분노: "rgba(244, 67, 54, 0.7)",
    공포: "rgba(156, 39, 176, 0.7)",
    혐오: "rgba(76, 175, 80, 0.7)",
    놀람: "rgba(255, 152, 0, 0.7)",
    중립: "rgba(158, 158, 158, 0.7)",
    default: "rgba(99, 102, 241, 0.7)",
  }
  const backgroundColors = emotions.map((emotion) => emotionColors[emotion] ?? emotionColors.default)

  const data = {
    labels: emotions,
    datasets: [
      {
        label: "응집도 값",
        data: mostCohesiveValues,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors.map((color) => color.replace("0.7", "1")),
        borderWidth: 2,
        tension: 0.3, // 곡선 표현 강도
        pointRadius: 8, // 포인트 크기
        pointHoverRadius: 10, // 마우스 올렸을 때 더 크게
        pointBackgroundColor: backgroundColors,
        pointBorderColor: "#fff",
      },
    ],
  }

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  const textColor = isDarkMode ? "#ffffff" : "#374151"
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 14,
          },
          color: textColor,
        },
      },
      title: {
        display: true,
        text: "감정별 응집도 분석",
        font: {
          family: "'Pretendard', sans-serif",
          size: 16,
          weight: "bold",
        },
        color: textColor,
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: isDarkMode ? "#ffffff" : "#333",
        bodyColor: isDarkMode ? "#ffffff" : "#333",
        titleFont: {
          family: "'Pretendard', sans-serif",
          size: 20,
        },
        bodyFont: {
          family: "'Pretendard', sans-serif",
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex
            return `${emotions[idx]} 감정 분석`
          },
          label: (context) => {
            const idx = context.dataIndex
            const emotion = emotions[idx]
            const mostCohesiveEmotion = mostCohesiveEmotions[idx]
            const value = mostCohesiveValues[idx].toFixed(2)
            return [`가장 응집된 감정: ${mostCohesiveEmotion}`, `응집도 값: ${value}`]
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
          },
          color: textColor,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
          },
          color: textColor,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    layout: {
      padding: {
        top: 10,
        right: 16,
        bottom: 10,
        left: 16,
      },
    },
  }
  const displayDate = date || new Date()
  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-300">
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">총 문의</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContacts}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">전체 접수된 문의</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">총 피드백</CardTitle>
            <Star className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalFeedbacks}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">사용자 피드백 수</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">대기 중인 문의</CardTitle>
            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingContacts}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">답변 대기 중</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">평균 만족도</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}/5</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">피드백 평균 점수</p>
          </CardContent>
        </Card>
      </div>

      {/* 감정 응집도 시각화 */}
      <Card className="overflow-hidden w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              감정 응집도 인사이트
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
              감정 분석 · {format(displayDate, "yyyy년 MM월 dd일", { locale: ko })} 기준
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DatePicker
              date={date}
              onDateChange={setDate as (date: Date | undefined) => void}
              placeholder="날짜 선택"
            />
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {emotionLoading ? (
            <div className="flex items-center justify-center h-[350px]">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent absolute top-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-400">감정 데이터 분석 중...</span>
            </div>
          ) : emotions.length > 0 ? (
            <div className="space-y-6">
              {/* 상단 메트릭스 카드들 - 6개 고정 */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {["happy", "sad", "tired", "excited", "calm", "stress"].map((emotionName, index) => {
                  const emotionIndex = emotions.findIndex((e) => e === emotionName)
                  const value = emotionIndex >= 0 ? Math.min(mostCohesiveValues[emotionIndex], 100) : 0
                  const color = emotionColors[emotionName] || "#6366f1"

                  return (
                    <div
                      key={emotionName}
                      className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{emotionName}</p>
                          <p className="text-2xl font-bold" style={{ color: color.replace("0.7", "1") }}>
                            {value.toFixed(1)}
                          </p>
                        </div>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color.replace("0.7", "1") }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* 메인 차트 */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <div className="h-[350px] w-full">
                  <Line data={data} options={options} />
                </div>
              </div>

              {/* 하단 인사이트 */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  주요 인사이트
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{emotions.length}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">분석된 감정 유형</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {Math.min(Math.max(...mostCohesiveValues), 100).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">최고 응집도</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                      {Math.min(mostCohesiveValues.reduce((a, b) => a + b, 0) / mostCohesiveValues.length, 100).toFixed(
                        1,
                      )}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">평균 응집도</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-lg font-medium">선택한 날짜에 대한 감정 데이터가 없습니다</p>
              <p className="text-sm mt-1">다른 날짜를 선택해 주세요</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 시간대별 문의 수 - 감정 응집도와 같은 폭으로 길게 */}
      <div className="w-full">
        <ContactTimeChart />
      </div>

      {/* 하단 2개 카드: 좌/우 나란히 배치 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeedbackCategoryChart />
        <ChurnPredictionChart />
      </div>
    </div>
  )
}
