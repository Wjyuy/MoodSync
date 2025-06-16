import type React from "react"
import type { Metadata } from "next"
import AppProviders from "@/components/layout/AppProviders"
import "./globals.css"

export const metadata: Metadata = {
  title: "MoodSync - 당신의 감정을 동기화하세요",
  description: "감정에 맞는 음악과 활동을 추천해주는 MoodSync 앱",
  keywords: ["감정", "음악 추천", "활동 추천", "무드", "MoodSync"],
  // generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 다음 지도 API 스크립트  */}
        <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" async defer></script>

        {/* 비밀번호 눈 아이콘 (Ionicons) CSS */}
        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
      </head>
      <body>
        {/* 헤더 로딩 전 토큰확인 먼저 하기 위해 appProviders 컴포넌트 사용 -> 헤더,푸터 안에 포함되어있습니다*/}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
