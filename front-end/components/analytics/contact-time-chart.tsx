"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContactAnalytics } from "@/lib/api/analytics"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { DatePicker } from "@/components/ui/date-picker"
import { Clock } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export function ContactTimeChart() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [data, setData] = useState<number[]>([])
  const [labels, setLabels] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchContactAnalytics(date)
        const entries = Object.entries(response).map(([hour, count]) => ({
          hour: `${hour}시`,
          count: Number(count),
        }))
        setLabels(entries.map((e) => e.hour))
        setData(entries.map((e) => e.count))
      } catch (error) {
        console.error("Failed to load contact analytics:", error)
        setError("시간대별 문의 데이터를 불러오는데 실패했습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [date])

  // Detect dark mode for chart styling
  const isDarkMode = typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  const textColor = isDarkMode ? "#ffffff" : "#374151"
  const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.03)"

  const chartData = {
    labels,
    datasets: [
      {
        label: "시간대별 문의 수",
        data,
        fill: false,
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 8,
        pointHoverRadius: 10,
      },
    ],
  }

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: isDarkMode ? "#ffffff" : "#1f2937",
        bodyColor: isDarkMode ? "#ffffff" : "#374151",
        titleFont: {
          family: "'Pretendard', sans-serif",
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          family: "'Pretendard', sans-serif",
          size: 14,
        },
        padding: 16,
        cornerRadius: 12,
        boxPadding: 8,
        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: (context: any) => `문의 수: ${context.raw}건`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
            weight: "bold",
          },
          color: textColor,
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: gridColor,
        },
        ticks: {
          stepSize: 1,
          font: {
            family: "'Pretendard', sans-serif",
            size: 12,
          },
          color: textColor,
          padding: 8,
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutCubic",
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 6,
        hoverRadius: 10,
        borderWidth: 3,
      },
    },
  }

  const displayDate = date || new Date()

  // 상위 4개 시간대 계산
  const topHours = labels
    .map((label, index) => ({ label, value: data[index] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)

  return (
    <Card className="overflow-hidden w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            시간대별 문의 수
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            24시간 기준 문의 접수 현황 · {format(displayDate, "yyyy년 MM월 dd일", { locale: ko })} 기준
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
            <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-400">
              시간대별 데이터 분석 중...
            </span>
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
            {/* 상단 메트릭스 카드들 - 상위 4개 시간대 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {topHours.map((hour) => (
                <div
                  key={hour.label}
                  className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{hour.label}</p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{hour.value}</p>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* 메인 차트 */}
            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="h-[350px] w-full">
                <Line data={chartData} options={chartOptions} />
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
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {data.reduce((a, b) => a + b, 0)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">총 문의 수</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{Math.max(...data)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">최대 문의 수</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1) : "0.0"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">시간당 평균</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
