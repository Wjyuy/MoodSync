// hooks/emotionMapper.ts

import { FaceExpressions, CustomMoodScores } from '@/types/emotion';

/**
 * face-api.js의 기본 감정을 사용자 정의 감정 스코어(0-100%)로 매핑합니다.
 * '스트레스', '평온', '신남', '피곤함'은 기본 감정의 조합으로 추론됩니다.
 *
 * @param expressions face-api.js에서 감지된 얼굴 감정 표현 객체
 * @returns 사용자 정의 감정 스코어 객체 (0-100%)
 */
export function mapEmotionsToMoodSync(expressions: FaceExpressions): CustomMoodScores {
  const { neutral, happy, sad, angry, fearful, disgusted, surprised } = expressions;

  const moodScores: CustomMoodScores = {
    행복: 0,
    슬픔: 0,
    스트레스: 0,
    평온: 0,
    신남: 0,
    피곤함: 0,
  };

  // 각 감정 스코어 계산 (0-100% 범위로 변환)
  // Math.min(100, Math.max(0, value))를 사용하여 0-100% 범위를 벗어나지 않도록 보정합니다.

  // 1. 행복 (Happy): 'happy' 감정의 직접적인 강도
  moodScores.행복 = Math.min(100, Math.max(0, happy * 100));

  // 2. 슬픔 (Sad): 'sad' 감정의 직접적인 강도
  moodScores.슬픔 = Math.min(100, Math.max(0, sad * 100));

  // 3. 스트레스 (Stress): 'angry', 'fearful', 'disgusted' 감정의 조합
  // 가중치를 두어 스트레스와 더 관련 깊은 감정(angry, fearful)에 비중을 둡니다.
  moodScores.스트레스 = Math.min(100, Math.max(0, (angry * 0.7 + fearful * 0.2 + disgusted * 0.1) * 100));

  // 4. 신남 (Excitement): 'happy'와 'surprised' 감정의 조합
  // happy가 높으면서 surprised가 동반될 때 '신남'으로 간주합니다.
  moodScores.신남 = Math.min(100, Math.max(0, (happy * 0.6 + surprised * 0.4) * 100));

  // 5. 평온 (Calm): 'neutral' 감정이 높고, 다른 강한 감정들이 낮을 때
  // neutral이 높을수록 평온에 가깝지만, 다른 부정적인 감정이나 강한 긍정 감정(happy, surprised)이
  // 낮을 때 더 '평온'하다고 판단할 수 있습니다.
  // (neutral - (angry + fearful + sad + disgusted + surprised + happy) / 6) * 100
  // 모든 감정의 평균을 neutral에서 빼서 평온도를 계산하는 방식 (조정 필요)
  const otherEmotionsSum = angry + fearful + disgusted + sad + surprised + happy;
  moodScores.평온 = Math.min(100, Math.max(0, (neutral * 1.5 - otherEmotionsSum * 0.5) * 100));
  // neutral이 높고 다른 감정들이 낮을 때 평온도가 높도록 조정.
  // 예를 들어, neutral이 0.8이고 다른 모든 감정이 0.05 이하면 (0.8 * 1.5 - 0.05 * 6 * 0.5) * 100 = (1.2 - 0.15) * 100 = 105 -> 100
  // neutral이 0.3이고 다른 감정들이 0.1 이면 (0.3 * 1.5 - 0.1 * 6 * 0.5) * 100 = (0.45 - 0.3) * 100 = 15

  // 6. 피곤함 (Tiredness): face-api.js만으로는 정확한 감지가 어려움.
  // 모든 감정의 강도가 낮고, 특히 'neutral'이 아주 높지 않을 때 피곤함으로 추정하는 약한 추론.
  // 또는 모든 감정의 합이 낮을 때를 기준으로 합니다.
  const totalEmotionIntensity = neutral + happy + sad + angry + fearful + disgusted + surprised;
  if (totalEmotionIntensity < 0.5) { // 전체 감정 강도가 낮을 때
    // neutral이 아주 높지 않으면서 전반적으로 감정 표현이 약할 때 피곤함으로 간주
    moodScores.피곤함 = Math.min(100, Math.max(0, (0.5 - totalEmotionIntensity) * 200)); // 0.5 - 0.0 = 0.5 * 200 = 100
  }
  // 이 '피곤함' 로직은 매우 추론적이며, 실제 피로도 감지에는 눈꺼풀 처짐, 하품 등 추가적인 얼굴 랜드마크 분석이 필요합니다.
  // 현재는 모든 감정의 총합이 낮을 때 '무기력함'에 가까운 피곤함으로 간주합니다.

  return moodScores;
}