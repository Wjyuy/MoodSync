import api from "./base"

// 모델 학습 API
export async function trainModel(): Promise<{ status: string; message: string }> {
  try {
    // 기존 모델 파일들 삭제 요청
    // await fetch('http://localhost:4000/clear-models', { method: 'DELETE' })
    await fetch('http://localhost:4000/clear-models', { method: 'POST' })


    // 모델 학습 시작
    // const response = await fetch('http://localhost:4000/train', { method: 'POST' })
    const response = await fetch('http://localhost:4000/train', { method: 'GET' })
    const data = await response.json()

    return {
      status: response.ok ? 'success' : 'error',
      message: data.message || '모델 학습이 완료되었습니다.'
    }
  } catch (error) {
    console.error('Model training error:', error)
    return {
      status: 'error',
      message: '모델 학습 중 오류가 발생했습니다.'
    }
  }
}

// 문의 답변 추가 API
export async function addContactReply(
  contactId: number,
  answerContent: string
): Promise<{ status: string; message: string }> {
  const res = await api.post("/api/add_contact_reply", {
    contactId,
    answerContent
  });
  return res.data;
}

// 관리자 통계 API
export async function getAdminStats(): Promise<{
  totalContacts: number
  totalFeedbacks: number
  pendingContacts: number
  averageRating: number
}> {
  const res = await api.get("/api/admin_stats")
  return res.data
}
