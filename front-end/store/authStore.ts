import { create } from "zustand"
import { getCurrentUser, logout } from "@/lib/api/auth"
import { getUserInfoFromToken, isAdminFromToken } from "@/lib/utils/jwt"

// 사용자 타입 정의
interface User {
  userId?: string
  userName?: string
  userEmail?: string
  userNumber?: number
  useradmin?: number // 0: 일반 유저, 1: 관리자
  userAdmin?: number // JWT 토큰에서 오는 필드
  user_admin?: number
  isAdmin?: boolean
  role?: string
  jwt_token?: any // 서버에서 오는 jwt_token 객체
  token?: string // JWT 토큰 문자열
  [key: string]: any // 추가 필드를 위한 인덱스 시그니처
}

interface AuthState {
  isLoggedIn: boolean
  // user: User | null
  user: any | null; // 사용자 정보 (필요하다면)
  loading: boolean
  checkAuthStatus: () => Promise<void>; // 로그인 상태 확인 함수
  loginSuccess: (userData: any) => void; // 로그인 성공 시 호출 함수
  logoutUser: () => Promise<void>; // 로그아웃 함수
  isAdmin: () => boolean
  // refreshUserInfo: () => Promise<void>
}

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  loading: true,

  // 로그인 상태 확인 함수
  checkAuthStatus: async () => {
    set({ loading: true })
    try {
      const user = await getCurrentUser();
      // user가 null이 아니고, 빈 객체도 아니며, 로그인된 사용자임을 나타내는 특정 필드가 있는지 확인
      // 예: user.id가 존재하는지, user.username이 비어있지 않은지 등
      // console.log("AuthStore: 백엔드 사용자 정보:", user)

      if (user && Object.keys(user).length > 0 && user.userId) { // <-- 이 조건을 더 엄격하게
        // 사용자 정보 구조 확인 및 처리
        let processedUser = user

        // jwt_token 객체가 있는 경우 그 안의 정보를 사용
        if (user.jwt_token && typeof user.jwt_token === "object") {
          // console.log("AuthStore: jwt_token 객체 발견:", user.jwt_token)
          processedUser = {
            ...user.jwt_token,
            token: user.token, // 토큰 정보도 유지
          }
        }

        // JWT 토큰에서 추가 정보 가져오기
        if (user.token) {
          const tokenInfo = getUserInfoFromToken(user.token)
          if (tokenInfo) {
            processedUser = {
              ...processedUser,
              // JWT 토큰의 정보로 보완
              userAdmin: tokenInfo.userAdmin ?? processedUser.userAdmin,
              useradmin: tokenInfo.useradmin ?? processedUser.useradmin,
              userId: tokenInfo.userId ?? processedUser.userId,
              userName: tokenInfo.userName ?? processedUser.userName,
              userNumber: tokenInfo.userNumber ?? processedUser.userNumber,
            }
          }
        }

        // console.log("AuthStore: 처리된 사용자 정보:", processedUser)
        
  // // 로그인 성공 시 호출
  // loginSuccess: (userData) => {
  //   set({ isLoggedIn: true, user: userData, loading: false });
        set({ isLoggedIn: true, user: processedUser, loading: false })
      } else {
        // user가 없거나, 빈 객체이거나, 로그인된 사용자 정보가 아닐 때
        set({ isLoggedIn: false, user: null, loading: false })
      }
    } catch (error) {
      // console.log("AuthStore: 인증 상태 확인 실패 (토큰 없음 또는 서버 오류)", error);
      // 에러 발생 시 무조건 로그아웃 상태로 처리
      set({ isLoggedIn: false, user: null, loading: false });
    }
  },

  // 사용자 정보 새로고침
  refreshUserInfo: async () => {
    const { checkAuthStatus } = get()
    await checkAuthStatus()
  },

  // 로그인 성공 시 호출 (기존 시그니처 유지하면서 JWT 파싱 추가)
  loginSuccess: (userData: any) => {
    // console.log("AuthStore: 로그인 성공 - 원본 데이터:", userData)

    let processedUser: User = {}

    // 1. 기존 방식: userData를 그대로 사용하는 경우
    if (userData && typeof userData === "object") {
      processedUser = { ...userData }
    }

    // 2. jwt_token 객체가 있는 경우 그 안의 정보를 사용
    if (userData.jwt_token && typeof userData.jwt_token === "object") {
      // console.log("AuthStore: jwt_token 객체에서 사용자 정보 추출:", userData.jwt_token)
      processedUser = {
        ...processedUser,
        ...userData.jwt_token,
      }
    }

    // 3. JWT 토큰이 있는 경우 디코딩해서 추가 정보 가져오기
    if (userData.token) {
      // console.log("AuthStore: JWT 토큰 디코딩 시작:", userData.token)
      const tokenInfo = getUserInfoFromToken(userData.token)
      if (tokenInfo) {
        console.log("AuthStore: JWT 토큰에서 추출한 정보:", tokenInfo)
        processedUser = {
          ...processedUser,
          // JWT 토큰의 정보로 보완/덮어쓰기
          userAdmin: tokenInfo.userAdmin ?? processedUser.userAdmin,
          useradmin: tokenInfo.useradmin ?? processedUser.useradmin,
          userId: tokenInfo.userId ?? processedUser.userId,
          userName: tokenInfo.userName ?? processedUser.userName,
          userNumber: tokenInfo.userNumber ?? processedUser.userNumber,
          userEmail: tokenInfo.userEmail ?? processedUser.userEmail,
        }
      }

      // 토큰 정보도 저장
      processedUser.token = userData.token

      // 토큰을 localStorage에 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("jwt_token", userData.token)
        // console.log("AuthStore: 토큰 localStorage에 저장 완료")
      }
    }

    // console.log("AuthStore: 최종 처리된 사용자 정보:", processedUser)
    // console.log("AuthStore: userAdmin 값:", processedUser.userAdmin, "타입:", typeof processedUser.userAdmin)

    set({ isLoggedIn: true, user: processedUser, loading: false })
    
  },

  // 로그아웃 함수
  logoutUser: async () => {
    try {
      await logout()
    } catch (error) {
      console.error("AuthStore: 로그아웃 API 호출 실패", error)
    } finally {
      set({ isLoggedIn: false, user: null, loading: false });
      // localStorage에서 토큰 제거
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
      }
      set({ isLoggedIn: false, user: null, loading: false })
    }
  },

  // 관리자 여부 확인 함수
  isAdmin: () => {
    const { user } = get()
    if (!user) {
      console.log("AuthStore: 사용자 정보 없음")
      return false
    }

    // console.log("AuthStore: 관리자 확인 중 - 사용자 정보:", user)

    // 1. JWT 토큰에서 먼저 확인 (토큰이 있는 경우)
    if (user.token) {
      const tokenAdmin = isAdminFromToken(user.token)
      if (tokenAdmin) {
        // console.log("AuthStore: JWT 토큰으로 관리자 확인됨")
        return true
      }
    }

    // 2. userAdmin 필드 확인 (JWT에서 가져온 정보)
    if (user.userAdmin === 1) {
      // console.log("AuthStore: userAdmin 필드로 관리자 확인됨 (값:", user.userAdmin, ")")
      return true
    }

    // 3. useradmin 필드 확인
    if (user.useradmin === 1) {
      // console.log("AuthStore: useradmin 필드로 관리자 확인됨 (값:", user.useradmin, ")")
      return true
    }

    // 4. 다른 가능한 필드명들도 확인
    if (user.user_admin === 1) {
      // console.log("AuthStore: user_admin 필드로 관리자 확인됨 (값:", user.user_admin, ")")
      return true
    }

    // 5. isAdmin 필드 확인 (boolean 타입)
    if (user.isAdmin === true) {
      // console.log("AuthStore: isAdmin 필드로 관리자 확인됨")
      return true
    }

    // 6. role 필드 확인
    if (user.role && (user.role === "admin" || user.role === "ADMIN")) {
      // console.log("AuthStore: role 필드로 관리자 확인됨")
      return true
    }

    // 7. 특정 사용자 ID 확인 (마지막 수단)
    if (user.userId && typeof user.userId === "string") {
      const adminUserIds = ["admin", "administrator", "root"]
      if (adminUserIds.includes(user.userId.toLowerCase())) {
        // console.log("AuthStore: userId로 관리자 확인됨")
        return true
      }
    }

    console.log("AuthStore: 관리자가 아님")
    return false
  },
}))

export default useAuthStore
