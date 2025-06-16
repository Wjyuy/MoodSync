// data/activityRecommendations.ts
import { RecommendationsMap, ActivityRecommendation } from "@/types"; // 타입 임포트

export const activityRecommendations: RecommendationsMap<ActivityRecommendation> = {
  happy: [
    { activity: "친구들과 파티하기", duration: "2-3시간", type: "사회활동" },
    { activity: "새로운 취미 시작하기", duration: "1시간", type: "자기계발" },
    { activity: "야외 피크닉", duration: "3-4시간", type: "야외활동" },
  ],
  sad: [
    { activity: "일기 쓰기", duration: "30분", type: "자기성찰" },
    { activity: "따뜻한 차 마시며 독서", duration: "1-2시간", type: "휴식" },
    { activity: "감동적인 영화 보기", duration: "2시간", type: "엔터테인먼트" },
  ],
  stressed: [
    { activity: "명상하기", duration: "10-20분", type: "마음챙김" },
    { activity: "요가나 스트레칭", duration: "30분", type: "운동" },
    { activity: "자연 속 산책", duration: "1시간", type: "야외활동" },
  ],
  calm: [
    { activity: "그림 그리기", duration: "1시간", type: "창작활동" },
    { activity: "정원 가꾸기", duration: "1-2시간", type: "취미" },
    { activity: "클래식 음악 감상", duration: "30분", type: "문화활동" },
  ],
  excited: [
    { activity: "댄스 배우기", duration: "1시간", type: "운동" },
    { activity: "새로운 레시피 도전", duration: "2시간", type: "요리" },
    { activity: "모험적인 스포츠", duration: "2-3시간", type: "스포츠" },
  ],
  tired: [
    { activity: "따뜻한 목욕", duration: "30분", type: "휴식" },
    { activity: "가벼운 스트레칭", duration: "15분", type: "운동" },
    { activity: "편안한 음악과 함께 휴식", duration: "1시간", type: "휴식" }, // 'activity'로 최종 수정 확인
  ],
};