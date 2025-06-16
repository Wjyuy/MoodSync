"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Collection } from "@/types/collection"

interface CollectionFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingCollection: Collection | null
  onSubmit: (name: string, description: string, isPublic: boolean, collectionId?: string) => Promise<void>
}

const CollectionFormModal: React.FC<CollectionFormModalProps> = ({ isOpen, onClose, editingCollection, onSubmit }) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  useEffect(() => {
    if (editingCollection) {
      setName(editingCollection.name)
      setDescription(editingCollection.description || "")
      setIsPublic(editingCollection.isPublic)
    } else {
      setName("")
      setDescription("")
      setIsPublic(false)
    }
  }, [editingCollection, isOpen])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(name, description, isPublic, editingCollection?.collectionId)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <form
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-8 w-full max-w-md border border-gray-200 dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          {editingCollection ? "컬렉션 수정" : "새 컬렉션 만들기"}
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            컬렉션 이름 <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 나만의 활동, 음악 플레이리스트 등"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-1">설명</label>
          <textarea
            name="description"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="컬렉션에 대한 설명 (선택)"
          />
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            name="isPublic"
            className="accent-indigo-600 dark:accent-indigo-400"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <label htmlFor="isPublic" className="text-gray-700 dark:text-gray-300">
            공개 컬렉션으로 설정
          </label>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  )
}

export default CollectionFormModal
