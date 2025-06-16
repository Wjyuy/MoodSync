// components/AuthInitializer.tsx 
// 토큰이 있는지 없는지 체크 
'use client';
import { useEffect } from 'react';
import useAuthStore from '@/store/authStore';

export default function AuthInitializer() {
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  useEffect(() => {
    checkAuthStatus(); // 앱 시작 시 인증 상태 확인
  }, [checkAuthStatus]);

  return null; // UI를 렌더링하지 않음
}