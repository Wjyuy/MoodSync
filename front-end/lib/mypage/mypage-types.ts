// 백엔드 API 응답 타입 정의
export interface MusicExceptEmotionDTO {
  musicNumber: number
  musicName: string
  musicAuthor: string
}

export interface ActingExceptEmotionDTO {
  actingNumber: number
  actingName: string
}

export interface BookExceptEmotionDTO {
  bookNumber: number
  bookName: string
  bookAuthor: string
}

export interface YoutubeVideo {
  title: string
  channel: string
  thumbnail: string
  videoUrl: string
}

export interface UserRecord {
  id: number
  happy: number
  sad: number
  stress: number
  calm: number
  excited: number
  tired: number
  music_ids: string
  action_ids: string
  book_ids: string
  created_at: string
  recommendedMusics?: MusicExceptEmotionDTO[]
  recommendedActions?: ActingExceptEmotionDTO[]
  recommendedBooks?: BookExceptEmotionDTO[]
  youtubeSearchResults?: YoutubeVideo[]
}

// API 함수들
// export async function getUserRecord(): Promise<UserRecord | null> {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8485"
//   try {
//     const res = await fetch(`${API_BASE_URL}/test/record`)
//     if (!res.ok) return null
//     return await res.json()
//   } catch (err) {
//     console.error(err)
//     return null
//   }
// }

// mypage 일별 조회시
export async function getUserRecordByDate(date: string): Promise<UserRecord | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8485"
  console.log("Fetching user record for:", date)

  try {
    const res = await fetch(`${API_BASE_URL}/test/userRecord?date=${date}`, {
      method: "GET",
      credentials: "include", // ✅ 쿠키 전송 필수 설정
    })

    if (!res.ok) {
      console.warn("응답 실패:", res.status)
      return null
    }

    return await res.json()
  } catch (err) {
    console.error("에러 발생:", err)
    return null
  }
}

// export async function getLatestRecords(): Promise<UserRecord[]> {
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8485"

//   try {
//     const response = await fetch(`${API_BASE_URL}/test/record/latest`)
//     if (!response.ok) {
//       console.error("데이터 요청 실패:", response.statusText)
//       return []
//     }
//     const records: UserRecord[] = await response.json()
//     return records
//   } catch (error) {
//     console.error("API 호출 중 오류:", error)
//     return []
//   }
// }

export async function getLatestRecords(): Promise<UserRecord[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8485"

  try {
    const response = await fetch(`${API_BASE_URL}/test/record/latest`, {
      method: "GET",
      credentials: "include", // ✅ 쿠키 기반 인증을 위한 설정
    });

    if (!response.ok) {
      console.error("데이터 요청 실패:", response.statusText)
      return []
    }

    const records: UserRecord[] = await response.json()
    return records
  } catch (error) {
    console.error("API 호출 중 오류:", error)
    return []
  }
}