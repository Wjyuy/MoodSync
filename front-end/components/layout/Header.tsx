"use client"

import { Heart, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import useAuthStore from "@/store/authStore" // Zustand 스토어 임포트
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const loading = useAuthStore((state) => state.loading) // 스토어에서 로딩 상태 가져오기
  const logoutUser = useAuthStore((state) => state.logoutUser) // 스토어에서 로그아웃 함수 가져오기
  const user = useAuthStore((state) => state.user)
  const isAdmin = useAuthStore((state) => state.isAdmin)
  // const refreshUserInfo = useAuthStore((state) => state.refreshUserInfo)
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  // 컴포넌트 마운트 시 관리자 상태 확인
  // useEffect(() => {
  //   if (isLoggedIn && user) {
  //     const adminStatus = isAdmin()
  //     console.log("Header: 관리자 상태 확인:", {
  //       isLoggedIn,
  //       user,
  //       adminStatus,
  //     })
  //   }
  // }, [isLoggedIn, user, isAdmin])

  // checkAuthStatus는 AppProviders에서 한 번만 호출하여 전역 상태를 초기화합니다
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log("Header: 로그인 상태 변경 감지 - 사용자 정보:", user)
      const adminStatus = isAdmin()
      // console.log("Header: 관리자 상태 확인:", {
      //   isLoggedIn,
      //   user,
      //   adminStatus,
      // })
    }
  }, [isLoggedIn, user])

  const handleLogout = async () => {
    await logoutUser() // Zustand 스토어의 로그아웃 함수 호출
    router.push("/user/login") // 로그인 페이지로 리다이렉트
  }

  // 사용자 정보 새로고침 함수
  // const handleRefreshUserInfo = async () => {
  //   setRefreshing(true)
  //   try {
  //     await refreshUserInfo()
  //     console.log("사용자 정보 새로고침 완료")
  //   } catch (error) {
  //     console.error("사용자 정보 새로고침 실패:", error)
  //   } finally {
  //     setRefreshing(false)
  //   }
  // }

  // 관리자 상태를 실시간으로 확인
  const adminStatus = isLoggedIn ? isAdmin() : false

  if (loading) {
    return (
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-8 h-8 text-pink-500 dark:text-pink-400 transition-colors duration-300" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent transition-all duration-300">
                MoodSync
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                홈
              </Link>
              <Link
                href="/collections/share"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                컬렉션
              </Link>
              <Link
                href="/recordTest2"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                내 기록
              </Link>
              <span className="text-gray-400 dark:text-gray-500">인증 중</span>
              <Link
                href="/settings"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                설정
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-500 dark:text-pink-400 transition-colors duration-300" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent transition-all duration-300">
              <Link href="/">MoodSync</Link>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {/* 관리자 전용 버튼 */}
            {isLoggedIn && adminStatus && (
              <Link
                href="/admin"
                className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-md transition-colors text-sm font-medium shadow-sm"
                title="관리자 대시보드"
              >
                <Shield className="w-4 h-4" />
                관리자
              </Link>
            )}

            {/* 디버깅용 임시 정보 표시 (개발 환경에서 관리자만) */}
            {process.env.NODE_ENV === "development" && isLoggedIn && user && adminStatus && (
              <div className="flex items-center gap-2">
                {/* <div className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  Admin: {adminStatus ? "YES" : "NO"} | userAdmin: {user.userAdmin} | useradmin: {user.useradmin}
                </div> */}
                {/* <button
                  onClick={handleRefreshUserInfo}
                  className="text-xs text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-1 rounded flex items-center gap-1"
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "새로고침 중..." : "정보 새로고침"}
                </button> */}
              </div>
            )}

            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              홈
            </Link>
            <Link
              href="/collections/share"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              컬렉션
            </Link>
            <Link
              href="/recordTest2"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              내 기록
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                로그아웃
              </button>
            ) : (
              <Link
                href="/user/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                로그인
              </Link>
            )}

            <Link
              href="/settings"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              설정
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
