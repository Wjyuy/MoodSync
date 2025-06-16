"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, Calendar, User, Send, Loader2 } from "lucide-react"
import { fetchContacts } from "@/lib/api/contact"
import { addContactReply } from "@/lib/api/admin"
import { useToast } from "@/hooks/use-toast"

interface Contact {
  contactId: number
  userNumber: number
  userName: string
  contactTitle: string
  contactContent: string
  createdDate?: string
}

export function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [reply, setReply] = useState("")
  const [isReplying, setIsReplying] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  })
  const { toast } = useToast()

  const loadContacts = async (page = 1) => {
    setLoading(true)
    try {
      const response = await fetchContacts(page, 7)
      setContacts(response.contacts)
      setPagination({
        totalPages: response.pagination.totalPages,
        hasNext: response.pagination.hasNext,
        hasPrevious: response.pagination.hasPrevious,
      })
      setCurrentPage(page)
    } catch (error) {
      console.error("Failed to load contacts:", error)
      toast({
        title: "오류",
        description: "문의 목록을 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact)
    setReply("")
  }

  const handleReplySubmit = async () => {
    if (!selectedContact || !reply.trim()) return

    setIsReplying(true)
    try {
      const response = await addContactReply(selectedContact.contactId, reply.trim())

      if (response.status === "success") {
        toast({
          title: "답변 완료",
          description: "문의에 대한 답변이 성공적으로 등록되었습니다.",
        })
        setSelectedContact(null)
        setReply("")
        loadContacts(currentPage) // 목록 새로고침
      } else {
        toast({
          title: "답변 실패",
          description: response.message || "답변 등록에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Reply submission error:", error)
      toast({
        title: "오류 발생",
        description: "서버 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsReplying(false)
    }
  }

  return (
    <div className="space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen p-6 transition-colors duration-300">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <MessageSquare className="w-5 h-5" />
            문의 관리
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            사용자 문의를 확인하고 답변을 작성할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">문의 목록을 불러오는 중...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">등록된 문의가 없습니다.</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.contactId}
                      onClick={() => handleContactClick(contact)}
                      className="py-2 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-300 bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate flex-1">
                          {contact.contactTitle}
                        </h3>
                      </div>
                      <div className="flex justify-end items-center text-xs text-gray-500 dark:text-gray-400 gap-4">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {contact.userName}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {contact.createdDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  페이지 {currentPage} / {pagination.totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadContacts(currentPage - 1)}
                    disabled={!pagination.hasPrevious}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    이전
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadContacts(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    다음
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">문의 답변</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              문의에 대한 답변을 작성해주세요.
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <h3 className="font-medium mb-2 text-gray-900 dark:text-white">{selectedContact.contactTitle}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedContact.contactContent}
                </p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2 space-x-4">
                  <span>{selectedContact.userName}</span>
                  <span>{selectedContact.createdDate}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">답변 내용</label>
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="문의에 대한 답변을 작성해주세요."
                  rows={6}
                  disabled={isReplying}
                  className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedContact(null)}
              disabled={isReplying}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              취소
            </Button>
            <Button
              onClick={handleReplySubmit}
              disabled={isReplying || !reply.trim()}
              className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              {isReplying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  전송 중...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  답변 보내기
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
