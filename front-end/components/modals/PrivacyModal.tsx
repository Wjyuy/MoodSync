import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white text-gray-900 [&>button]:text-gray-500">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">개인정보처리방침</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-3">1. 개인정보의 처리목적</h3>
              <p className="text-gray-700 leading-relaxed">
                MoodSync('https://moodsync.com' 이하 'MoodSync')는 다음의 목적을 위하여 개인정보를 처리하고 있으며,
                다음의 목적 이외의 용도로는 이용하지 않습니다.
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                <li>• 개인맞춤 음악 및 활동 추천 서비스 제공</li>
                <li>• 감정 데이터 분석 및 서비스 개선</li>
                <li>• 고객 문의사항 응답 및 고객서비스 제공</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">2. 개인정보의 처리 및 보유기간</h3>
              <p className="text-gray-700 leading-relaxed">
                MoodSync는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 또는 법령에 따른 개인정보
                보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 회원정보: 회원탈퇴 시까지</li>
                <li>• 감정 데이터: 회원탈퇴 후 1년</li>
                <li>• 서비스 이용기록: 3개월</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">3. 개인정보의 제3자 제공</h3>
              <p className="text-gray-700 leading-relaxed">
                MoodSync는 정보주체의 개인정보를 개인정보의 처리목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의,
                법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게
                제공합니다.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">4. 개인정보처리의 위탁</h3>
              <p className="text-gray-700 leading-relaxed">
                MoodSync는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 위탁받는 자: AWS (Amazon Web Services)</li>
                <li>• 위탁하는 업무의 내용: 클라우드 서버 운영 및 데이터 저장</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">5. 정보주체의 권리·의무 및 행사방법</h3>
              <p className="text-gray-700 leading-relaxed">
                정보주체는 MoodSync에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 개인정보 처리정지 요구권</li>
                <li>• 개인정보 열람요구권</li>
                <li>• 개인정보 정정·삭제요구권</li>
                <li>• 개인정보 처리정지 요구권</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">6. 개인정보의 안전성 확보조치</h3>
              <p className="text-gray-700 leading-relaxed">
                MoodSync는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를
                하고 있습니다.
              </p>
              <ul className="mt-2 ml-4 space-y-1 text-gray-700">
                <li>• 개인정보 취급 직원의 최소화 및 교육</li>
                <li>• 개인정보의 암호화</li>
                <li>• 해킹 등에 대비한 기술적 대책</li>
                <li>• 개인정보에 대한 접근 제한</li>
              </ul>
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
