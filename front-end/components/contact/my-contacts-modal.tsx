"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react"
import { fetchMyContacts, updateContact, deleteContact, fetchContactAnswer } from "@/lib/api/contact"
import { useToast } from "@/hooks/use-toast"
import type { Contact } from "@/types/contact"

interface MyContactsModalProps {
  isOpen: boolean
  onClose: () => void
}

type ViewMode = "list" | "detail" | "edit"

interface ContactWithStatus extends Contact {
  status?: "답변대기" | "답변완료"
}

interface PaginationInfo {
  currentPage: number
  totalItems: number
  totalPages: number
  pageSize: number
}

interface FetchContactsResponse {
  contacts: Contact[]
  pagination: PaginationInfo
}

interface FetchContactAnswerResponse {
  status: "success" | "error"
  data?: {
    answerContent: string
  }
}

export function MyContactsModal({ isOpen, onClose }: MyContactsModalProps) {
  // const [contacts, setContacts] = useState<Contact[]>([])
  const [contacts, setContacts] = useState<ContactWithStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editForm, setEditForm] = useState({
    contact_title: "",
    contact_content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  })

  // 답변 상태 추가
  const [answer, setAnswer] = useState<string | null>(null)
  const [answerLoading, setAnswerLoading] = useState(false)

  const loadContacts = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetchMyContacts(page, 8)
      // 각 contact에 대해 답변 상태 확인
      const contactsWithStatus = await Promise.all(
        response.contacts.map(async (contact) => {
          try {
            const answerResponse = await fetchContactAnswer(Number(contact.contactId))
            const hasAnswer = answerResponse.status === "success" && answerResponse.data?.answerContent
            return {
              ...contact,
              status: hasAnswer ? ("답변완료" as const) : ("답변대기" as const),
            }
          } catch {
            return {
              ...contact,
              status: "답변대기" as const,
            }
          }
        }),
      )
      // setContacts(response.contacts)
      setContacts(contactsWithStatus)
      setPagination(response.pagination)
      setCurrentPage(page)
    } catch (error) {
      setContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadContacts(1)
      setViewMode("list")
      setSelectedContact(null)
    }
  }, [isOpen])

  // 문의 상세 진입 시 답변 불러오기
  useEffect(() => {
    if (viewMode === "detail" && selectedContact) {
      setAnswerLoading(true)
      fetchContactAnswer(Number(selectedContact.contactId))
        .then((res) => {
          if (res.status === "success" && res.data) {
            setAnswer(res.data.answerContent)
          } else {
            setAnswer(null)
          }
        })
        .catch(() => setAnswer(null))
        .finally(() => setAnswerLoading(false))
    }
  }, [viewMode, selectedContact])

  const handlePrevPage = () => {
    if (pagination.hasPrevious) {
      loadContacts(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNext) {
      loadContacts(currentPage + 1)
    }
  }

  const handleContactClick = async (contact: Contact) => {
    setSelectedContact(contact)
    setViewMode("detail")
    try {
      const answerResponse = await fetchContactAnswer(Number(contact.contactId))
      if (answerResponse.status === "success" && answerResponse.data?.answerContent) {
        setAnswer(answerResponse.data.answerContent)
      } else {
        setAnswer(null)
      }
    } catch (error) {
      setAnswer(null)
    }
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedContact(null)
  }

  const handleEditClick = () => {
    if (selectedContact) {
      setEditForm({
        contact_title: selectedContact.contactTitle,
        contact_content: selectedContact.contactContent,
      })
      setViewMode("edit")
    }
  }

  const handleCancelEdit = () => {
    setViewMode("detail")
    setEditForm({
      contact_title: "",
      contact_content: "",
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedContact) return
    if (!selectedContact.contactId) {
      toast({
        title: "오류",
        description: "문의 ID가 없습니다. 페이지를 새로고침 후 다시 시도해주세요.",
        variant: "destructive",
      })
      return
    }
    if (!editForm.contact_title.trim() || !editForm.contact_content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      const updateParams = {
        contactId: selectedContact.contactId,
        contact_title: editForm.contact_title.trim(),
        contact_content: editForm.contact_content.trim(),
      }
      const response = await updateContact(updateParams)
      if (response.status === "success") {
        toast({
          title: "수정 완료",
          description: "문의가 성공적으로 수정되었습니다.",
        })
        const updatedContact = {
          ...selectedContact,
          contactTitle: editForm.contact_title.trim(),
          contactContent: editForm.contact_content.trim(),
        }
        setSelectedContact(updatedContact)
        setContacts(
          contacts.map((contact) => (contact.contactId === selectedContact.contactId ? updatedContact : contact)),
        )
        setViewMode("detail")
      } else {
        toast({
          title: "수정 실패",
          description: response.message || "문의 수정에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedContact) return
    if (!selectedContact.contactId) {
      toast({
        title: "오류",
        description: "문의 ID가 없습니다. 페이지를 새로고침 후 다시 시도해주세요.",
        variant: "destructive",
      })
      return
    }
    if (!confirm("정말로 이 문의를 삭제하시겠습니까?")) return
    setIsSubmitting(true)
    try {
      const response = await deleteContact({
        contactId: selectedContact.contactId,
      })
      if (response.status === "success") {
        toast({
          title: "삭제 완료",
          description: "문의가 성공적으로 삭제되었습니다.",
        })
        setContacts(contacts.filter((contact) => contact.contactId !== selectedContact.contactId))
        setViewMode("list")
        setSelectedContact(null)
        loadContacts(currentPage)
      } else {
        toast({
          title: "삭제 실패",
          description: response.message || "문의 삭제에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: error instanceof Error ? error.message : "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 정보 없음"
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderListView = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-pink-500" />
          나의 문의 목록
        </DialogTitle>
        <DialogDescription>등록하신 문의 내역을 확인할 수 있습니다.</DialogDescription>
      </DialogHeader>
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
            <span className="ml-2 text-sm text-gray-600">문의 목록을 불러오는 중...</span>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-6">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">등록된 문의가 없습니다.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[350px] pr-2">
              <div className="space-y-1.5">
                {contacts.map((contact, index) => (
                  <div
                    key={contact.contactId}
                    onClick={() => handleContactClick(contact)}
                    className="flex items-center justify-between py-2 px-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Badge variant="outline" className="text-xs px-1.5 py-0 shrink-0 text-gray-500 border-gray-300">
                        {index + 1}
                      </Badge>
                      <h3 className="font-medium text-gray-900 dark:text-white truncate text-sm max-w-[80%]">
                        {contact.contactTitle}
                      </h3>
                      {/* 상태 배지 추가 */}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 shrink-0 ${contact.status === "답변완료"
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300"
                        }`}
                    >
                      {contact.status || "답변대기"}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500 shrink-0 ml-2">
                      <Calendar className="h-3 w-3 mr-1" />
                      {contact.createdDate}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  총 {pagination.totalCount}개 중 {(currentPage - 1) * pagination.pageSize + 1}~
                  {Math.min(currentPage * pagination.pageSize, pagination.totalCount)}개 표시
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={!pagination.hasPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                    이전
                  </Button>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {currentPage} / {pagination.totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!pagination.hasNext}>
                    다음
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )

  const renderDetailView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleBackToList}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-pink-500" />
            문의 상세
          </DialogTitle>
        </div>
      </DialogHeader>

      {selectedContact && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="h-3 w-3 mr-1" />
                  작성일: {selectedContact.createdDate}
                </div>
              </Badge>
              {/* 상태 배지 추가 */}
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 ${answer
                  ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300"
                  }`}
              >
                {answer ? "답변완료" : "답변대기"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit className="h-4 w-4 mr-1" />
                수정
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                삭제
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-900 dark:text-white">{selectedContact.contactTitle}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">내용</label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedContact.contactContent}
                </p>
              </div>
            </div>

            {/* 답변 영역 추가 */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">답변</label>
              <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-700 rounded-md min-h-[64px]">
                {answerLoading ? (
                  <span className="text-xs text-gray-400">답변을 불러오는 중...</span>
                ) : answer ? (
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{answer}</p>
                ) : (
                  <span className="text-xs text-gray-400">아직 답변이 등록되지 않았습니다.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )

  const renderEditView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-pink-500" />
            문의 수정
          </DialogTitle>
        </div>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">제목 *</label>
          <Input
            value={editForm.contact_title}
            onChange={(e) => setEditForm({ ...editForm, contact_title: e.target.value })}
            placeholder="문의 제목을 입력해주세요"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">내용 *</label>
          <Textarea
            value={editForm.contact_content}
            onChange={(e) => setEditForm({ ...editForm, contact_content: e.target.value })}
            placeholder="문의 내용을 입력해주세요"
            rows={8}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSaveEdit} disabled={isSubmitting} className="flex-1 bg-pink-500 hover:bg-pink-600">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                저장
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
            <X className="w-4 h-4 mr-2" />
            취소
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        {viewMode === "list" && renderListView()}
        {viewMode === "detail" && renderDetailView()}
        {viewMode === "edit" && renderEditView()}
      </DialogContent>
    </Dialog>
  )
}
