// 감정 분석 관련 API 함수들

/**
 * 감정 응집도 통계 데이터를 가져오는 함수
 * @param createdDate 날짜 (yyyyMMdd 형식)
 * @returns 감정 응집도 통계 데이터
 */
export async function fetchCohesiveEmotionStats(createdDate: string) {
  try {
    const url = `http://localhost:8485/api/analize-cohesion?created_at=${encodeURIComponent(createdDate)}`
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch emotion stats")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching cohesive emotion stats:", error)
    throw error
  }
}

/**
 * 감정 분석 결과를 가져오는 함수
 * @param params 검색 매개변수
 * @returns 감정 분석 결과
 */
export async function fetchEmotionAnalysis(params?: {
  date?: string
  emotion?: string
  limit?: number
}) {
  try {
    const queryParams = new URLSearchParams()

    if (params?.date) queryParams.append("date", params.date)
    if (params?.emotion) queryParams.append("emotion", params.emotion)
    if (params?.limit) queryParams.append("limit", params.limit.toString())

    const url = `http://localhost:8485/api/emotion-analysis${queryParams.toString() ? `?${queryParams.toString()}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch emotion analysis")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching emotion analysis:", error)
    throw error
  }
}
