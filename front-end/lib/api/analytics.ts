// 분석 데이터를 가져오는 API 함수들
import { format } from "date-fns"

// 시간대별 문의 수 데이터 가져오기
export async function fetchContactAnalytics(date?: Date) {
  try {
    // 날짜가 제공되지 않으면 오늘 날짜 사용
    const targetDate = date || new Date()
    const formattedDate = format(targetDate, "yyyyMMdd")

    const response = await fetch(`http://localhost:8485/api/analize-contact?created_date=${formattedDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch contact analytics")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching contact analytics:", error)
    throw error
  }
}

// 카테고리별 피드백 데이터 가져오기
export async function fetchFeedbackAnalytics(date?: Date) {
  try {
    // 날짜가 제공되지 않으면 오늘 날짜 사용
    const targetDate = date || new Date()
    const formattedDate = format(targetDate, "yyyyMMdd")

    const response = await fetch(`http://localhost:8485/api/analize-feedback?created_date=${formattedDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch feedback analytics")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching feedback analytics:", error)
    throw error
  }
}

// 이탈 예측 데이터 가져오기
export async function fetchChurnAnalytics(userData: any) {
  try {
    const response = await fetch("http://localhost:4000/predict-churn-model", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch churn analytics")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching churn analytics:", error)
    throw error
  }
}
