package com.boot.tensor.service;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.ActingDAO;
import com.boot.tensor.dto.ActingDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ActingServiceImpl implements ActingService {

    @Autowired
    private SqlSession session;

    @Override
    public ArrayList<ActingDTO> getActingDTO() {
        ActingDAO dao = session.getMapper(ActingDAO.class);
        ArrayList<ActingDTO> resultList = dao.getActingDTO();
        return resultList;
    }

    @Override
    public ArrayList<ActingDTO> getRandomActing(int emotionNumber, Object userEmotionData) {
        ActingDAO dao = session.getMapper(ActingDAO.class);
        
        // 전체 활동 가져옴
        List<ActingDTO> allActivities = getAllActivitiesFromDatabase(dao);
        
        log.info("@# ActingService - emotionNumber: {}, 전체 활동 수: {}, userEmotionData: {}", 
                emotionNumber, allActivities.size(), userEmotionData);

        if (userEmotionData != null && userEmotionData instanceof Map && allActivities.size() >= 3) {
            List<ActingDTO> smartRecommendations = generateSmartRecommendations(
                    allActivities, (Map<String, Object>) userEmotionData);
            
            log.info("=== 스마트 추천 결과 ===");
            for (int i = 0; i < smartRecommendations.size(); i++) {
                ActingDTO activity = smartRecommendations.get(i);
                log.info("{}위: 번호={}, 이름={}, 감정점수=[{},{},{},{},{},{}]", 
                        i + 1, activity.getActingNumber(), activity.getActingName(),
                        activity.getHappy(), activity.getSad(), activity.getStress(),
                        activity.getCalm(), activity.getExcited(), activity.getTired());
            }
            
            return new ArrayList<>(smartRecommendations);
        }

        // 폴백: 기존 방식
        ArrayList<ActingDTO> dtos = dao.getRandomActing(emotionNumber);
        return dtos;
    }

    /**
     * 데이터베이스에서 모든 활동을 가져오는 메서드
     */
    private List<ActingDTO> getAllActivitiesFromDatabase(ActingDAO dao) {
        List<ActingDTO> allActivities = new ArrayList<>();
        
        // 모든 감정 번호에서 활동 더 가져옴
        for (int i = 1; i <= 6; i++) {
            try {
                final int emotionNumber = i;
            
                // 각 감정별로 활동 더 조회 
                ArrayList<ActingDTO> emotionActivities = dao.getActingDTO(); // 전체 활동 조회
        
                // 해당 감정 번호의 활동만 필터링
                List<ActingDTO> filteredActivities = emotionActivities.stream()
                    .filter(activity -> activity.getEmotionNumber() == emotionNumber)
                    .collect(Collectors.toList());
                
                allActivities.addAll(filteredActivities);
                log.info("감정 번호 {} 활동 수: {}", emotionNumber, filteredActivities.size());
            } catch (Exception e) {
                log.warn("감정 번호 {} 조회 중 오류: {}", i, e.getMessage());
            }
        }
        
        log.info("전체 조회된 활동 수: {}", allActivities.size());
        return removeDuplicates(allActivities);
    }

    /**
     * 스마트 추천 알고리즘 - 사용자 감정과 활동 감정 수치 직접 비교
     */
    private List<ActingDTO> generateSmartRecommendations(
            List<ActingDTO> activities, Map<String, Object> userEmotionData) {
        
        // 1. 사용자 감정 벡터 추출
        double[] userEmotionVector = extractUserEmotionVector(userEmotionData);
        log.info("사용자 감정 벡터: [{}, {}, {}, {}, {}, {}]", 
                userEmotionVector[0], userEmotionVector[1], userEmotionVector[2], 
                userEmotionVector[3], userEmotionVector[4], userEmotionVector[5]);
        
        // 2. 모든 활동에 대해 사용자 감정과의 유사도 계산
        List<ActivityScore> scoredActivities = new ArrayList<>();
        
        for (ActingDTO activity : activities) {
            // 활동의 감정 벡터 추출
            double[] activityVector = extractActivityEmotionVector(activity);
            
            // 사용자 감정과 활동 감정 간의 유사도 계산
            double similarity = calculateCosineSimilarity(userEmotionVector, activityVector);
            
            // 약간의 무작위성 추가 (5%)
            double randomFactor = new Random().nextDouble() * 0.05;
            double finalScore = similarity + randomFactor;
            
            scoredActivities.add(new ActivityScore(activity, finalScore));
        }
        
        // 3. 유사도 기준으로 정렬
        scoredActivities.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        
        // 4. 상위 10% 중에서 3개 선택
        List<ActingDTO> recommendations = selectFromTopPercent(scoredActivities, 0.1, 3);
        
        return recommendations;
    }
    
    /**
     * 사용자 감정 벡터 추출 (0~1 범위로 정규화)
     */
    private double[] extractUserEmotionVector(Map<String, Object> userEmotionData) {
        double happy = getEmotionValue(userEmotionData, "happy");
        double sad = getEmotionValue(userEmotionData, "sad");
        double stressed = getEmotionValue(userEmotionData, "stressed");
        double calm = getEmotionValue(userEmotionData, "calm");
        double excited = getEmotionValue(userEmotionData, "excited");
        double tired = getEmotionValue(userEmotionData, "tired");
        
        // 이미 0~1 범위라고 가정
        return new double[] {happy, sad, stressed, calm, excited, tired};
    }
    
    /**
     * 활동 감정 벡터 추출 (0~1 범위로 정규화)
     */
    private double[] extractActivityEmotionVector(ActingDTO activity) {
        // 0~100 범위를 0~1로 정규화
        double happy = activity.getHappy() / 100.0;
        double sad = activity.getSad() / 100.0;
        double stressed = activity.getStress() / 100.0;
        double calm = activity.getCalm() / 100.0;
        double excited = activity.getExcited() / 100.0;
        double tired = activity.getTired() / 100.0;
        
        return new double[] {happy, sad, stressed, calm, excited, tired};
    }
    
    /**
     * 상위 퍼센트에서 추천 선택
     */
    private List<ActingDTO> selectFromTopPercent(List<ActivityScore> scoredActivities, double percent, int count) {
        if (scoredActivities.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 상위 퍼센트 계산 (최소 count개는 보장)
        int topCount = Math.max(count, (int)(scoredActivities.size() * percent));
        List<ActivityScore> topCandidates = scoredActivities.subList(0, 
                Math.min(topCount, scoredActivities.size()));
        
        log.info("상위 {}% 후보 수: {} (전체: {})", (int)(percent * 100), topCandidates.size(), scoredActivities.size());
        
        // 상위 후보들 중에서 가장 점수가 높은 count개 선택
        List<ActingDTO> selected = new ArrayList<>();
        Set<String> usedNames = new HashSet<>();
        
        for (ActivityScore score : topCandidates) {
            if (selected.size() >= count) break;
            
            ActingDTO activity = score.getActivity();
            if (!usedNames.contains(activity.getActingName())) {
                selected.add(activity);
                usedNames.add(activity.getActingName());
                
                log.info("선택: {} (유사도: {}, 감정번호: {})", 
                        activity.getActingName(), 
                        String.format("%.4f", score.getScore()), 
                        activity.getEmotionNumber());
            }
        }
        
        return selected;
    }

    /**
     * 코사인 유사도 계산
     */
    private double calculateCosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("벡터 길이가 다릅니다.");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA == 0.0 || normB == 0.0) {
            return 0.0; // 영벡터인 경우
        }

        return dotProduct / (normA * normB);
    }

    /**
     * 활동 카테고리 분류
     */
//    private String categorizeActivity(ActingDTO activity) {
//        String name = activity.getActingName().toLowerCase();
//        
//        if (name.contains("운동") || name.contains("스포츠") || name.contains("산책") || 
//            name.contains("농구") || name.contains("축구") || name.contains("수영")) {
//            return "운동";
//        } else if (name.contains("음악") || name.contains("악기") || name.contains("노래") || 
//                   name.contains("가사")) {
//            return "음악";
//        } else if (name.contains("독서") || name.contains("책") || name.contains("학습") || 
//                   name.contains("언어") || name.contains("쓰기")) {
//            return "학습";
//        } else if (name.contains("요리") || name.contains("음식")) {
//            return "요리";
//        } else if (name.contains("여행") || name.contains("관광")) {
//            return "여행";
//        } else if (name.contains("미술") || name.contains("그림") || name.contains("작품")) {
//            return "예술";
//        } else if (name.contains("명상") || name.contains("요가") || name.contains("호흡")) {
//            return "명상";
//        } else {
//            return "기타";
//        }
//    }

    // 헬퍼 메서드들
//    private double calculateEmotionBalance(double[] emotions) {
//        double variance = calculateVariance(emotions);
//        return Math.max(0, 1.0 - variance / 1000.0); // 분산이 낮을수록 균형적
//    }

//    private double calculateVariance(double[] values) {
//        double mean = Arrays.stream(values).average().orElse(0.0);
//        return Arrays.stream(values)
//                .map(x -> Math.pow(x - mean, 2))
//                .average().orElse(0.0);
//    }

    private List<ActingDTO> removeDuplicates(List<ActingDTO> activities) {
        Map<String, ActingDTO> uniqueMap = new LinkedHashMap<>();
    
        for (ActingDTO activity : activities) {
            // 활동 번호만으로 중복 체크 (이름은 유사할 수 있음)
            String key = String.valueOf(activity.getActingNumber());
            if (!uniqueMap.containsKey(key)) {
                uniqueMap.put(key, activity);
            }
        }
    
        log.info("중복 제거 후 활동 수: {} → {}", activities.size(), uniqueMap.size());
        return new ArrayList<>(uniqueMap.values());
    }

    private double getEmotionValue(Map<String, Object> emotionData, String key) {
        Object value = emotionData.get(key);
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return 0.0;
    }

    // 내부 클래스들
    private static class ActivityScore {
        private final ActingDTO activity;
        private final double score;

        public ActivityScore(ActingDTO activity, double score) {
            this.activity = activity;
            this.score = score;
        }

        public ActingDTO getActivity() { return activity; }
        public double getScore() { return score; }
    }
}
