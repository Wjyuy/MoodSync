"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Collection, CollectionItem } from "@/types/collection"
import { Music, Activity, Book } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"

interface CollectionDetailModalProps {
  isOpen: boolean
  onClose: (updatedCollection?: Collection) => void
  collection: Collection | null
  onDeleteItem?: (collectionId: string, itemId: string) => Promise<void>
  onReorderItems?: (collectionId: string, newItems: CollectionItem[]) => Promise<void>
  onCopyCollection?: (collection: Collection) => Promise<void>
}

const CollectionDetailModal: React.FC<CollectionDetailModalProps> = ({
  isOpen,
  onClose,
  collection,
  onDeleteItem,
  onReorderItems,
  onCopyCollection,
}) => {
  const [items, setItems] = useState<CollectionItem[]>([])
  const [isChanged, setIsChanged] = useState(false)
  const [isCopying, setIsCopying] = useState(false)

  useEffect(() => {
    if (collection?.items) {
      setItems(collection.items.slice().sort((a, b) => a.itemOrder - b.itemOrder))
      setIsChanged(false)

      console.log(
        "Collection items with IDs:",
        collection.items.map((item) => item.collectionItemId),
      )
      const ids = collection.items.map((item) => item.collectionItemId)
      const uniqueIds = new Set(ids)
      if (ids.length !== uniqueIds.size) {
        console.error(
          "Warning: Duplicate collectionItemIds found!",
          ids.filter((e, i, a) => a.indexOf(e) !== i),
        )
      }
    }
  }, [collection])

  if (!isOpen || !collection) return null

  const handleItemDelete = async (itemId: string) => {
    if (onDeleteItem) {
      const collectionIdAsString = String(collection.collectionId)

      try {
        await onDeleteItem(collectionIdAsString, itemId)
        const newItems = items.filter((item) => String(item.collectionItemId) !== itemId)
        setItems(newItems)
        setIsChanged(true)
      } catch (error: any) {
        if (error.message === "Deletion cancelled by user.") {
          console.log("Item deletion cancelled.")
        } else {
          console.error("아이템 삭제 중 오류 발생:", error)
          window.alert("아이템 삭제에 실패했습니다.")
        }
      }
    } else {
      console.warn("onDeleteItem prop이 제공되지 않아 아이템 삭제 기능을 사용할 수 없습니다.")
    }
  }

  const handleCopyMyCollection = async () => {
    if (onCopyCollection && collection) {
      setIsCopying(true)
      try {
        await onCopyCollection(collection)
        onClose()
      } catch (error) {
        console.error("컬렉션 복사 중 오류 발생:", error)
        window.alert("컬렉션 복사에 실패했습니다.")
      } finally {
        setIsCopying(false)
      }
    } else {
      console.warn("onCopyCollection prop이 제공되지 않았거나 collection이 유효하지 않습니다.")
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    if (!onReorderItems) {
      console.warn("순서 변경 기능이 활성화되지 않았습니다.")
      return
    }

    const reorderedItems = Array.from(items)
    const [movedItem] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, movedItem)

    setItems(reorderedItems)
    setIsChanged(true)
  }

  const handleSave = async () => {
    if (!onReorderItems || !collection || !isChanged) {
      onClose()
      return
    }

    const itemsToSave: CollectionItem[] = items.map((item, index) => ({
      ...item,
      itemOrder: index,
    }))

    try {
      await onReorderItems(String(collection.collectionId), itemsToSave)
      setIsChanged(false)

      const updatedCollection: Collection = {
        ...collection,
        items: itemsToSave,
      }
      onClose(updatedCollection)
    } catch (error) {
      console.error("아이템 순서 저장 중 오류 발생:", error)
      window.alert("아이템 순서 저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      if (onReorderItems && isChanged && !window.confirm("저장되지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?")) {
        return
      }
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 pt-0 pb-4 z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{collection.name} 상세 아이템</h2>
            <button
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl leading-none"
              onClick={() => {
                if (
                  onReorderItems &&
                  isChanged &&
                  !window.confirm("저장되지 않은 변경 사항이 있습니다. 정말 닫으시겠습니까?")
                ) {
                  return
                }
                onClose()
              }}
            >
              &times;
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{collection.description || "설명 없음"}</p>

          <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white">
            아이템 목록
            {onReorderItems && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(드래그하여 순서 변경)</span>
            )}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto -mx-8 px-8">
          {items.length > 0 ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="collection-items" isDropDisabled={!onReorderItems}>
                {(provided) => (
                  <ul className="space-y-3 pt-2" {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map((item: CollectionItem, index: number) => (
                      <Draggable
                        key={String(item.collectionItemId)}
                        draggableId={String(item.collectionItemId)}
                        index={index}
                        isDragDisabled={!onReorderItems}
                      >
                        {(provided, snapshot) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...(onReorderItems ? provided.dragHandleProps : {})}
                            className={`
                                                            bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex items-center gap-3 relative border border-gray-200 dark:border-gray-600
                                                            ${snapshot.isDragging ? "shadow-lg bg-blue-100 dark:bg-blue-900/30" : ""}
                                                            ${!onReorderItems ? "cursor-default" : ""}
                                                        `}
                          >
                            <span className="text-xl">
                              {item.contentType === "music" && (
                                <Music className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              )}
                              {item.contentType === "activity" && (
                                <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              )}
                              {item.contentType === "book" && (
                                <Book className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              )}
                            </span>
                            <div className="flex-1">
                              <p className="text-lg font-medium text-gray-900 dark:text-white">{item.contentTitle}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                추가됨: {new Date(item.addedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {onDeleteItem && (
                              <button
                                className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-xl p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (window.confirm(`"${item.contentTitle}" 아이템을 정말 삭제하시겠습니까?`)) {
                                    handleItemDelete(String(item.collectionItemId))
                                  }
                                }}
                                aria-label={`"${item.contentTitle}" 아이템 삭제`}
                              >
                                &times;
                              </button>
                            )}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">이 컬렉션에는 아이템이 없습니다.</p>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 pt-4 pb-0 z-10">
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              이 컬렉션은 {collection.userName || ""}님의 컬렉션입니다.
            </p>
            <div className="flex space-x-2">
              {onReorderItems && onDeleteItem ? (
                <button
                  className={`px-5 py-2 rounded-lg transition-colors ${isChanged ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"}`}
                  onClick={handleSave}
                  disabled={!isChanged}
                >
                  저장
                </button>
              ) : (
                onCopyCollection && (
                  <button
                    className="px-5 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white transition-colors"
                    onClick={handleCopyMyCollection}
                    disabled={isCopying}
                  >
                    {isCopying ? "복사 중..." : "내 컬렉션으로 복사"}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionDetailModal
