"use client"

import { Heart } from "lucide-react" // 필요한 아이콘만 임포트
import Link from "next/link" // Link 컴포넌트 사용 시 임포트
import { useState } from "react"
import { PrivacyModal } from "../modals/PrivacyModal"
import { TermsModal } from "../modals/TermsModal"
import { AboutModal } from "../modals/AboutModal"

export default function Footer() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  const handleModalOpen = (modalType: string) => {
    setOpenModal(modalType)
  }

  const handleModalClose = () => {
    setOpenModal(null)
  }
  return (
    <>
      <footer className="z-20 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
                <span className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300">
                  MoodSync
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                감정에 맞는 음악과 활동을 추천하여{" "}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
                더 나은 하루를 만들어갑니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
                서비스
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="transition-colors duration-300">음악 추천</li>
                <li className="transition-colors duration-300">활동 추천</li>
                <li className="transition-colors duration-300">감정 기록</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">지원</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    도움말
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link
                    href="/feedback"
                    className="hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    피드백
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">정보</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => handleModalOpen("privacy")}
                    className="hover:text-gray-900 dark:hover:text-white text-left transition-colors duration-300"
                  >
                    개인정보처리방침
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleModalOpen("terms")}
                    className="hover:text-gray-900 dark:hover:text-white text-left transition-colors duration-300"
                  >
                    이용약관
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleModalOpen("about")}
                    className="hover:text-gray-900 dark:hover:text-white text-left transition-colors duration-300"
                  >
                    회사소개
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
            <p>&copy; 2025 MoodSync. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Modals */}
      <PrivacyModal isOpen={openModal === "privacy"} onClose={handleModalClose} />
      <TermsModal isOpen={openModal === "terms"} onClose={handleModalClose} />
      <AboutModal isOpen={openModal === "about"} onClose={handleModalClose} />
    </>
  )
}
