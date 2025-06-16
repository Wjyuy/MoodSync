"use client"

import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Music, CheckSquare, Book } from 'lucide-react'

import { useState, useEffect } from "react"
import type { MusicRecommendation, ActivityRecommendation, BookRecommendation } from "@/types"
import { emotions } from "@/data/emotions"

import { addToCollection, addCollectionItemToSelectedCollection } from "@/lib/api/collections"
import MusicRecommendationCard from "@/components/recommendation/MusicRecommendationCard"
import ActivityRecommendationCard from "@/components/recommendation/ActivityRecommendationCard"
import BookRecommendationCard from "@/components/recommendation/BookRecommendationCard"

import { useRouter } from "next/navigation"
import CollectionSelectModal from "@/components/Collection/CollectionSelectModal"
import type { Collection } from "@/types/collection"

interface CollectionItemPayload {
  collectionId: number
  contentType: "music" | "activity" | "book"
  contentTitle: string
  contentDetails: any
}

interface RecommendationListProps {
  musicRecommendations: MusicRecommendation[]
  activityRecommendations: ActivityRecommendation[]
  bookRecommendations: BookRecommendation[]
  recommendationEmotionId: string | null
  recommendationDirty?: boolean
  youtubeVideos?: {
    videoUrl: string
    thumbnail: string
    title: string
    channel: string
  }[]
}

export default function RecommendationList({
  musicRecommendations,
  activityRecommendations,
  bookRecommendations,
  recommendationEmotionId,
  recommendationDirty = false,
  youtubeVideos = [],
}: RecommendationListProps) {
  const [animationKey, setAnimationKey] = useState(0)

  // 추천 결과가 변경될 때마다 애니메이션을 다시 트리거
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [musicRecommendations, activityRecommendations, bookRecommendations])

  const [recommendationType, setRecommendationType] = useState<"music" | "activity" | "book">("music")
  const router = useRouter()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userCollections, setUserCollections] = useState<Collection[]>([])
  const [currentItemToAdd, setCurrentItemToAdd] = useState<
    MusicRecommendation | ActivityRecommendation | BookRecommendation | null
  >(null)
  const [currentItemType, setCurrentItemType] = useState<"music" | "activity" | "book" | null>(null)

  const emotionUsedForDisplay = emotions.find((e) => e.id === recommendationEmotionId)

  if (!emotionUsedForDisplay) {
    return null
  }

  const handleAddToCollection = async (
    item: MusicRecommendation | ActivityRecommendation | BookRecommendation,
    type: "music" | "activity" | "book",
  ) => {
    try {
      const payload = { type, item }
      const collections: Collection[] = await addToCollection(payload)

      setUserCollections(collections)
      setCurrentItemToAdd(item)
      setCurrentItemType(type)
      setIsModalOpen(true)

      console.log("사용자 컬렉션 목록을 성공적으로 불러왔습니다:", collections)
    } catch (error) {
      console.error("컬렉션 목록 조회 중 오류 발생:", error)
      if (error instanceof Error && error.message === "Unauthorized") {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.")
        router.push("/user/login")
      } else {
        alert("컬렉션 목록을 불러오는 데 실패했습니다.")
      }
    }
  }

  const handleConfirmAddToSelectedCollection = async (
    collectionId: number,
    item: MusicRecommendation | ActivityRecommendation | BookRecommendation,
    type: "music" | "activity" | "book",
  ) => {
    try {
      const getItemTitle = (selectedItem: MusicRecommendation | ActivityRecommendation | BookRecommendation) => {
        if ("title" in selectedItem) {
          return selectedItem.title
        } else if ("activity" in selectedItem) {
          return selectedItem.activity
        }
        return "알 수 없는 항목"
      }

      const contentTitle = getItemTitle(item)

      const addPayload: CollectionItemPayload = {
        collectionId: collectionId,
        contentType: type,
        contentTitle: contentTitle,
        contentDetails: item,
      }

      const response = await addCollectionItemToSelectedCollection(addPayload)

      alert(`'${contentTitle}'(을)를 컬렉션에 성공적으로 추가했습니다!`)
      console.log("아이템 컬렉션 추가 응답:", response)

      setIsModalOpen(false)
      setCurrentItemToAdd(null)
      setCurrentItemType(null)
    } catch (error) {
      console.error("컬렉션에 아이템 추가 중 오류 발생:", error)
      if (error instanceof Error && error.message === "Unauthorized") {
        alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.")
        router.push("/user/login")
      } else {
        alert("컬렉션에 아이템 추가에 실패했습니다.")
      }
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center mb-6">
        <div className="mb-8"></div>
        {recommendationDirty ? (
          <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 transition-colors duration-300">
            감정 값이 변경되었습니다! 다시 감정 분석을 해주세요!
          </Badge>
        ) : (
          <Badge
            className={`${emotionUsedForDisplay.color} transition-colors duration-300 dark:bg-gray-600 dark:text-gray-200`}
          >
            추천 기준 감정: {emotionUsedForDisplay.name}
          </Badge>
        )}
      </div>

      <Tabs
        value={recommendationType}
        onValueChange={(value) => setRecommendationType(value as "music" | "activity" | "book")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-muted dark:bg-gray-700 transition-colors duration-300">
          <TabsTrigger
            value="music"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <Music className="w-4 h-4" />
            음악 추천
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <CheckSquare className="w-4 h-4" />
            활동 추천
          </TabsTrigger>
          <TabsTrigger
            value="book"
            className="flex items-center gap-2 data-[state=active]:bg-background dark:data-[state=active]:bg-gray-600 transition-colors duration-300"
          >
            <Book className="w-4 h-4" />
            도서 추천
          </TabsTrigger>
        </TabsList>

        <TabsContent value="music" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {musicRecommendations.map((music, index) => (
              <MusicRecommendationCard
                key={`music-${animationKey}-${index}`}
                music={music}
                onAddToCollection={handleAddToCollection}
                youtubeVideos={youtubeVideos[index] ? [youtubeVideos[index]] : []}
                animationDelay={index * 50}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activityRecommendations.map((activity, index) => (
              <ActivityRecommendationCard
                key={`activity-${animationKey}-${index}`}
                activity={activity}
                onAddToCollection={handleAddToCollection}
                animationDelay={index * 50}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="book" className="mt-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookRecommendations.map((book, index) => (
              <BookRecommendationCard
                key={`book-${animationKey}-${index}`}
                book={book}
                onAddToCollection={handleAddToCollection}
                animationDelay={index * 50}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <CollectionSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collections={userCollections}
        itemToAdd={currentItemToAdd}
        itemType={currentItemType}
        onSelectCollection={handleConfirmAddToSelectedCollection}
      />
    </div>
  )
}
