import { Heart, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-gray-900">이용약관</h1>
          <p className="text-gray-600 mt-2">최종 업데이트: 2024년 6월 10일</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                이 약관은 MoodSync(이하 "회사")가 제공하는 감정 기반 음악 및 활동 추천 서비스(이하 "서비스")의 이용과
                관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <div className="text-gray-700 space-y-3">
              <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>서비스:</strong> 회사가 제공하는 감정 기반 음악 및 활동 추천 서비스
                </li>
                <li>
                  <strong>이용자:</strong> 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원
                </li>
                <li>
                  <strong>회원:</strong> 회사에 개인정보를 제공하여 회원등록을 한 자
                </li>
                <li>
                  <strong>비회원:</strong> 회원에 가입하지 않고 회사가 제공하는 서비스를 이용하는 자
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <div className="text-gray-700 space-y-3">
              <p>1. 이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</p>
              <p>
                2. 회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지
                또는 통지함으로써 효력을 발생합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제4조 (서비스의 제공)</h2>
            <div className="text-gray-700 space-y-3">
              <p>회사가 제공하는 서비스는 다음과 같습니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>감정 상태 기반 음악 추천</li>
                <li>감정 상태 기반 활동 추천</li>
                <li>감정 기록 및 분석</li>
                <li>개인화된 추천 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제5조 (회원가입)</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써
                회원가입을 신청합니다.
              </p>
              <p>
                2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
                등록합니다:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제6조 (회원의 의무)</h2>
            <div className="text-gray-700 space-y-3">
              <p>회원은 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>신청 또는 변경 시 허위내용의 등록</li>
                <li>타인의 정보도용</li>
                <li>회사가 게시한 정보의 변경</li>
                <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
                <li>회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>회사 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>
                  외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제7조 (서비스 이용제한)</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지,
                영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제8조 (면책조항)</h2>
            <div className="text-gray-700 space-y-3">
              <p>
                1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에
                관한 책임이 면제됩니다.
              </p>
              <p>2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
              <p>
                3. 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의
                서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">제9조 (준거법 및 관할법원)</h2>
            <div className="text-gray-700 space-y-3">
              <p>1. 이 약관의 해석 및 회사와 회원 간의 분쟁에 대하여는 대한민국의 법을 적용합니다.</p>
              <p>2. 회사와 회원 간에 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.</p>
            </div>
          </section>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>부칙:</strong> 이 약관은 2024년 6월 10일부터 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
