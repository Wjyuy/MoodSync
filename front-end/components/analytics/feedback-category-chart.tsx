"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchFeedbackAnalytics } from "@/lib/api/analytics"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DatePicker } from "@/components/ui/date-picker"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { BarChart3 } from "lucide-react"
import { moodsyncTheme } from "@/lib/theme-config"

export function FeedbackCategoryChart() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchFeedbackAnalytics(date)

        const getCategoryName = (category: string) => {
          const categoryMap: Record<string, string> = {
            UI: "UI/UX",
            PERFORMANCE: "성능",
            FEATURE: "기능",
            BUG: "버그",
            OTHER: "기타",
          }
          return categoryMap[category] || category
        }

        const chartData = response.map((item: any) => ({
          category: getCategoryName(item.feedback_category),
          count: Number(item.count),
          score: Number(item.avg_score).toFixed(1),
        }))

        setData(chartData)
      } catch (error) {
        console.error("Failed to load feedback analytics:", error)
        setError("카테고리별 피드백 데이터를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [date])

  const displayDate = date || new Date()

  const topCategories = data.sort((a, b) => b.count - a.count).slice(0, 4)

  return (
    <Card className="overflow-hidden w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <BarChart3 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            카테고리별 피드백
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            피드백 카테고리별 분포 현황 · {format(displayDate, "yyyy년 MM월 dd일", { locale: ko })} 기준
          </CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <DatePicker date={date} onDateChange={setDate} placeholder="날짜 선택" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[350px]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 dark:border-indigo-800"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent absolute top-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-400">피드백 데이터 분석 중...</span>
          </div>
        ) : error ? (
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
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm mt-1">다른 날짜를 선택해 주세요</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {topCategories.map((category) => (
                <div
                  key={category.category}
                  className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{category.category}</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{category.count}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">평점 {category.score}/5</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="h-[350px] w-full">
                <ChartContainer
                  config={{
                    count: {
                      label: "피드백 수",
                      color: moodsyncTheme.chart.secondary,
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
                      <XAxis
                        dataKey="category"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{
                          fontSize: 12,
                          fontFamily: "'Pretendard', sans-serif",
                          fontWeight: "bold",
                          fill: "currentColor",
                        }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tick={{
                          fontSize: 12,
                          fontFamily: "'Pretendard', sans-serif",
                          fill: "currentColor",
                        }}
                      />
                      <ChartTooltip
                        cursor={{ fill: "rgba(156, 163, 175, 0.1)" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-xl border bg-white dark:bg-gray-800 p-4 shadow-lg border-gray-200 dark:border-gray-600">
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                                      {payload[0].payload.category}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">피드백 수:</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">
                                      {payload[0].value}건
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">평균 점수:</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">
                                      {payload[0].payload.score}/5
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="count" fill={moodsyncTheme.chart.secondary} radius={[6, 6, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                주요 인사이트
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {data.reduce((acc, item) => acc + item.count, 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 피드백 수</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {data.length > 0 ? Math.max(...data.map((item) => item.count)) : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">최다 피드백</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {data.length > 0
                      ? (data.reduce((acc, item) => acc + Number.parseFloat(item.score), 0) / data.length).toFixed(1)
                      : "0.0"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">전체 평균 점수</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
