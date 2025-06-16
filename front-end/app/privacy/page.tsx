import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4" />
            홈으로 돌아가기
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="font-bold text-lg">MoodSync</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">개인정보처리방침</h1>
          <p className="text-gray-600 mt-2">최종 업데이트: 2024년 6월 10일</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. 개인정보 수집 및 이용 목적</h2>
            <div className="text-gray-700 space-y-3">
              <p>MoodSync는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>서비스 제공 및 운영</li>
                <li>감정 기반 음악 및 활동 추천</li>
                <li>사용자 맞춤형 서비스 제공</li>
                <li>서비스 개선 및 품질 향상</li>
                <li>고객 지원 및 문의 응답</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. 수집하는 개인정보 항목</h2>
            <div className="text-gray-700 space-y-3">
              <div>
                <h3 className="font-medium mb-2">필수 정보</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>이메일 주소</li>
                  <li>비밀번호 (암호화 저장)</li>
                  <li>닉네임</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">선택 정보</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>감정 상태 기록</li>
                  <li>음악 선호도</li>
                  <li>활동 선호도</li>
                  <li>서비스 이용 기록</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. 개인정보 보유 및 이용 기간</h2>
            <div className="text-gray-700 space-y-3">
              <p>회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>회원 탈퇴 시: 즉시 삭제</li>
                <li>서비스 이용 기록: 3년 보관 후 삭제</li>
                <li>법령에 의한 보관: 관련 법령에서 정한 기간</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. 개인정보 제3자 제공</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>이용자가 사전에 동의한 경우</li>
                <li>
                  법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. 개인정보 보호를 위한 기술적/관리적 대책</h2>
            <div className="text-gray-700 space-y-3">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>개인정보 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보 취급 직원의 최소화 및 교육</li>
                <li>개인정보보호 전담기구의 운영</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. 개인정보보호책임자</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제
                등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>개인정보보호책임자</strong>
                </p>
                <p>이메일: privacy@moodsync.com</p>
                <p>전화: 02-1234-5678</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. 개인정보 처리방침 변경</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는
                경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
