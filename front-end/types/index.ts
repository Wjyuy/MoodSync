// types/index.ts

// 타입스크립트-DTO같은 겁니다
// 감정 데이터 타입
import { LucideIcon } from 'lucide-react'; 

export interface Emotion {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

// 음악 추천 데이터 타입
export interface MusicRecommendation {
  title: string;
  artist: string;
  genre: string;
}

// 활동 추천 데이터 타입
export interface ActivityRecommendation {
  activity: string; // 'activity' 속성으로 명확히 정의
  duration: string;
  type: string;
}

// 도서 추천 데이터 타입
export interface BookRecommendation {
  title: string;
  author: string;
  genre: string;
  description?: string;
}


// 추천 데이터를 담는 객체 타입 (각 감정 ID에 해당하는 배열을 가짐)
export interface RecommendationsMap<T> {
  [key: string]: T[];
}

export interface RecommendationResult {
  musicRecommendations: {
    [emotion: string]: MusicRecommendation[];
  };
  activityRecommendations: {
    [emotion: string]: ActivityRecommendation[];
  };
  bookRecommendations: {
    [emotion: string]: BookRecommendation[];
  };
  youtubeVideos?: YoutubeVideo[];
}

export interface YoutubeVideo {
  title: string;
  channel: string;
  thumbnail: string;
  videoUrl: string;
}