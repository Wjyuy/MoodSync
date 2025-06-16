"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import * as faceapi from "face-api.js"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ScanFace } from "lucide-react"

// TensorFlow.js 코어 및 백엔드 모듈 임포트 추가
import * as tf from "@tensorflow/tfjs-core"
// import "@tensorflow/tfjs-backend-cpu" // CPU 백엔드 임포트
// import "@tensorflow/tfjs-backend-webgl" // WebGL 백엔드 임포트

// 새로 생성한 타입과 유틸리티 함수 임포트
import type { FaceExpressions, CustomMoodScores } from "@/types/emotion"
import { mapEmotionsToMoodSync } from "@/hooks/emotionMapper"

interface FaceEmotionDetectorProps {
  onEmotionDetected: (moodScores: CustomMoodScores | null) => void
}

export default function FaceEmotionDetector({ onEmotionDetected }: FaceEmotionDetectorProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [loadingModels, setLoadingModels] = useState<boolean>(true)
  const [mappedMoods, setMappedMoods] = useState<CustomMoodScores | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  // 초기값을 false로 설정하여 '맞춤형 추천을 받아보세요' 카드와 유사한 UI가 먼저 보이도록 합니다.
  const [showUpload, setShowUpload] = useState(false)

  const MODEL_URL = "/models" // public/models 폴더 경로

  // 모델 로드 및 TensorFlow.js 백엔드 초기화
  useEffect(() => {
    const loadModels = async () => {
      try {
        // TensorFlow.js 백엔드 초기화 시도 (WebGL 먼저 시도, 실패 시 CPU 전환)
        try {
          await tf.setBackend("webgl") // WebGL 백엔드를 명시적으로 설정
          await tf.ready() // 백엔드가 준비될 때까지 기다림
          console.log("TensorFlow.js 백엔드 (WebGL) 초기화 성공.")
        } catch (backendError) {
          // WebGL 초기화 실패 시 CPU 백엔드를 시도
          console.warn("WebGL 백엔드 초기화 실패, CPU 백엔드로 전환 시도:", backendError)
          await tf.setBackend("cpu") // CPU 백엔드로 설정
          await tf.ready() // CPU 백엔드가 준비될 때까지 기다림
          console.log("TensorFlow.js 백엔드 (CPU) 초기화 성공 (대체 모드).")
          setErrorMessage("WebGL을 사용할 수 없어 CPU 모드로 실행됩니다. 분석 속도가 저하될 수 있습니다.")
        }

        // 백엔드가 성공적으로 초기화된 후에 face-api.js 모델 로드
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        setLoadingModels(false)
        console.log("Face-API models loaded successfully!")
      } catch (error) {
        console.error("Failed to load face-api models or initialize TensorFlow.js backend:", error)
        setErrorMessage("얼굴 인식 모델 또는 TensorFlow.js 백엔드를 로드하는 데 실패했습니다. 콘솔을 확인해주세요.")
        setLoadingModels(false) // 로딩 상태 해제
      }
    }
    loadModels()
  }, []) // 빈 배열로 한 번만 실행되도록 설정

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setErrorMessage(null) // 에러 메시지 초기화
      setMappedMoods(null) // 이전 감정 결과 초기화
      setShowResult(false) // 결과 카드도 숨김
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 얼굴 감지 및 감정 판별
  const detectFaceAndEmotion = async () => {
    // 모델 로딩 중이거나 이미지가 없으면 분석을 시작하지 않음
    if (!imageRef.current || loadingModels) {
      // 이미지 소스가 없는데 분석을 시도하면 에러 메시지를 표시
      if (!imageSrc) {
        setErrorMessage("이미지를 먼저 업로드해주세요.")
      } else if (loadingModels) {
        setErrorMessage("모델 로딩 중입니다. 잠시 후 다시 시도해주세요.")
      }
      return
    }

    setMappedMoods(null) // 새로운 분석 시작 전 결과 초기화
    setErrorMessage(null) // 이전 에러 메시지 초기화

    const displaySize = { width: imageRef.current.width, height: imageRef.current.height }
    // 캔버스 크기를 이미지 크기에 맞춥니다.
    faceapi.matchDimensions(canvasRef.current!, displaySize)

    try {
      const detections = await faceapi
        .detectSingleFace(imageRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()

      if (detections) {
        // 얼굴이 감지되었는지 확인
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const ctx = canvasRef.current!.getContext("2d")
        ctx!.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height) // 기존 그림 지우기
        faceapi.draw.drawDetections(canvasRef.current!, resizedDetections) // 얼굴 주변 사각형 그리기

        // face-api.js의 감정 표현을 가져와 CustomMoodScores로 매핑합니다.
        const expressions: FaceExpressions = resizedDetections.expressions
        const customMoodScores = mapEmotionsToMoodSync(expressions)

        setMappedMoods(customMoodScores) // 매핑된 감정 스코어 상태 업데이트
        onEmotionDetected(customMoodScores) // 부모 컴포넌트로 매핑된 감정 스코어 전달
        setShowResult(true) // 분석 성공 시 결과 카드 자동으로 열림

        console.log("Detected Mood Scores:", customMoodScores)
      } else {
        setErrorMessage("사진에서 사람 얼굴을 찾을 수 없습니다.")
        onEmotionDetected(null)
        setShowResult(false) // 얼굴 없으면 결과 카드 닫음
      }
    } catch (error) {
      console.error("Error during face detection/emotion analysis:", error)
      setErrorMessage("얼굴 분석 중 오류가 발생했습니다. (자세한 내용은 콘솔 확인)")
      onEmotionDetected(null)
      setShowResult(false) // 오류 발생 시 결과 카드 닫음
    }
  }

  // showUpload 상태에 따라 다른 UI 렌더링
  if (!showUpload) {
    // selectedEmotionData가 없으면 항상 Call to Action 카드 표시
    return (
      <div className="w-full h-full flex items-center justify-center text-center">
        <Card
          className="shadow-none border-none cursor-pointer w-full h-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
          onClick={() => setShowUpload(true)}
        >
          <CardContent className="p-8 flex flex-col items-center justify-center h-full">
            <ScanFace className="w-12 h-12 mx-auto mb-4 text-purple-500 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
              얼굴 감정 분석
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
              클릭하여 이미지를 업로드하고 얼굴 감정을 분석해보세요.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <Card className="border-none shadow-none p-6 bg-white dark:bg-gray-900">
        <CardContent className="flex flex-col items-center justify-center p-0">
          <div className="w-full flex justify-start mb-4">
            <button
              onClick={() => setShowUpload(false)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="sr-only">뒤로 가기</span>
            </button>
          </div>

          <>
            {/* 얼굴 감정 분석 UI */}
            <ScanFace className="w-12 h-12 mx-auto mb-4 text-purple-500 dark:text-purple-400" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
              얼굴 감정 분석
            </h3>
            {loadingModels && (
              <p className="text-center text-blue-500 dark:text-blue-400 mb-4 transition-colors duration-300">
                모델 로딩 중...
              </p>
            )}
            {errorMessage && (
              <p className="text-center text-red-500 dark:text-red-400 mb-4 transition-colors duration-300">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col items-center space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loadingModels}
                className="h-13 file:text-blue-600 dark:file:text-blue-400 file:font-semibold file:bg-blue-100 dark:file:bg-blue-900/30 file:border-none file:rounded-md file:py-2 file:px-4 hover:file:bg-blue-200 dark:hover:file:bg-blue-800/50 transition-colors duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />

              <p className="text-md text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
                감정 분석 결과는 얼굴 인식 기술을 기반으로 하며, <br />
                정확도는 이미지 품질과 조명에 따라 달라질 수 있습니다.
              </p>
              {imageSrc && (
                <div className="relative border-2 border-purple-300 dark:border-purple-600 rounded-lg overflow-hidden shadow-md dark:shadow-gray-900/20 transition-colors duration-300">
                  <img
                    ref={imageRef}
                    src={imageSrc || "/placeholder.svg"}
                    alt="Uploaded for analysis"
                    onLoad={detectFaceAndEmotion}
                    className="max-w-full h-auto block object-contain"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0"
                    style={{ display: imageSrc ? "block" : "none" }}
                  />
                </div>
              )}

              {imageSrc && !loadingModels && (
                <Button
                  onClick={detectFaceAndEmotion}
                  className="w-full bg-purple-600 dark:bg-purple-500 text-white py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors duration-300"
                >
                  다시 감정 분석하기
                </Button>
              )}
            </div>
          </>

          {/* 감정 분석 결과 토글 카드 (showUpload 상태와 별개로 표시) */}
          {mappedMoods && (
            <div className="w-full mt-4">
              {/* 여백을 위해 mt-4 추가 */}
              {!showResult ? (
                <div
                  className="text-center cursor-pointer select-none p-4 border border-purple-200 dark:border-purple-700 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:shadow-lg dark:hover:shadow-gray-900/20 transition-all duration-300"
                  onClick={() => setShowResult(true)}
                >
                  <p className="text-lg font-semibold mb-2 text-gray-800 dark:text-white transition-colors duration-300">
                    감지된 무드 (클릭해서 자세히 보기)
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <div className="w-full flex justify-start mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowResult(false)}
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      <span className="sr-only">뒤로 가기</span>
                    </Button>
                  </div>
                  <p className="text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center transition-colors duration-300">
                    감지된 무드 스코어
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {Object.entries(mappedMoods).map(([mood, score]) => (
                      <div
                        key={mood}
                        className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-300"
                      >
                        <span className="font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                          {mood}:
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 font-bold transition-colors duration-300">
                          {score.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
