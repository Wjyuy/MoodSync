import { Heart, ArrowLeft, Users, Target, Lightbulb, Award } from "lucide-react"
import Link from "next/link"

export default function AboutUs() {
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
          <h1 className="text-3xl font-bold text-gray-900">회사소개</h1>
          <p className="text-gray-600 mt-2">감정과 음악을 연결하는 혁신적인 서비스</p>
        </div>

        <div className="space-y-8">
          {/* 회사 소개 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">MoodSync와 함께하는 감정 여행</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                MoodSync는 개인의 감정 상태를 이해하고, 그에 맞는 음악과 활동을 추천하여 더 나은 일상을 만들어가는
                혁신적인 플랫폼입니다.
              </p>
              <p>
                우리는 음악이 가진 치유의 힘과 적절한 활동이 감정에 미치는 긍정적인 영향을 믿습니다. AI 기술과 심리학적
                연구를 바탕으로, 사용자 개개인의 감정 패턴을 분석하고 맞춤형 솔루션을 제공합니다.
              </p>
            </div>
          </div>

          {/* 미션과 비전 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-900">미션</h3>
              </div>
              <p className="text-gray-700">
                모든 사람이 자신의 감정을 이해하고 건강하게 관리할 수 있도록 돕는 것입니다. 음악과 활동을 통해 감정적
                웰빙을 증진시키고, 더 행복한 일상을 만들어갑니다.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-semibold text-gray-900">비전</h3>
              </div>
              <p className="text-gray-700">
                감정 기반 개인화 서비스의 선두주자가 되어, 전 세계 사람들의 정신 건강과 삶의 질 향상에 기여하는 글로벌
                플랫폼으로 성장하는 것입니다.
              </p>
            </div>
          </div>

          {/* 핵심 가치 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">핵심 가치</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-pink-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">공감</h4>
                <p className="text-sm text-gray-600">
                  사용자의 감정을 깊이 이해하고 공감하며, 진정성 있는 서비스를 제공합니다.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">연결</h4>
                <p className="text-sm text-gray-600">음악과 활동을 통해 사람들의 감정과 경험을 연결하고 공유합니다.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">혁신</h4>
                <p className="text-sm text-gray-600">최신 기술과 연구를 바탕으로 지속적으로 혁신하고 발전합니다.</p>
              </div>
            </div>
          </div>

          {/* 서비스 특징 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">서비스 특징</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI 기반 감정 분석</h4>
                  <p className="text-gray-600">
                    고도화된 AI 알고리즘을 통해 사용자의 감정 상태를 정확하게 분석하고 개인화된 추천을 제공합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">다양한 음악 큐레이션</h4>
                  <p className="text-gray-600">
                    장르, 분위기, 템포 등을 고려한 세심한 음악 큐레이션으로 감정에 딱 맞는 음악을 추천합니다.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">맞춤형 활동 제안</h4>
                  <p className="text-gray-600">
                    운동, 명상, 창작 활동 등 감정 상태에 따른 다양한 활동을 제안하여 건강한 감정 관리를 돕습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 연락처 정보 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">연락처</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">일반 문의</h4>
                <div className="space-y-2 text-gray-600">
                  <p>이메일: contact@moodsync.com</p>
                  <p>전화: 02-1234-5678</p>
                  <p>운영시간: 평일 09:00 - 18:00</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">사업자 정보</h4>
                <div className="space-y-2 text-gray-600">
                  <p>회사명: (주)무드싱크</p>
                  <p>대표자: 김무드</p>
                  <p>사업자등록번호: 123-45-67890</p>
                  <p>주소: 서울특별시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
