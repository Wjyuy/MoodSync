// JWT 토큰 디코딩 유틸리티
export function decodeJWT(token: string) {
  try {
    // JWT는 header.payload.signature 형태로 구성됨
    const parts = token.split(".")
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format")
    }

    // payload 부분 디코딩 (Base64URL 디코딩)
    const payload = parts[1]
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))

    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error("JWT 디코딩 실패:", error)
    return null
  }
}

// 로컬스토리지에서 토큰 가져오기
export function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("jwt_token") || sessionStorage.getItem("jwt_token")
}

// JWT 토큰에서 사용자 정보 추출
export function getUserInfoFromToken(token?: string) {
  const jwtToken = token || getTokenFromStorage()
  if (!jwtToken) {
    // console.log("JWT: 토큰이 없음")
    return null
  }

  const decoded = decodeJWT(jwtToken)
  if (!decoded) {
    // console.log("JWT: 토큰 디코딩 실패")
    return null
  }

  // console.log("JWT: 디코딩된 토큰 정보:", decoded)
  return decoded
}

// JWT 토큰에서 관리자 권한 확인
export function isAdminFromToken(token?: string): boolean {
  const tokenInfo = getUserInfoFromToken(token)
  if (!tokenInfo) {
    // console.log("JWT: 토큰 정보 없음")
    return false
  }

  // userAdmin 필드 확인 (JWT에서 userAdmin: 0 또는 1)
  if (tokenInfo.userAdmin === 1 || tokenInfo.userAdmin === "1") {
    // console.log("JWT: userAdmin 필드로 관리자 확인됨 (값:", tokenInfo.userAdmin, ")")
    return true
  }

  // useradmin 필드 확인
  if (tokenInfo.useradmin === 1 || tokenInfo.useradmin === "1") {
    // console.log("JWT: useradmin 필드로 관리자 확인됨 (값:", tokenInfo.useradmin, ")")
    return true
  }

  // 다른 가능한 필드명들도 확인
  if (tokenInfo.user_admin === 1 || tokenInfo.user_admin === "1") {
    // console.log("JWT: user_admin 필드로 관리자 확인됨 (값:", tokenInfo.user_admin, ")")
    return true
  }

  // 기존 방식들도 유지 (백업용)
  if (tokenInfo.isAdmin === true || tokenInfo.is_admin === true) {
    // console.log("JWT: isAdmin 필드로 관리자 확인됨")
    return true
  }

  if (
    tokenInfo.role === "admin" ||
    tokenInfo.role === "ADMIN" ||
    tokenInfo.authorities?.includes("ROLE_ADMIN") ||
    tokenInfo.roles?.includes("admin")
  ) {
    // console.log("JWT: role 필드로 관리자 확인됨")
    return true
  }

  // console.log("JWT: 관리자가 아님 - userAdmin 값:", tokenInfo.userAdmin)
  return false
}
