"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Collection } from "@/types/collection"
import { Music, Activity, Book, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CollectionCardProps {
  collection: Collection
  onViewDetails: (collectionId: string) => void
  onEdit?: (collection: Collection) => void
  onDelete?: (collectionId: string) => void
  showEditSuccessMessage: boolean
  onEditMessageShown: () => void
  showReorderSuccessMessage: boolean
  onReorderMessageShown: () => void
  showCopySuccessMessage: boolean
  onCopyMessageShown: () => void
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onViewDetails,
  onEdit,
  onDelete,
  showEditSuccessMessage,
  onEditMessageShown,
  showReorderSuccessMessage,
  onReorderMessageShown,
  showCopySuccessMessage,
  onCopyMessageShown,
}) => {
  const [showMessage, setShowMessage] = useState(false)
  const [messageText, setMessageText] = useState("")

  const handleCopyShareLink = () => {
    const shareLink = `${window.location.origin}/collections/share/${collection.collectionId}`
    navigator.clipboard.writeText(shareLink)

    setMessageText("링크가 복사되었습니다!")
    setShowMessage(true)
    const timer = setTimeout(() => {
      setShowMessage(false)
      setMessageText("")
    }, 1500)
    return () => clearTimeout(timer)
  }

  useEffect(() => {
    if (showEditSuccessMessage) {
      setMessageText("컬렉션이 성공적으로 수정되었습니다!")
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
        setMessageText("")
        onEditMessageShown()
      }, 1500)
      return () => clearTimeout(timer)
    } else if (showReorderSuccessMessage) {
      setMessageText("아이템 순서가 성공적으로 저장되었습니다!")
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
        setMessageText("")
        onReorderMessageShown()
      }, 1500)
      return () => clearTimeout(timer)
    } else if (showCopySuccessMessage) {
      setMessageText("컬렉션이 나의 컬렉션으로 복사되었습니다!")
      setShowMessage(true)
      const timer = setTimeout(() => {
        setShowMessage(false)
        setMessageText("")
        onCopyMessageShown()
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [
    showEditSuccessMessage,
    onEditMessageShown,
    showReorderSuccessMessage,
    onReorderMessageShown,
    showCopySuccessMessage,
    onCopyMessageShown,
  ])

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/20 p-6 flex flex-col relative border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <AnimatePresence>
        {showMessage && (
          <motion.span
            key={messageText}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{
              opacity: { duration: 0.3, ease: "easeOut" },
              y: { duration: 0.5, ease: "easeOut" },
            }}
            className="absolute bottom-10 right-20 -translate-x-1/2 mb-2 whitespace-nowrap
                                   bg-gray-800 dark:bg-gray-700 text-white text-xs rounded px-2 py-1
                                   pointer-events-none z-10"
          >
            {messageText}
          </motion.span>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{collection.name}</h2>
        <span
          className={`text-xs px-2 py-1 rounded ${
            collection.isPublic
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          }`}
        >
          {collection.isPublic ? "공개" : "비공개"}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{collection.description}</p>
      <div className="flex-1 min-h-[70px]">
        <div className="flex flex-wrap gap-2">
          {collection.items && collection.items.length > 0 ? (
            <>
              {collection.items.slice(0, 3).map((item) => (
                <div
                  key={item.collectionItemId}
                  className="bg-indigo-50 dark:bg-indigo-900/30 rounded px-2 py-1 text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-1"
                >
                  <span className="font-bold">
                    {item.contentType === "music" && <Music className="w-4 h-4" />}
                    {item.contentType === "activity" && <Activity className="w-4 h-4" />}
                    {item.contentType === "book" && <Book className="w-4 h-4" />}
                  </span>
                  <span>{item.contentTitle}</span>
                </div>
              ))}
              {collection.items.length > 3 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  +{collection.items.length - 3}개 더 있음
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">아이템이 없습니다.</span>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
          onClick={() => onViewDetails(String(collection.collectionId))}
        >
          상세보기
        </button>
        {onEdit && (
          <button
            className="text-gray-500 dark:text-gray-400 hover:underline text-sm"
            onClick={() => onEdit(collection)}
          >
            수정
          </button>
        )}
        {onDelete && (
          <button
            className="text-red-500 dark:text-red-400 hover:underline text-sm"
            onClick={() => onDelete(String(collection.collectionId))}
          >
            삭제
          </button>
        )}
        {collection.isPublic && (
          <div className="ml-auto">
            <button className="text-blue-500 dark:text-blue-400 hover:underline text-sm" onClick={handleCopyShareLink}>
              <Share2 />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CollectionCard
