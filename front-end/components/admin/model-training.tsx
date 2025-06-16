"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Brain, Play, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { trainModel } from "@/lib/api/admin"
import { useToast } from "@/hooks/use-toast"
import ModelStatusGrid from "@/components/ModelStatusGrid"

export function ModelTraining() {
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "success" | "error">("idle")
  const [lastTrainingTime, setLastTrainingTime] = useState<string | null>(null)
  const { toast } = useToast()
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const trainingStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [])

  const handleStartTraining = async () => {
    if (isTraining) return

    const confirmed = window.confirm(
      "모델 학습을 시작하시겠습니까?\n\n기존 모델 파일들이 삭제되고 새로운 모델이 생성됩니다.\n이 과정은 시간이 오래 걸릴 수 있습니다.",
    )

    if (!confirmed) return

    setIsTraining(true)
    setTrainingStatus("training")
    setProgress(0)
    trainingStartTimeRef.current = Date.now()

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const elapsedMinutes = trainingStartTimeRef.current
          ? (Date.now() - trainingStartTimeRef.current) / (1000 * 60)
          : 0

        let newProgress = 0

        if (elapsedMinutes < 1) {
          newProgress = Math.min(30, prev + Math.random() * 4)
        } else if (elapsedMinutes < 3) {
          newProgress = Math.min(50, prev + Math.random() * 4)
        } else {
          newProgress = Math.min(90, prev + Math.random() * 4)
        }

        return newProgress
      })
    }, 5000)

    try {
      const response = await trainModel()

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setProgress(100)

      if (response.status === "success") {
        setTrainingStatus("success")
        setLastTrainingTime(new Date().toLocaleString("ko-KR"))
        toast({
          title: "학습 완료",
          description: "모델 학습이 성공적으로 완료되었습니다.",
        })
      } else {
        setTrainingStatus("error")
        toast({
          title: "학습 실패",
          description: response.message || "모델 학습 중 오류가 발생했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      setProgress(0)
      setTrainingStatus("error")
      console.error("Training error:", error)
      toast({
        title: "오류 발생",
        description: "모델 학습 중 예상치 못한 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
      trainingStartTimeRef.current = null
    }
  }

  const getStatusIcon = () => {
    switch (trainingStatus) {
      case "training":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500 dark:text-blue-400" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
      case "error":
        return <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
      default:
        return <Brain className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (trainingStatus) {
      case "training":
        return `모델 학습 중... (${Math.round(progress)}%)`
      case "success":
        return "학습 완료"
      case "error":
        return "학습 실패"
      default:
        return lastTrainingTime ? "대기 중 (이전 학습 완료)" : "대기 중"
    }
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-300">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Brain className="w-5 h-5" />
            AI 모델 학습
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            추천 시스템의 AI 모델을 새로운 데이터로 재학습시킵니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current status */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-300">
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{getStatusText()}</p>
                {lastTrainingTime && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">마지막 학습: {lastTrainingTime}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">진행률</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(progress)}%</p>
            </div>
          </div>

          {/* Progress bar - shows during training or when progress exists */}
          {(isTraining || progress > 0) && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              {isTraining ? (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  모델 학습 중... 잠시만 기다려주세요.
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {trainingStatus === "success" ? "학습이 완료되었습니다" : "학습 진행 중"}
                </p>
              )}
            </div>
          )}

          {/* Warning message */}
          <Alert
            variant={trainingStatus === "error" ? "destructive" : "default"}
            className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
          >
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-gray-700 dark:text-gray-300">
              <strong>주의사항:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• 모델 학습은 시간이 오래 걸릴 수 있습니다 (5 ~ 30분)</li>
                <li>• 학습 중에는 추천 기능이 일시적으로 중단될 수 있습니다</li>
                <li>• 기존 모델 파일들이 삭제되고 새로운 모델이 생성됩니다</li>
                <li>• 학습 중에는 페이지를 새로고침하지 마세요</li>
                {trainingStatus === "error" && (
                  <li className="text-red-600 dark:text-red-400">• 오류 발생: 관리자에게 문의하세요</li>
                )}
              </ul>
            </AlertDescription>
          </Alert>

          {/* Model status grid */}
          <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">모델 상태 확인</h1>
          <ModelStatusGrid />

          {/* Start training button */}
          <div className="flex justify-center">
            <Button
              onClick={handleStartTraining}
              disabled={isTraining}
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors duration-300"
            >
              {isTraining ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  학습 중...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {lastTrainingTime ? "모델 재학습 시작" : "모델 학습 시작"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
