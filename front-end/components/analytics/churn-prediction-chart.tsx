"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Loader2, AlertTriangle, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { moodsyncTheme } from "@/lib/theme-config"

interface ChurnPredictionChartProps {
  onAnalysisClick?: () => void
}

interface ChartData {
  name: string
  value: number
}

export function ChurnPredictionChart({ onAnalysisClick }: ChurnPredictionChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const COLORS = [moodsyncTheme.error, moodsyncTheme.success]

  const loadChurnData = async () => {
    setLoading(true)
    setError(null)

    try {
      const userData = {
        feedbackScore: 3,
        recommendCount: 15,
        recentActivityCount: 5,
      }

      const response = await fetch("http://localhost:4000/predict-churn-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch churn analytics")
      }

      const result = await response.json()
      const chartData = [
        { name: "이탈 위험", value: result.churnProbability * 100 },
        { name: "유지 예상", value: (1 - result.churnProbability) * 100 },
      ]
      setData(chartData)
    } catch (error) {
      console.error("Failed to load churn analytics:", error)
      setError("이탈 예측 데이터를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChurnData()
  }, [])

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number
    cy: number
    midAngle: number
    innerRadius: number
    outerRadius: number
    percent: number
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card className="overflow-hidden w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <TrendingDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </div>
            사용자 이탈 예측
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            머신러닝 기반 사용자 이탈 위험도 분석 · AI 예측 모델
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onAnalysisClick) onAnalysisClick()
            loadChurnData()
          }}
          disabled={loading}
          className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          분석 실행
        </Button>
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
            <span className="ml-4 text-lg font-medium text-gray-600 dark:text-gray-400">이탈 예측 분석 중...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={loadChurnData}
              className="mt-3 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              다시 시도
            </Button>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-500 dark:text-gray-400">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium">이탈 예측 데이터가 없습니다</p>
            <p className="text-sm mt-1">분석을 실행해 주세요</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {data.map((item, index) => (
                <div
                  key={item.name}
                  className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.name}</p>
                      <p className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                        {item.value.toFixed(1)}%
                      </p>
                    </div>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
              <div className="h-[350px] w-full">
                <ChartContainer
                  config={{
                    value: {
                      label: "이탈 예측",
                      color: moodsyncTheme.chart.accent,
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#fff"
                        strokeWidth={3}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
                        contentStyle={{
                          backgroundColor: "rgba(31, 41, 55, 0.95)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "12px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          fontFamily: "'Pretendard', sans-serif",
                          color: "#ffffff",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{
                          fontFamily: "'Pretendard', sans-serif",
                          fontSize: "14px",
                          color: "inherit",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
