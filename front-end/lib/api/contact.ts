import api from "./base"
import type { Contact } from "@/types/contact"

export async function fetchPendingContactsCount(): Promise<{ pendingContacts: number }> {
  const res = await api.get("/api/pending_contacts_count")

  if (res.data.status === "success") {
    return {
      pendingContacts: res.data.pendingContacts,
    }
  } else {
    throw new Error(res.data.message || "대기 중인 문의 수 조회에 실패했습니다.")
  }
}

export interface CreateContactParams {
  contact_title: string
  contact_content: string
}

export interface ReadContactParams {
  contact_title: string
  contact_content: string
}

export interface UpdateContactParams {
  contactId: number
  contact_title: string
  contact_content: string
}

export interface DeleteContactParams {
  contactId: number
}

export async function createContact(params: CreateContactParams) {
  const res = await api.get("/api/create_contact", {
    params: {
      contact_title: params.contact_title,
      contact_content: params.contact_content,
    },
  })
  return res.data
}

export async function readContact(params: ReadContactParams) {
  const res = await api.get("/api/read_contact", {
    params: {
      contact_title: params.contact_title,
      contact_content: params.contact_content,
    },
  })
  return res.data
}

export async function updateContact(params: UpdateContactParams) {
  // 디버깅을 위한 상세 로그 추가
  console.log("=== updateContact 호출 ===")
  console.log("전체 params:", params)
  // console.log("contactId:", params.contactId, "타입:", typeof params.contactId, "길이:", params.contactId?.length)
  console.log(
    "contact_title:",
    params.contact_title,
    "타입:",
    typeof params.contact_title,
    "길이:",
    params.contact_title?.length,
  )
  console.log(
    "contact_content:",
    params.contact_content,
    "타입:",
    typeof params.contact_content,
    "길이:",
    params.contact_content?.length,
  )

  // contactId가 유효한지 확인
  if (!params.contactId) {
    console.error("contactId가 비어있음:", params.contactId)
    throw new Error("contactId가 필요합니다.")
  }

  // contactId가 숫자인지 확인
  if (isNaN(Number(params.contactId))) {
    console.error("contactId가 숫자가 아님:", params.contactId)
    throw new Error("contactId는 숫자여야 합니다.")
  }

  // contact_title 확인
  if (!params.contact_title || params.contact_title.trim() === "") {
    console.error("contact_title이 비어있음:", params.contact_title)
    throw new Error("제목이 필요합니다.")
  }

  // contact_content 확인
  if (!params.contact_content || params.contact_content.trim() === "") {
    console.error("contact_content가 비어있음:", params.contact_content)
    throw new Error("내용이 필요합니다.")
  }

  try {
    console.log("API 요청 전송 중...")
    const res = await api.get("/api/update_contact", {
      params: {
        contactId: params.contactId,
        contact_title: params.contact_title,
        contact_content: params.contact_content,
      },
    })
    console.log("updateContact 성공 응답:", res.data)
    return res.data
  } catch (error) {
    console.error("updateContact API 호출 실패:", error)
    // if (error.response) {
    //   console.error("응답 상태:", error.response.status)
    //   console.error("응답 데이터:", error.response.data)
    //   console.error("응답 헤더:", error.response.headers)
    // }
    // if (error.request) {
    //   console.error("요청 정보:", error.request)
    // }
    throw error
  }
}

export async function deleteContact(params: DeleteContactParams) {
  // 디버깅을 위한 로그 추가
  console.log("deleteContact params:", params)

  // contactId가 유효한지 확인
  if (!params.contactId) {
    throw new Error("contactId가 필요합니다.")
  }

  const res = await api.get("/api/delete_contact", {
    params: {
      contactId: params.contactId,
    },
  })
  return res.data
}

export async function fetchContacts(
  pageNum = 1,
  amount = 10,
): Promise<{
  contacts: Contact[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> {
  const res = await api.get("/api/all_contacts", {
    params: {
      pageNum,
      amount,
    },
  })

  if (res.data.status === "success") {
    return {
      contacts: res.data.data.map((dto: any) => ({
        contactId: String(dto.contactId),
        userNumber: dto.userNumber,
        userName: dto.userName,
        contactTitle: dto.contactTitle,
        createdDate: dto.createdDate,
        contactContent: dto.contactContent,
      })),
      pagination: res.data.pagination,
    }
  } else {
    throw new Error(res.data.message || "문의 목록 조회에 실패했습니다.")
  }
}

// 나의 문의 조회
export async function fetchMyContacts(
  pageNum = 1,
  amount = 5,
): Promise<{
  contacts: Contact[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}> {
  const res = await api.get("/api/my_contacts", {
    params: {
      pageNum,
      amount,
    },
  })

  if (res.data.status === "success") {
    return {
      contacts: res.data.data.map((dto: any) => ({
        contactId: String(dto.contactId),
        userNumber: dto.userNumber,
        userName: dto.userName,
        contactTitle: dto.contactTitle,
        contactContent: dto.contactContent,
        createdDate: dto.createdDate,
      })),
      pagination: res.data.pagination,
    }
  } else {
    throw new Error(res.data.message || "나의 문의 목록 조회에 실패했습니다.")
  }
}

export async function fetchContactStats(): Promise<{ totalContacts: number }> {
  const res = await api.get("/api/contact_stats")

  if (res.data.status === "success") {
    return {
      totalContacts: res.data.totalContacts,
    }
  } else {
    throw new Error(res.data.message || "문의 통계 조회에 실패했습니다.")
  }
}

export async function fetchContactAnswer(contactId: number) {
  const res = await api.get("/api/contact_answer", {
    params: { contactId }
  });
  return res.data;
}


