// data/emotions.ts
import { Smile, Cloud, Zap, Sun, Sparkles } from "lucide-react";
import { Emotion } from "@/types"; // 새로 정의한 Emotion 타입 임포트

export const emotions: Emotion[] = [
  {
    id: "happy",
    name: "행복함",
    icon: Smile,
    color: "bg-yellow-100 text-yellow-800",
    description: "기분이 좋고 즐거운 상태",
  },
  { id: "sad", name: "슬픔", icon: Cloud, color: "bg-blue-100 text-blue-800", description: "우울하고 침울한 기분" },
  {
    id: "stressed",
    name: "스트레스",
    icon: Zap,
    color: "bg-red-100 text-red-800",
    description: "긴장되고 압박감을 느끼는 상태",
  },
  { id: "calm", name: "평온함", icon: Sun, color: "bg-green-100 text-green-800", description: "차분하고 안정된 마음" },
  {
    id: "excited",
    name: "신남",
    icon: Sparkles,
    color: "bg-purple-100 text-purple-800",
    description: "에너지가 넘치고 활기찬 상태",
  },
  {
    id: "tired",
    name: "피곤함",
    icon: Cloud,
    color: "bg-gray-100 text-gray-800",
    description: "지치고 휴식이 필요한 상태",
  },
];