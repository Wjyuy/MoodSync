import api from './base';

// const express = require('express');
// const cors=require('cors');
// const app=express();

// app.use(cors());

interface LoginCredentials {
  userId: string;
  userPw: string;
}

// Define interfaces for the mailConfirm endpoint response
export interface MailConfirmSuccessResponse {
  success: true;
  code: string;
}

export interface MailConfirmErrorResponse {
  success: false;
  message: string;
}

export type MailConfirmResponse = MailConfirmSuccessResponse | MailConfirmErrorResponse;

// 서버에서 반환하는 사용자 정보 인터페이스 (BasicUserDTO와 일치하도록 수정)
export interface UserDTO {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userNumber?: number;
  useradmin?: number; // 0: 일반 유저, 1: 관리자
  // 다른 가능한 필드들
  userAdmin?: number;
  user_admin?: number;
  isAdmin?: boolean;
  role?: string;
  // 추가 필드들
  [key: string]: any; // 알 수 없는 추가 필드를 위한 인덱스 시그니처
}

// 로그인 함수
export const login = async (credentials: LoginCredentials) => {
  const response = await api.post('/user/login', credentials);
  return response.data;
};

// 로그아웃 함수
export const logout = async () => {
  try {
    await api.post('/user/logout');
    // console.log("서버 로그아웃 요청 성공: HttpOnly 쿠키 만료 예정.");
  } catch (error) {
    console.error("서버 로그아웃 요청 실패:", error);
  }
};

// 현재 사용자 정보 가져오기 (디버깅 로그 추가)
export const getCurrentUser = async (): Promise<UserDTO | null> => {
  try {
    // console.log("getCurrentUser API 호출 시작");
    const response = await api.get('/user/me');
    
    // 응답 데이터 상세 로깅
    // console.log("getCurrentUser API 응답:", response);
    // console.log("사용자 데이터:", response.data);
    
    // 관리자 관련 필드 확인
    if (response.data) {
      // console.log("관리자 관련 필드 확인:");
      // console.log("- useradmin:", response.data.useradmin);
      // console.log("- userAdmin:", response.data.userAdmin);
      // console.log("- user_admin:", response.data.user_admin);
      // console.log("- isAdmin:", response.data.isAdmin);
      // console.log("- role:", response.data.role);
      
      // 모든 필드 출력 (알 수 없는 필드 확인용)
      // console.log("모든 필드:");
      Object.keys(response.data).forEach(key => {
        // console.log(`- ${key}:`, response.data[key]);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error("getCurrentUser API 호출 실패:", error);
    return null;
  }
};

export const register = async (joinData: any) => {
  const params = new URLSearchParams(joinData).toString();
  const response = await api.post(
    '/joinProc',
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data;
};

/**
 * 이메일 인증 코드를 요청하는 함수.
 * @param email 인증을 요청할 이메일 주소
 * @returns Promise<MailConfirmResponse> 서버 응답 (성공 또는 실패 메시지/코드)
 */
export const sendVerificationEmail = async (email: string): Promise<MailConfirmResponse> => {
  const response = await api.get<MailConfirmResponse>('/mailConfirm', {
    params: {
      email: email,
    },
  });
  return response.data;
};
