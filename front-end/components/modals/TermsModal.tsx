import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white text-gray-900 [&>button]:text-gray-500">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">이용약관</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-3">제1조 (목적)</h3>
              <p className="text-gray-700 leading-relaxed">
                이 약관은 MoodSync(이하 "회사")가 제공하는 감정 기반 음악 및 활동 추천 서비스(이하 "서비스")의 이용과
                관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제2조 (정의)</h3>
              <p className="text-gray-700 leading-relaxed">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• "서비스"란 회사가 제공하는 MoodSync 플랫폼 및 관련 서비스를 의미합니다.</li>
                <li>• "이용자"란 이 약관에 따라 회사의 서비스를 받는 회원 및 비회원을 말합니다.</li>
                <li>
                  • "회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며
                  회사의 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제3조 (약관의 효력 및 변경)</h3>
              <p className="text-gray-700 leading-relaxed">
                이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다. 회사는
                합리적인 사유가 발생할 경우에는 이 약관을 변경할 수 있으며, 약관이 변경되는 경우 변경된 약관의 내용과
                시행일을 명시하여 현행약관과 함께 서비스의 초기화면에 그 시행일 7일 이전부터 시행일 후 상당한 기간 동안
                공지합니다.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제4조 (회원가입)</h3>
              <p className="text-gray-700 leading-relaxed">
                이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서
                회원가입을 신청합니다.
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>
                  • 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로
                  등록합니다.
                </li>
                <li>• 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                <li>• 등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제5조 (서비스의 제공 및 변경)</h3>
              <p className="text-gray-700 leading-relaxed">회사는 다음과 같은 업무를 수행합니다.</p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 감정 상태 기반 음악 추천 서비스</li>
                <li>• 개인 맞춤형 활동 추천 서비스</li>
                <li>• 감정 데이터 분석 및 리포트 제공</li>
                <li>• 기타 회사가 정하는 업무</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제6조 (서비스의 중단)</h3>
              <p className="text-gray-700 leading-relaxed">
                회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한 경우에는 서비스의
                제공을 일시적으로 중단할 수 있습니다.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제7조 (회원의 의무)</h3>
              <p className="text-gray-700 leading-relaxed">회원은 다음 행위를 하여서는 안 됩니다.</p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 신청 또는 변경시 허위내용의 등록</li>
                <li>• 타인의 정보도용</li>
                <li>• 회사가 게시한 정보의 변경</li>
                <li>• 회사가 금지한 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
                <li>• 회사 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">제8조 (저작권의 귀속 및 이용제한)</h3>
              <p className="text-gray-700 leading-relaxed">
                회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다. 이용자는 회사를 이용함으로써
                얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타
                방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
              </p>
            </section>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>시행일자:</strong> 2025년 6월 2일
                <br />
                <strong>문의처:</strong> qwer741523@naver.com
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
