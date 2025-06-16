import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, Music, Users, Target } from "lucide-react"

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-white text-gray-900 [&>button]:text-gray-500">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <Heart className="w-6 h-6 text-pink-500" />
            MoodSync 회사소개
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* 회사 개요 */}
            <section className="text-center py-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className="w-12 h-12 text-pink-500" />
                <h2 className="text-3xl font-bold text-gray-900">MoodSync</h2>
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                감정에 맞는 음악과 활동을 추천하여 더 나은 하루를 만들어가는 AI 기반 감정 케어 플랫폼
              </p>
            </section>

            {/* 미션 & 비전 */}
            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-600" />
                  미션
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  모든 사람이 자신의 감정을 이해하고 건강하게 관리할 수 있도록 도와, 더 행복하고 균형 잡힌 삶을 살 수
                  있게 합니다.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-blue-600" />
                  비전
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  AI 기술을 통해 개인의 감정 패턴을 분석하고, 맞춤형 솔루션을 제공하는 글로벌 감정 케어 플랫폼이
                  되겠습니다.
                </p>
              </div>
            </section>

            {/* 핵심 서비스 */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-600" />
                핵심 서비스
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-600 mb-2">AI 음악 추천</h4>
                  <p className="text-sm text-gray-600">현재 감정 상태에 맞는 음악을 AI가 분석하여 추천해드립니다.</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-600 mb-2">활동 추천</h4>
                  <p className="text-sm text-gray-600">기분 전환에 도움이 되는 다양한 활동들을 제안해드립니다.</p>
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-600 mb-2">감정 분석</h4>
                  <p className="text-sm text-gray-600">감정 패턴을 분석하여 개인별 맞춤 인사이트를 제공합니다.</p>
                </div>
              </div>
            </section>

            {/* 회사 정보 */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                회사 정보
              </h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">기본 정보</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>
                        <strong>회사명:</strong> 주식회사 MoodSync
                      </li>
                      <li>
                        <strong>설립일:</strong> 2025년 6월
                      </li>
                      <li>
                        <strong>대표이사:</strong> 임진우
                      </li>
                      <li>
                        <strong>직원 수:</strong> 4명
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">연락처</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>
                        <strong>주소:</strong> 부산 부산진구 중앙대로 627 삼비빌딩 2F, 12F
                      </li>
                      <li>
                        <strong>전화:</strong> T: 1544-9970
                      </li>
                      <li>
                        <strong>이메일:</strong> qwer741523@naver.com
                      </li>
                      <li>
                        <strong>웹사이트:</strong> www.moodsync.com
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 핵심 가치 */}
            <section>
              <h3 className="text-xl font-semibold mb-4">핵심 가치</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">공감과 이해</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      사용자의 감정을 깊이 이해하고 공감하는 서비스를 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">개인화</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      각 개인의 고유한 감정 패턴에 맞춘 맞춤형 솔루션을 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">접근성</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      누구나 쉽게 사용할 수 있는 직관적이고 친근한 인터페이스를 제공합니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Music className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">혁신</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      최신 AI 기술을 활용하여 지속적으로 서비스를 개선해나갑니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 연혁 */}
            <section>
              <h3 className="text-xl font-semibold mb-4">주요 연혁</h3>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="text-sm font-semibold text-pink-600 w-20">2024.01</div>
                  <div className="text-sm text-gray-700">사용자 10만명 돌파, 프리미엄 서비스 출시</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-semibold text-pink-600 w-20">2023.09</div>
                  <div className="text-sm text-gray-700">AI 음악 추천 알고리즘 2.0 버전 출시</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-semibold text-pink-600 w-20">2023.06</div>
                  <div className="text-sm text-gray-700">MoodSync 베타 서비스 정식 출시</div>
                </div>
                <div className="flex gap-4">
                  <div className="text-sm font-semibold text-pink-600 w-20">2023.03</div>
                  <div className="text-sm text-gray-700">주식회사 MoodSync 설립</div>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
