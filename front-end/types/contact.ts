export interface Contact {
  contactId: number
  userNumber: number
  userName: string
  contactTitle: string
  contactContent: string
  createdDate?: string
}

export interface ContactFormData {
  contact_title: string
  contact_content: string
}

export interface ContactResponse {
  status: "success" | "error"
  message: string
  contactId?: number
}

export interface ContactListResponse {
  status: "success" | "error"
  data: Contact[]
  pagination: {
    currentPage: number
    pageSize: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
}
