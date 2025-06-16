"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, SlidersHorizontal } from "lucide-react" // 아이콘 임포트 (Sparkles, ArrowLeft 추가)
import { Slider } from "@/components/ui/slider"
import type { Emotion } from "@/types" // Emotion 타입 임포트

interface EmotionSliderCardProps {
  selectedEmotionData: Emotion | undefined // 선택된 감정 데이터
  onEmotionValueChange: (value: number, emotionId: string | null) => void // 슬라이더 값과 감정 ID 전달
  initialEmotionValue: number // 외부에서 주입되는 값
}

export default function EmotionSliderCard({
  selectedEmotionData,
  onEmotionValueChange,
  initialEmotionValue,
}: EmotionSliderCardProps) {
  // 슬라이더 표시 여부 상태 (초기에는 Call to Action 카드 상태)
  const [showSlider, setShowSlider] = useState<boolean>(false)
  const [emotionValue, setEmotionValue] = useState<number>(initialEmotionValue)

  useEffect(() => {
    setEmotionValue(initialEmotionValue)
  }, [initialEmotionValue]) // initialEmotionValue가 변경될 때마다 실행

  // 선택된 감정이 변경될 때 슬라이더 값을 초기화하거나 특정 값으로 설정합니다.
  useEffect(() => {
    if (selectedEmotionData) {
      setEmotionValue(initialEmotionValue) // 선택된 감정이 있을 때 초기값으로 설정 (예: 50)
      onEmotionValueChange(initialEmotionValue, selectedEmotionData.id) // 초기 감정 값 전달
      setShowSlider(true) // 감정이 선택되면 자동으로 슬라이더를 보여줌
    } else {
      setEmotionValue(0) // 감정이 선택되지 않았을 때 0으로
      onEmotionValueChange(0, null)
      // setShowSlider(false); // 감정이 선택되지 않으면 다시 Call to Action 카드로 돌아가게 할 수도 있습니다.
      // 현재는 항상 Call to Action 카드를 먼저 보여주는 흐름을 유지합니다.
    }
  }, [selectedEmotionData]) // selectedEmotionData.id가 변경될 때마다 실행

  // "맞춤형 추천을 받아보세요" 카드 클릭 핸들러
  const handleCardClick = () => {
    setShowSlider(true) // 카드 클릭 시 슬라이더 표시
  }

  // 슬라이더 값 변경 핸들러
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0]
    setEmotionValue(newValue)
    onEmotionValueChange(newValue, selectedEmotionData?.id || null)
  }

  // 슬라이더에서 "뒤로 가기" 버튼 클릭 핸들러
  const handleBackToCard = () => {
    setShowSlider(false) // 슬라이더 숨기고 Call to Action 카드 표시
    // Optionally, reset selected emotion or slider value when going back.
    // onEmotionValueChange(0, null); // 필요하다면 슬라이더 값 초기화
  }

  // 렌더링할 아이콘 결정
  const CurrentEmotionIcon = selectedEmotionData?.icon || SlidersHorizontal // 감정 아이콘이 없으면 기본 슬라이더 아이콘

  // showSlider 상태에 따라 다른 UI 렌더링
  if (!showSlider || !selectedEmotionData) {
    // selectedEmotionData가 없으면 항상 Call to Action 카드 표시
    // 초기 Call to Action 카드 UI
    return (
      <div className="w-full h-full flex items-center justify-center text-center">
        <Card
          className="w-full h-full shadow-none border-none cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={handleCardClick} // 클릭 이벤트 추가
        >
          <CardContent className="p-8 flex flex-col items-center justify-center h-full">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500 dark:text-purple-400" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
              맞춤형 추천을 받아보세요
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-300">
              클릭하여 슬라이더로 감정 강도를 조절하거나, 위에 있는 이모티콘을 선택하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 슬라이더 UI
  return (
    <div className="w-full h-full flex items-center justify-center text-center">
      <Card className="border-none shadow-none w-full h-full bg-white dark:bg-gray-800 transition-colors duration-300">
        <CardContent className="p-8 flex flex-col items-center justify-center h-full">
          {/* 뒤로가기 버튼의 필요성을 못느껴서 주석 */}
          {/* <div className="w-full flex justify-start mb-4">
            <button
              onClick={handleBackToCard}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-600 dark:text-gray-400 transition-colors duration-300"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="sr-only">뒤로 가기</span>
            </button>
          </div> */}

          {/* 감정 아이콘 또는 기본 슬라이더 아이콘 */}
          <CurrentEmotionIcon
            className={`w-12 h-12 mb-4 transition-colors duration-300
              ${selectedEmotionData ? selectedEmotionData.color.split(" ")[1].replace("text-", "") : "text-blue-500 dark:text-blue-400"}
            `}
          />

          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            {selectedEmotionData ? `${selectedEmotionData.name} 강도` : "감정 강도 조절"}
          </h3>

          <Slider
            value={[emotionValue]}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            className="w-full max-w-xs mb-4 [&_[role=slider]]:bg-white [&_[role=slider]]:dark:bg-gray-700 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:dark:border-purple-400"
            disabled={!selectedEmotionData} // 감정이 선택되지 않으면 슬라이더 비활성화
          />
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6 transition-colors duration-300">
            {emotionValue}%
          </p>
          <p className="text-md text-gray-500 dark:text-gray-400 text-center transition-colors duration-300">
            {selectedEmotionData
              ? `${selectedEmotionData.name}의 강도를 조절하여 맞춤 추천을 받아보세요.`
              : "위에서 감정을 선택하면, 해당 감정의 강도를 조절할 수 있습니다."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
