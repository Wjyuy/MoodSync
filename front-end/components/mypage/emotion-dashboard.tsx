"use client"

import { useEffect, useState, useRef } from "react"
import {
  // getUserRecord,
  getLatestRecords,
  type UserRecord,
} from "@/lib/mypage/mypage-types"
import { Calendar, TrendingUp, BookOpen, BarChart3 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { DailyEmotionView } from "@/components/mypage/daily-emotion-view"
import { WeeklyTrendView } from "@/components/mypage/weekly-trend-view"
import { WeeklyRecommendationsView } from "@/components/mypage/weekly-recommendations-view"

import { useRouter } from "next/navigation"
const menuItems = [
  {
    title: "일별 감정 차트",
    icon: BarChart3,
    id: "daily-emotions",
  },
  {
    title: "주간 감정 추세",
    icon: TrendingUp,
    id: "weekly-trend",
  },
  {
    title: "주간 추천 기록",
    icon: BookOpen,
    id: "weekly-recommendations",
  },
  {
    title: "내 컬렉션으로 이동",
    icon: BookOpen,
    id: "collections",
  },
]

export function EmotionDashboard() {
  const [activeView, setActiveView] = useState("daily-emotions")
  // const [currentRecord, setCurrentRecord] = useState<UserRecord | null>(null)
  const [allRecords, setAllRecords] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const hasFetched = useRef(false)
  const router = useRouter()
  useEffect(() => {
    // 1번만 실행되도록
    if (hasFetched.current) return
    hasFetched.current = true

    async function fetchData() {
      setLoading(true)
      try {
        // const [current, latest] = await Promise.all([
        //   getUserRecord(),
        //   getLatestRecords(),
        // ])
        // setCurrentRecord(current)
        // setAllRecords(latest)
        const latest = await getLatestRecords()
        setAllRecords(latest)
      } catch (error) {
        console.error("데이터 로딩 실패:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleMenuItemClick = (id: string) => {
    if (id === "collections") {
      router.push("/collections") // ⭐ '/collections' 경로로 이동 ⭐
    } else {
      setActiveView(id) // 다른 메뉴 아이템은 기존대로 activeView 상태 변경
    }
  }
  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">데이터 로딩 중...</p>
          </div>
        </div>
      )
    }

    switch (activeView) {
      case "daily-emotions":
        return (
          <DailyEmotionView
            // currentRecord={currentRecord}
            allRecords={allRecords}
          />
        )
      case "weekly-trend":
        return <WeeklyTrendView allRecords={allRecords} />
      case "weekly-recommendations":
        return <WeeklyRecommendationsView allRecords={allRecords} />
      default:
        return <DailyEmotionView /*currentRecord={currentRecord}*/ allRecords={allRecords} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <SidebarProvider>
        <div className="flex flex-grow">
          <Sidebar className="flex pt-[70px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-pink-500 dark:bg-pink-600 text-white transition-colors duration-300">
                  <Calendar className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                    감정 대시보드
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                    Emotion Tracker
                  </span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  메뉴
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.id !== "collections" && activeView === item.id} 
                          onClick={() => handleMenuItemClick(item.id)}
                          className="hover:bg-gray-100 dark:hover:bg-gray-700 data-[active=true]:bg-pink-100 dark:data-[active=true]:bg-pink-900/30 data-[active=true]:text-pink-700 dark:data-[active=true]:text-pink-300 transition-colors duration-300"
                        >
                          <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </button>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="bg-white dark:bg-gray-900 transition-colors duration-300">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-700 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
              <SidebarTrigger className="-ml-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300" />
              <Separator
                orientation="vertical"
                className="mr-2 h-4 bg-gray-300 dark:bg-gray-600 transition-colors duration-300"
              />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                {menuItems.find((item) => item.id === activeView)?.title || "감정 대시보드"}
              </h1>
            </header>
            <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              {renderContent()}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
