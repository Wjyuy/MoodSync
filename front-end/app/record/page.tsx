// app/page.tsx
'use client'; // 클라이언트 컴포넌트로 지정

import { useEffect, useState } from 'react';
import { logout , getCurrentUser} from '@/lib/api/auth'; // 로그아웃 API 임포트
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Next.js 13+ App Router 사용 시

export default function HomePage() {
  const [user, setUser] = useState<any>(null); // 사용자 정보를 저장할 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const router = useRouter(); // 라우터 훅 사용

  // 페이지 로드 시 사용자 정보를 가져오는 useEffect 훅
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await getCurrentUser(); // 현재 사용자 정보 조회
        // 토큰이 없거나 데이터가 비어있으면 강제 로그아웃 처리
        if (!data || Object.keys(data).length === 0) {
          setUser(null);
          router.replace('/user/login'); // push -> replace로 변경
          return;
        }
        setUser(data); // 상태 업데이트
      } catch (error: any) {
        console.error("사용자 정보 조회 실패:", error);
        setUser(null); // 실패 시 사용자 정보 초기화

        // 401 Unauthorized 에러일 경우 로그인 페이지로 리디렉션
        // Axios 인터셉터에서 이미 처리하지만, 혹시 모를 경우를 대비하여 여기서도 처리 가능
        if (error.message === 'Unauthorized' || error.response?.status === 401) {
          router.replace('/user/login'); // push -> replace로 변경
        } else {
          // 기타 에러도 로그인 페이지로 이동
          router.replace('/user/login');
        }
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchUser();
  }, [router]); // router는 의존성 배열에 포함하는 것이 좋습니다.

  // 로그아웃 핸들러
  const handleLogout = async () => {
    console.log("로그아웃 버튼 클릭");
    await logout(); // 백엔드 로그아웃 API 호출
    setUser(null); // 클라이언트 측 사용자 상태 초기화
    router.replace('/user/login'); // push -> replace로 변경
    console.log("로그아웃 처리 완료, 로그인 페이지로 이동.");
  };

  if (loading) {
    return <div className="container">로딩 중...</div>;
  }

  return (
    <div className="container">
      {/* user 상태에 따라 조건부 렌더링 */}
      {user && user.userName ? (
        <div className="welcome-banner">
          <div className="welcome-text">
            <h1>안녕하세요, <span>{user.userName}</span>님</h1>
          </div>
          <div className="date-display">
            <i className="fas fa-calendar-alt"></i>{' '}
            {/* 현재 날짜와 요일을 한국어로 표시 */}
            <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })}</span>
          </div>
          {/* <button
            onClick={handleLogout} // 로그아웃 버튼 클릭 시 handleLogout 호출
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            로그아웃
          </button> */}
        </div>
      ) : (
        <div className="login-section">
          <Link href="/user/login" legacyBehavior>
            <a className="btn"><i className="fas fa-sign-in-alt"></i> 로그인 하러 가기</a>
          </Link>
          <p style={{ marginTop: 20 }}>
            계정이 없으신가요?{' '}
            <Link href="/user/join" legacyBehavior>
              <a>회원가입</a>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}