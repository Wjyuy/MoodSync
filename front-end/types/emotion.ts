// types/emotion.ts

// face-api.js에서 감지된 기본 감정 표현 객체 타입
export interface FaceExpressions {
  neutral: number;
  happy: number;
  sad: number;
  angry: number;
  fearful: number;
  disgusted: number;
  surprised: number;
}

// 사용자 정의 감정 스코어 객체 타입 (0-100%)
export interface CustomMoodScores {
  행복: number;
  슬픔: number;
  스트레스: number;
  평온: number;
  신남: number;
  피곤함: number;
  [key: string]: number; // 문자열 인덱스 시그니처 추가
}