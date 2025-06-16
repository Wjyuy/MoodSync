"use client"

import { useState, useEffect, useRef } from "react"

import ImageSlider from "@/components/ImageSlider"
import EmotionSelection from "@/components/EmotionSelection"
import RecommendationList from "@/components/recommendation/RecommendationList"
import EmotionSliderCard from "@/components/EmotionSliderCard"
import FaceEmotionDetector from "@/components/FaceEmotionDetector"
import type { CustomMoodScores } from "@/types/emotion"
import type { RecommendationResult } from "@/types/index"
import type { YoutubeVideo } from "@/lib/mypage/mypage-types"

// 데이터 임포트 경로
import { emotions } from "@/data/emotions"
// import { musicRecommendations } from "@/data/musicRecommendations"; // 현재 사용되지 않음
// import { activityRecommendations } from "@/data/activityRecommendations"; // 현재 사용되지 않음

// import { Input } from "@/components/ui/input"; // 현재 사용되지 않음

export default function HomePage() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const selectedEmotionData = emotions.find((e) => e.id === selectedEmotion)
  const [emotionValues, setEmotionValues] = useState<Record<string, number>>({
    happy: 0,
    sad: 0,
    stress: 0,
    calm: 0,
    excited: 0,
    tired: 0,
  })
  const [searchValue, setSearchValue] = useState<string>("")

  const [emotionSliderValues, setEmotionSliderValues] = useState<Record<string, number>>({})
  const [sliderControlledEmotion, setSliderControlledEmotion] = useState<string | null>(null)

  const [latestDetectedMoods, setLatestDetectedMoods] = useState<CustomMoodScores | null>(null)

  // ✨ recommendationResult 타입에 `recommendationEmotionId` 필드를 추가하여,
  // 이 추천 결과가 어떤 감정을 기반으로 생성되었는지 기록합니다.
  // 그리고 map 타입은 이제 각 추천 목록에 직접 들어가지 않고, RecommendationResult 안에서 통합됩니다.
  const [recommendationResult, setRecommendationResult] = useState<
    | (Omit<RecommendationResult, "musicRecommendations" | "activityRecommendations" | "bookRecommendations"> & {
        musicRecommendations: RecommendationResult["musicRecommendations"][string] // 특정 감정에 대한 배열만 받음
        activityRecommendations: RecommendationResult["activityRecommendations"][string] // 특정 감정에 대한 배열만 받음
        bookRecommendations: RecommendationResult["bookRecommendations"][string] // 특정 감정에 대한 배열만 받음
        recommendationEmotionId: string | null
      })
    | null
  >(null)

  const [recommendationDirty, setRecommendationDirty] = useState(false)

  // --- 팝업 관련 상태 및 Ref 추가 ---
  const emotionSelectionRef = useRef<HTMLDivElement>(null)
  const [showFloatingEmotionSelection, setShowFloatingEmotionSelection] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    if (!emotionSelectionRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // `entry.boundingClientRect.top`은 현재 뷰포트 상단 기준 요소의 위치를 나타냅니다.
        // 이 값이 음수이면서 요소가 뷰포트 밖으로 나갔을 때 (isIntersecting: false)만 팝업을 보여줍니다.
        // 즉, 스크롤을 "아래로" 내려서 요소가 화면 위로 사라질 때만 팝업이 나타나게 됩니다.
        // `entry.boundingClientRect.top < 0` 조건은 스크롤이 아래로 내려갔을 때 요소를 지나친 경우를 의미합니다.
        const isScrollingDownAndOutOfView = !entry.isIntersecting && entry.boundingClientRect.top < 0

        // 스크롤 방향 감지 (선택 사항: 더 정확한 제어를 위해)
        // const currentScrollY = window.scrollY;
        // const isScrollingDown = currentScrollY > lastScrollY.current;
        // lastScrollY.current = currentScrollY;

        // setShowFloatingEmotionSelection(isScrollingDownAndOutOfView && isScrollingDown);
        // ✨ 더 간결하게, 단순히 요소가 위로 사라졌을 때만 팝업을 띄웁니다.
        setShowFloatingEmotionSelection(isScrollingDownAndOutOfView)
      },
      {
        root: null, // 뷰포트
        rootMargin: "-100px 0px 0px 0px",
        threshold: 0,
      },
    )

    observer.observe(emotionSelectionRef.current)

    return () => {
      if (emotionSelectionRef.current) {
        observer.unobserve(emotionSelectionRef.current)
      }
    }
  }, [])

  const handleSliderValueChange = (value: number, emotionId: string | null) => {
    if (emotionId) {
      setEmotionSliderValues((prev) => ({ ...prev, [emotionId]: value }))
      setSelectedEmotion(emotionId)
      setSliderControlledEmotion(emotionId)
      setRecommendationDirty(true) // 슬라이더 값 변경 시 dirty
    }
  }

  const handleEmotionDetected = (moodScores: CustomMoodScores | null) => {
    setLatestDetectedMoods(moodScores)
    if (moodScores) {
      const moodKeyToId: Record<string, string> = {
        행복: "happy",
        슬픔: "sad",
        스트레스: "stressed",
        평온: "calm",
        신남: "excited",
        피곤함: "tired",
      }
      const newSliderValues: Record<string, number> = { ...emotionSliderValues }

      Object.entries(moodScores).forEach(([moodKey, score]) => {
        const id = moodKeyToId[moodKey]
        if (id) newSliderValues[id] = Math.round(score)
      })

      setEmotionSliderValues(newSliderValues)
      const maxEntry = Object.entries(moodScores).reduce((max, cur) => (cur[1] > max[1] ? cur : max), ["", 0])
      if (moodKeyToId[maxEntry[0]]) {
        setSelectedEmotion(moodKeyToId[maxEntry[0]])
        setSliderControlledEmotion(moodKeyToId[maxEntry[0]])
      }
    }
  }

  const handleEmotionSelectClick = (emotionId: string) => {
    setSelectedEmotion(emotionId)
    setSliderControlledEmotion(null)

    setEmotionSliderValues((prev) => {
      const currentVal = prev[emotionId]
      if (currentVal === undefined || currentVal === 0) {
        return { ...prev, [emotionId]: 50 }
      }
      return prev
    })
  }

  const handleSendEmotion = async () => {
    const emotionKeys = ["happy", "sad", "stressed", "calm", "excited", "tired"] as const
    type EmotionKey = (typeof emotionKeys)[number]

    const normalizedEmotionData: Record<EmotionKey, number> = Object.fromEntries(
      emotionKeys.map((key) => [key, (emotionSliderValues[key] ?? 0) / 100]),
    ) as Record<EmotionKey, number>

    // 가장 높은 감정 id를 찾음
    const maxEmotionId = emotionKeys.reduce((maxKey, key) => {
      return (emotionSliderValues[key] ?? 0) > (emotionSliderValues[maxKey] ?? 0) ? key : maxKey
    }, emotionKeys[0])

    console.log("@# normalizedEmotionData =>", normalizedEmotionData)

    try {
      const res = await fetch("/api/sendEmotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedEmotionData),
      })

      const result = await res.json()
      console.log("🎯 추천 결과:", result)

      // 가장 높은 감정 id를 추천 기준으로 사용
      const emotionUsedForRecommendation = maxEmotionId

      setRecommendationResult({
        musicRecommendations: result.music_dtos.map((m: any) => ({
          title: m.musicName,
          artist: m.musicAuthor,
          genre: "알 수 없음",
        })),
        activityRecommendations: result.act_dtos.map((a: any) => ({
          activity: a.actingName,
          type: "일상",
          duration: "30분",
        })),
        bookRecommendations: result.book_dtos.map((b: any) => ({
          title: b.bookName,
          author: b.bookAuthor,
          genre: b.bookGenre ?? "미정",
          description: b.bookDescription ?? "",
        })),
          youtubeVideos: result.youtube_videos.map((v: any) => ({
          title: v.title,
          channel: v.channel,
          thumbnail: v.thumbnail,
          videoUrl: v.videoUrl,
         })),
        recommendationEmotionId: emotionUsedForRecommendation,
      })
      setRecommendationDirty(false) // 추천 요청 시 dirty 해제
    } catch (err) {
      console.error("추천 요청 실패:", err)
      alert("추천 정보를 불러오지 못했습니다. 다시 시도해주세요.")
      setRecommendationResult(null)
    }
  }

  const currentSliderValue = selectedEmotion ? (emotionSliderValues[selectedEmotion] ?? 50) : 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
      <div>
        <ImageSlider />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
              지금 당신의 기분은 어떠신가요?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto transition-colors duration-300">
              현재 감정에 맞는 음악과 활동, 도서를 추천해드립니다. 감정을 선택하고 맞춤형 추천을 받아보세요.
            </p>
          </div>
          <div ref={emotionSelectionRef}>
            <EmotionSelection
              selectedEmotion={selectedEmotion}
              onSelectEmotion={handleEmotionSelectClick}
              emotionValues={emotionSliderValues}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10 w-full">
            <div className="flex flex-col justify-between space-y-6 w-full">
              <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300 shadow-md dark:shadow-gray-900/20">
                <FaceEmotionDetector onEmotionDetected={handleEmotionDetected} />
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-6 w-full">
              <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 dark:shadow-gray-900/20">
                <EmotionSliderCard
                  selectedEmotionData={selectedEmotionData}
                  onEmotionValueChange={handleSliderValueChange}
                  initialEmotionValue={currentSliderValue}
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSendEmotion}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              감정 기반 추천 요청하기
            </button>
          </div>

          {/* Recommendations ✨ 출력 조건 변경 */}
          {/* recommendationResult가 있을 때만 렌더링하며, 현재 UI의 selectedEmotion과는 독립적으로 작동합니다. */}
          {recommendationResult && (
            <RecommendationList
              musicRecommendations={recommendationResult.musicRecommendations}
              activityRecommendations={recommendationResult.activityRecommendations}
              bookRecommendations={recommendationResult.bookRecommendations}
              youtubeVideos={recommendationResult.youtubeVideos} // 추가
              recommendationEmotionId={recommendationResult.recommendationEmotionId}
              recommendationDirty={recommendationDirty}
            />
          )}
        </main>
      </div>
      {showFloatingEmotionSelection && (
        <div
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto
                     opacity-70 hover:opacity-100 transition-all duration-300 pointer-events-none dark:shadow-gray-900/30"
        >
          <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-4 text-center pointer-events-auto transition-colors duration-300">
            현재 감정 선택
          </h4>
          <div className="flex flex-col gap-2 pointer-events-auto">
            {emotions.map((emotion) => (
              <div
                key={`floating-${emotion.id}`}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700
                            ${
                              selectedEmotion === emotion.id
                                ? "bg-purple-100 dark:bg-purple-900/30 ring-1 ring-purple-400 dark:ring-purple-500"
                                : ""
                            }
                `}
                onClick={() => handleEmotionSelectClick(emotion.id)}
              >
                {emotion.icon && (
                  <emotion.icon className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
                )}
                <span className="font-medium text-gray-800 dark:text-gray-200 flex-grow transition-colors duration-300">
                  {emotion.name}
                </span>
                {emotionSliderValues[emotion.id] !== undefined && emotionSliderValues[emotion.id] > 0 && (
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 ml-auto transition-colors duration-300">
                    {emotionSliderValues[emotion.id]}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
