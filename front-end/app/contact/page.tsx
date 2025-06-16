"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Heart, Mail, Phone, MapPin, Send, Loader2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { createContact } from "@/lib/api/contact"
import { SuccessModal } from "@/components/contact/success-modal"
import {MyContactsModal} from "@/components/contact/my-contacts-modal"

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    contact_title: "",
    contact_content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showMyContactsModal, setShowMyContactsModal] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.contact_title.trim() || !formData.contact_content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 내용을 모두 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await createContact({
        contact_title: formData.contact_title.trim(),
        contact_content: formData.contact_content.trim(),
      })

      if (response.status === "success") {
        setFormData({ contact_title: "", contact_content: "" })
        // 성공 모달 표시
        setShowSuccessModal(true)
      } else {
        toast({
          title: "전송 실패",
          description: response.message || "문의 전송에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Contact submission error:", error)
      toast({
        title: "오류 발생",
        description: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false)
    // 메인 페이지로 이동
    router.push("/")
  }

  const handleOpenMyContacts = () => {
    setShowMyContactsModal(true)
  }

  const handleCloseMyContacts = () => {
    setShowMyContactsModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
              문의하기
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            MoodSync에 대한 궁금한 점이나 문의사항이 있으시면 언제든지 연락해주세요
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
              <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
                연락처 정보
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                      이메일
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      support@moodsync.com
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">
                      전화번호
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      02-1234-5678
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white transition-colors duration-300">주소</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      서울특별시 강남구
                      <br />
                      테헤란로 123, 456호
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-pink-100 dark:border-pink-800/30 transition-colors duration-300">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                빠른 답변을 위한 팁
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 transition-colors duration-300">
                <li>• 구체적인 문제 상황을 설명해주세요</li>
                <li>• 사용 중인 기기와 브라우저를 알려주세요</li>
                <li>• 오류 메시지가 있다면 정확히 기재해주세요</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  문의 양식
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenMyContacts}
                  className="flex items-center gap-2 text-pink-600 border-pink-200 hover:bg-pink-50 dark:text-pink-400 dark:border-pink-800 dark:hover:bg-pink-900/20"
                >
                  <FileText className="w-4 h-4" />
                  나의 문의
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="contact_title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    제목 *
                  </label>
                  <Input
                    id="contact_title"
                    name="contact_title"
                    type="text"
                    required
                    value={formData.contact_title}
                    onChange={handleChange}
                    placeholder="문의 제목을 입력해주세요"
                    disabled={isSubmitting}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact_content"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300"
                  >
                    문의 내용 *
                  </label>
                  <Textarea
                    id="contact_content"
                    name="contact_content"
                    required
                    value={formData.contact_content}
                    onChange={handleChange}
                    placeholder="문의하실 내용을 자세히 작성해주세요"
                    rows={8}
                    disabled={isSubmitting}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      문의하기
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="문의가 등록되었습니다"
        description="문의사항이 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다."
      />

      {/* 나의 문의 모달 */}
      <MyContactsModal isOpen={showMyContactsModal} onClose={handleCloseMyContacts} />
    </div>
  )
}
