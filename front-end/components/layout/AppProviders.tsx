// components/AppProviders.tsx
// 헤더 풋터 컴포넌트 포함, AuthInitializer 실행한 후 다른 요소들이 출력되도록 함
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/store/authStore'; // 스토어 경로 확인
import Header from './Header'; // Header 컴포넌트 임포트
import Footer from './Footer'; // Footer 컴포넌트 임포트
import Spinner from '@/components/Spinner'; // ⭐ Spinner 컴포넌트 임포트 ⭐
import { ThemeProvider } from "@/components/theme-provider"
import { useTheme } from 'next-themes'; 

export default function AppProviders({ children }: { children: React.ReactNode }) {
  const { loading, checkAuthStatus } = useAuthStore();
  const { theme } = useTheme();

  useEffect(() => {
    // 앱 시작 시 인증 상태 확인을 한 번만 호출합니다.
    // 이 checkAuthStatus는 localStorage에서 토큰을 읽고 서버에 유효성 검사를 요청할 수 있습니다.
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 transition-colors duration-300">
        <Spinner />
        <p className="mt-4 text-lg">인증 상태를 확인 중입니다...</p>
      </div>
    );
  }


  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen "> 
        <Header /> 
        {/* <main className="flex-1 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50"> */}
        <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden transition-colors duration-300">
{loading ? ( 
            <div className="flex flex-col items-center justify-center h-full w-full">
              <Spinner />
              <p className="mt-4 text-lg">인증 상태를 확인 중입니다...</p>
            </div>
          ) : (
            children // ⭐ 로딩 완료 시에만 자식(페이지/레이아웃) 렌더링 ⭐
          )}
          </main>
        <Footer /> 
      </div>
    </ThemeProvider>
  );
}

// //다크 화이트용 
//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//       <div 
//         className={`flex flex-col min-h-screen 
//           ${theme === 'light' 
//             ? 'bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50' // 라이트 모드 그라데이션
//             : 'bg-gray-900' 
//           }
//           transition-colors duration-300
//         `}
//       >
//         <Header />
//         <main className="flex-1"> 
//           {children}
//         </main>
//         <Footer />
//       </div>
//     </ThemeProvider>
//   );
// }