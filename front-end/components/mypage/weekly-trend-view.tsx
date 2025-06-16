"use client"

// import { useEffect, useState } from "react"
import { WeeklyEmotionChart } from "@/components/mypage/weekly-emotion-chart"
// import { getLatestRecords, type UserRecord } from "@/lib/mypage/mypage-types"
import type { UserRecord } from "@/lib/mypage/mypage-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface WeeklyTrendViewProps {
  allRecords: UserRecord[]
}

export function WeeklyTrendView({ allRecords }: WeeklyTrendViewProps) {
  if (allRecords.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">주간 데이터가 없습니다.</p>
        </div>
      </div>
    )
  }

  // 데이터를 차트 형식으로 변환
  const chartData = {
    dates: allRecords.map((record) => format(new Date(record.created_at), "yyyy-MM-dd")),
    emotions: {
      happy: allRecords.map((record) => record.happy),
      sad: allRecords.map((record) => record.sad),
      stress: allRecords.map((record) => record.stress),
      calm: allRecords.map((record) => record.calm),
      excited: allRecords.map((record) => record.excited),
      tired: allRecords.map((record) => record.tired),
    },
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">지난 기록 감정 추세</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">6가지 감정의 변화를 확인해보세요</p>
        </CardHeader>
        <CardContent>
          <WeeklyEmotionChart data={chartData} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(chartData.emotions).map(([emotion, values]) => {
          const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
          const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0

          const emotionLabels: { [key: string]: string } = {
            happy: "행복",
            sad: "슬픔",
            stress: "스트레스",
            calm: "평온함",
            excited: "신남",
            tired: "피곤함",
          }

          return (
            <Card key={emotion} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-medium text-sm mb-2 text-gray-900 dark:text-white">{emotionLabels[emotion]}</h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{average}</div>
                  <div
                    className={`text-xs ${
                      trend > 0
                        ? "text-green-600 dark:text-green-400"
                        : trend < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// export function WeeklyTrendView() {
//   const [records, setRecords] = useState<UserRecord[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true)
//       try {
//         const latestRecords = await getLatestRecords()
//         setRecords(latestRecords)
//       } catch (error) {
//         console.error("주간 데이터 로딩 실패:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   if (loading) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
//           <p>데이터를 불러오는 중...</p>
//         </div>
//       </div>
//     )
//   }

//   if (records.length === 0) {
//     return (
//       <div className="p-6 flex items-center justify-center min-h-96">
//         <div className="text-center">
//           <p className="text-lg text-muted-foreground">주간 데이터가 없습니다.</p>
//         </div>
//       </div>
//     )
//   }

//   // 데이터를 차트 형식으로 변환
//   const chartData = {
//     dates: records.map((record) => format(new Date(record.created_at), "yyyy-MM-dd")),
//     emotions: {
//       happy: records.map((record) => record.happy),
//       sad: records.map((record) => record.sad),
//       stress: records.map((record) => record.stress),
//       calm: records.map((record) => record.calm),
//       excited: records.map((record) => record.excited),
//       tired: records.map((record) => record.tired),
//     },
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>지난 기록 감정 추세</CardTitle>
//           <p className="text-sm text-muted-foreground">6가지 감정의 변화를 확인해보세요</p>
//         </CardHeader>
//         <CardContent>
//           <WeeklyEmotionChart data={chartData} />
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//         {Object.entries(chartData.emotions).map(([emotion, values]) => {
//           const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
//           const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0

//           const emotionLabels: { [key: string]: string } = {
//             happy: "행복",
//             sad: "슬픔",
//             stress: "스트레스",
//             calm: "평온함",
//             excited: "신남",
//             tired: "피곤함",
//           }

//           return (
//             <Card key={emotion}>
//               <CardContent className="p-4">
//                 <div className="text-center">
//                   <h3 className="font-medium text-sm mb-2">{emotionLabels[emotion]}</h3>
//                   <div className="text-2xl font-bold">{average}</div>
//                   <div
//                     className={`text-xs ${trend > 0 ? "text-green-600" : trend < 0 ? "text-red-600" : "text-gray-600"}`}
//                   >
//                     {trend > 0 ? "↗" : trend < 0 ? "↘" : "→"} {Math.abs(trend)}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
