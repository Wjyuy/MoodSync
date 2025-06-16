"use client"

import { useEffect, useRef } from "react"
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from "chart.js"

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend)

interface WeeklyEmotionChartProps {
  data: {
    dates: string[]
    emotions: {
      happy: number[]
      sad: number[]
      stress: number[]
      calm: number[]
      excited: number[]
      tired: number[]
    }
  }
}

export function WeeklyEmotionChart({ data }: WeeklyEmotionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Detect dark mode
    const isDarkMode = document.documentElement.classList.contains("dark")
    const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    const textColor = isDarkMode ? "#ffffff" : "#374151"

    const colors = {
      happy: { border: "rgb(34, 197, 94)", background: "rgba(34, 197, 94, 0.1)" },
      sad: { border: "rgb(59, 130, 246)", background: "rgba(59, 130, 246, 0.1)" },
      stress: { border: "rgb(239, 68, 68)", background: "rgba(239, 68, 68, 0.1)" },
      calm: { border: "rgb(168, 85, 247)", background: "rgba(168, 85, 247, 0.1)" },
      excited: { border: "rgb(245, 158, 11)", background: "rgba(245, 158, 11, 0.1)" },
      tired: { border: "rgb(107, 114, 128)", background: "rgba(107, 114, 128, 0.1)" },
    }

    const emotionLabels = {
      happy: "행복",
      sad: "슬픔",
      stress: "스트레스",
      calm: "평온함",
      excited: "신남",
      tired: "피곤함",
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.dates.map((date) => {
          const d = new Date(date)
          return `${d.getMonth() + 1}/${d.getDate()}`
        }),
        datasets: Object.entries(data.emotions).map(([emotion, values]) => ({
          label: emotionLabels[emotion as keyof typeof emotionLabels],
          data: values,
          borderColor: colors[emotion as keyof typeof colors].border,
          backgroundColor: colors[emotion as keyof typeof colors].background,
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
          x: {
            ticks: {
              color: textColor,
            },
            grid: {
              color: gridColor,
            },
          },
        },
        plugins: {
          legend: {
            position: "top",
            labels: {
              color: textColor,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
          },
        },
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="w-full h-96">
      <canvas ref={chartRef} />
    </div>
  )
}
