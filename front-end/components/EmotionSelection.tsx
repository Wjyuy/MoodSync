"use client"

import { Card, CardContent } from "@/components/ui/card"
import { emotions } from "@/data/emotions"

interface EmotionSelectionProps {
  selectedEmotion: string | null
  onSelectEmotion: (emotionId: string) => void
  emotionValues: Record<string, number> // emotionValues prop 추가
}

export default function EmotionSelection({
  selectedEmotion,
  onSelectEmotion,
  emotionValues, // emotionValues prop을 비구조화 할당
}: EmotionSelectionProps) {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {emotions.map((emotion) => (
          <Card
            key={emotion.id}
            className={`cursor-pointer text-center p-4 transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
              selectedEmotion === emotion.id
                ? "ring-2 ring-purple-500 dark:ring-purple-400 shadow-lg"
                : "hover:shadow-md dark:hover:shadow-gray-900/20"
            }`}
            onClick={() => onSelectEmotion(emotion.id)}
          >
            <CardContent className="flex flex-col items-center justify-center p-0">
              {emotion.icon && (
                <emotion.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
              )}
              <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                {emotion.name}
              </h3>
              {/* emotionValues에 따라 조건부 렌더링 */}
              {emotionValues[emotion.id] && emotionValues[emotion.id] > 0 ? (
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 transition-colors duration-300">
                  {emotionValues[emotion.id]}%
                </span>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                  {emotion.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
