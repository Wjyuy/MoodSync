package com.boot.tensor.service;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.MusicDAO;
import com.boot.tensor.dto.MusicDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MusicServiceImpl implements MusicService {

    @Autowired
    private SqlSession session;

    @Override
    public ArrayList<MusicDTO> getMusicDTO() {
        MusicDAO dao = session.getMapper(MusicDAO.class);
        ArrayList<MusicDTO> resultList = dao.getMusicDTO();
        return resultList;
    }

    @Override
    public ArrayList<MusicDTO> getRandomMusic(int emotionNumber, Object userEmotionData) {
        MusicDAO dao = session.getMapper(MusicDAO.class);
        
        // 전체 음악
        List<MusicDTO> allMusic = getAllMusicFromDatabase(dao);
        
        log.info("@# MusicService - emotionNumber: {}, 전체 음악 수: {}, userEmotionData: {}", 
                emotionNumber, allMusic.size(), userEmotionData);

        if (userEmotionData != null && userEmotionData instanceof Map && allMusic.size() >= 3) {
            List<MusicDTO> smartRecommendations = generateSmartRecommendations(
                    allMusic, (Map<String, Object>) userEmotionData);
            
            log.info("=== 스마트 추천 결과 ===");
            for (int i = 0; i < smartRecommendations.size(); i++) {
                MusicDTO music = smartRecommendations.get(i);
                log.info("{}위: 번호={}, 이름={}, 감정점수=[{},{},{},{},{},{}]", 
                        i + 1, music.getMusicNumber(), music.getMusicName(),
                        music.getHappy(), music.getSad(), music.getStress(),
                        music.getCalm(), music.getExcited(), music.getTired());
            }
            
            return new ArrayList<>(smartRecommendations);
        }

        // 폴백: 기존 방식
        ArrayList<MusicDTO> dtos = dao.getRandomMusic(emotionNumber);
        return dtos;
    }

    /**
     * 데이터베이스에서 모든 음악을 가져오는 메서드
     */
    private List<MusicDTO> getAllMusicFromDatabase(MusicDAO dao) {
        List<MusicDTO> allMusic = new ArrayList<>();
        
        // 모든 감정 번호에서 더 많은 음악 가져오기
        for (int i = 1; i <= 6; i++) {
            try {
                final int emotionNumber = i; // final 변수로 복사
            
                // 각 감정별로 더 많은 음악 조회 
                ArrayList<MusicDTO> emotionMusic = dao.getMusicDTO(); // 전체 음악 조회
        
                // 해당 감정 번호의 음악만 필터링
                List<MusicDTO> filteredMusic = emotionMusic.stream()
                    .filter(music -> music.getEmotionNumber() == emotionNumber)
                    .collect(Collectors.toList());
                
                allMusic.addAll(filteredMusic);
                log.info("감정 번호 {} 음악 수: {}", emotionNumber, filteredMusic.size());
            } catch (Exception e) {
                log.warn("감정 번호 {} 조회 중 오류: {}", i, e.getMessage());
            }
        }
        
        log.info("전체 조회된 음악 수: {}", allMusic.size());
        return removeDuplicates(allMusic);
    }

    /**
     * 스마트 추천 알고리즘 - 사용자 감정과 음악 감정 수치 직접 비교
     */
    private List<MusicDTO> generateSmartRecommendations(
            List<MusicDTO> musicList, Map<String, Object> userEmotionData) {
        
        // 1. 사용자 감정 벡터 추출
        double[] userEmotionVector = extractUserEmotionVector(userEmotionData);
        log.info("사용자 감정 벡터: [{}, {}, {}, {}, {}, {}]", 
                userEmotionVector[0], userEmotionVector[1], userEmotionVector[2], 
                userEmotionVector[3], userEmotionVector[4], userEmotionVector[5]);
        
        // 2. 모든 음악에 대해 사용자 감정과의 유사도 계산
        List<MusicScore> scoredMusic = new ArrayList<>();
        
        for (MusicDTO music : musicList) {
            // 음악의 감정 벡터 추출
            double[] musicVector = extractMusicEmotionVector(music);
            
            // 사용자 감정과 음악 감정 간의 유사도 계산
            double similarity = calculateCosineSimilarity(userEmotionVector, musicVector);
            
            // 약간의 무작위성 추가 (5%)
            double randomFactor = new Random().nextDouble() * 0.05;
            double finalScore = similarity + randomFactor;
            
            scoredMusic.add(new MusicScore(music, finalScore));
        }
        
        // 3. 유사도 기준으로 정렬
        scoredMusic.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        
        // 4. 상위 10% 중에서 3개 선택
        List<MusicDTO> recommendations = selectFromTopPercent(scoredMusic, 0.1, 3);
        
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
     * 음악 감정 벡터 추출 (0~1 범위로 정규화)
     */
    private double[] extractMusicEmotionVector(MusicDTO music) {
        // 0~100 범위를 0~1로 정규화
        double happy = music.getHappy() / 100.0;
        double sad = music.getSad() / 100.0;
        double stressed = music.getStress() / 100.0;
        double calm = music.getCalm() / 100.0;
        double excited = music.getExcited() / 100.0;
        double tired = music.getTired() / 100.0;
        
        return new double[] {happy, sad, stressed, calm, excited, tired};
    }
    
    /**
     * 상위 퍼센트에서 추천 선택
     */
    private List<MusicDTO> selectFromTopPercent(List<MusicScore> scoredMusic, double percent, int count) {
        if (scoredMusic.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 상위 퍼센트 계산 (최소 count개는 보장)
        int topCount = Math.max(count, (int)(scoredMusic.size() * percent));
        List<MusicScore> topCandidates = scoredMusic.subList(0, 
                Math.min(topCount, scoredMusic.size()));
        
        log.info("상위 {}% 후보 수: {} (전체: {})", (int)(percent * 100), topCandidates.size(), scoredMusic.size());
        
        // 상위 후보들 중에서 가장 점수가 높은 count개 선택
        List<MusicDTO> selected = new ArrayList<>();
        Set<String> usedNames = new HashSet<>();
        
        for (MusicScore score : topCandidates) {
            if (selected.size() >= count) break;
            
            MusicDTO music = score.getMusic();
            if (!usedNames.contains(music.getMusicName())) {
                selected.add(music);
                usedNames.add(music.getMusicName());
                
                log.info("선택: {} (유사도: {}, 감정번호: {})", 
                        music.getMusicName(), 
                        String.format("%.4f", score.getScore()), 
                        music.getEmotionNumber());
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
     * 음악 카테고리 분류
     */
//    private String categorizeMusic(MusicDTO music) {
//        String name = music.getMusicName().toLowerCase();
//        
//        if (name.contains("발라드") || name.contains("ballad")) {
//            return "발라드";
//        } else if (name.contains("댄스") || name.contains("dance") || name.contains("edm")) {
//            return "댄스";
//        } else if (name.contains("힙합") || name.contains("hiphop") || name.contains("rap")) {
//            return "힙합";
//        } else if (name.contains("록") || name.contains("rock")) {
//            return "록";
//        } else if (name.contains("재즈") || name.contains("jazz")) {
//            return "재즈";
//        } else if (name.contains("클래식") || name.contains("classic")) {
//            return "클래식";
//        } else if (name.contains("팝") || name.contains("pop")) {
//            return "팝";
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

    private List<MusicDTO> removeDuplicates(List<MusicDTO> musicList) {
        Map<String, MusicDTO> uniqueMap = new LinkedHashMap<>();
    
        for (MusicDTO music : musicList) {
            // 음악 번호만으로 중복 체크 (이름은 유사할 수 있음)
            String key = String.valueOf(music.getMusicNumber());
            if (!uniqueMap.containsKey(key)) {
                uniqueMap.put(key, music);
            }
        }
    
        log.info("중복 제거 후 음악 수: {} → {}", musicList.size(), uniqueMap.size());
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
    private static class MusicScore {
        private final MusicDTO music;
        private final double score;

        public MusicScore(MusicDTO music, double score) {
            this.music = music;
            this.score = score;
        }

        public MusicDTO getMusic() { return music; }
        public double getScore() { return score; }
    }
}
