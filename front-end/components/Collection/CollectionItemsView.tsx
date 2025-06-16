"use client"

import type React from "react"
import type { Collection, CollectionItem } from "@/types/collection"
import { Music, Activity, Book, X } from "lucide-react"
import { Droppable, Draggable } from "@hello-pangea/dnd"

interface CollectionItemsViewProps {
  collection: Collection
  onDeleteItemConfirmed: (collectionId: string, itemId: string) => Promise<void>
  onCloseView?: (collectionId: string) => void
}

const CollectionItemsView: React.FC<CollectionItemsViewProps> = ({
  collection,
  onDeleteItemConfirmed,
  onCloseView,
}) => {
  const handleItemDelete = async (itemId: string) => {
    try {
      await onDeleteItemConfirmed(String(collection.collectionId), itemId)
    } catch (err: any) {
      console.error("CollectionItemsView: 아이템 삭제 중 오류 발생 (부모에서 처리됨):", err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/20 p-6 flex flex-col h-full relative border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      {onCloseView && (
        <button
          onClick={() => onCloseView(String(collection.collectionId))}
          className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full p-1 transition-colors duration-200"
          aria-label="Close collection view"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex justify-between items-center mb-4 pr-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{collection.name}</h2>
        <span
          className={`text-xs px-2 py-1 rounded ${collection.isPublic ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"}`}
        >
          {collection.isPublic ? "공개" : "비공개"}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{collection.description || "설명 없음"}</p>

      <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-600 pb-2 mb-4 text-gray-900 dark:text-white">
        아이템 목록
      </h3>

      <div className="flex-1 overflow-y-auto pr-2">
        <Droppable droppableId={String(collection.collectionId)} type="COLLECTION_ITEM">
          {(provided, snapshot) => (
            <ul
              className={`space-y-3 ${snapshot.isDraggingOver ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {collection.items && collection.items.length > 0 ? (
                collection.items
                  .slice()
                  .sort((a, b) => a.itemOrder - b.itemOrder)
                  .map((item: CollectionItem, index: number) => (
                    <Draggable
                      key={String(item.collectionItemId)}
                      draggableId={String(item.collectionItemId)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                          bg-gray-50 dark:bg-gray-700 p-4 rounded-md flex items-center gap-4 relative border border-gray-200 dark:border-gray-600
                          ${snapshot.isDragging ? "shadow-lg bg-blue-100 dark:bg-blue-900/30" : ""}
                          hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200
                        `}
                        >
                          <span className="flex-shrink-0">
                            {item.contentType === "music" && (
                              <Music className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            )}
                            {item.contentType === "activity" && (
                              <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            )}
                            {item.contentType === "book" && (
                              <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-medium text-gray-800 dark:text-white truncate">
                              {item.contentTitle}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              추가됨: {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleItemDelete(String(item.collectionItemId))
                            }}
                            aria-label={`"${item.contentTitle}" 아이템 삭제`}
                          >
                            &times;
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">이 컬렉션에는 아이템이 없습니다.</p>
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </div>
    </div>
  )
}

export default CollectionItemsView
