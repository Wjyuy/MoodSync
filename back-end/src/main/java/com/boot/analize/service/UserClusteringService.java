package com.boot.analize.service;

import java.util.*;
import org.springframework.stereotype.Service;
import com.boot.analize.dao.UserClusteringDAO;
import com.boot.analize.dto.UserClusteringDTO;

@Service
public class UserClusteringService {

    private final UserClusteringDAO userClusteringDAO;

    public UserClusteringService(UserClusteringDAO userClusteringDAO) {
        this.userClusteringDAO = userClusteringDAO;
    }

    public List<UserClusteringDTO> collectEmotionData(String created_at) {
        return userClusteringDAO.findEmotionDataByDate(created_at);
    }

    // 감정 이름 리스트
    private final List<String> emotions = Arrays.asList("happy", "sad", "tired", "excited", "calm", "stress");

    public Map<String, Map<String, Object>> analyzeEmotionCohesion(String created_at) {
        List<UserClusteringDTO> data = collectEmotionData(created_at);

        // 감정별 값 모음
        Map<String, List<Double>> emotionMap = new HashMap<>();
        for (String emotion : emotions) {
            emotionMap.put(emotion, new ArrayList<>());
        }

        for (UserClusteringDTO dto : data) {
            emotionMap.get("happy").add((double) dto.getHappy());
            emotionMap.get("sad").add((double) dto.getSad());
            emotionMap.get("tired").add((double) dto.getTired());
            emotionMap.get("excited").add((double) dto.getExcited());
            emotionMap.get("calm").add((double) dto.getCalm());
            emotionMap.get("stress").add((double) dto.getStress());
        }

        Map<String, Map<String, Object>> result = new LinkedHashMap<>();

        for (String baseEmotion : emotions) {
            List<Double> baseValues = emotionMap.get(baseEmotion);

            // 1. 응집도가 가장 높은 구간 계산
            int clusterValue = findMostCohesiveCluster(baseValues);

            // 2. 피어슨 상관계수 계산
            String mostCohesiveEmotion = null;
            double maxCorrelation = Double.NEGATIVE_INFINITY;

            for (String targetEmotion : emotions) {
                if (baseEmotion.equals(targetEmotion)) continue;

                double corr = calculatePearsonCorrelation(baseValues, emotionMap.get(targetEmotion));
                if (corr > maxCorrelation) {
                    maxCorrelation = corr;
                    mostCohesiveEmotion = targetEmotion;
                }
            }

            Map<String, Object> emotionResult = new LinkedHashMap<>();
            emotionResult.put("mostCohesiveEmotion", mostCohesiveEmotion);
            emotionResult.put("correlationCoefficient", maxCorrelation);
            emotionResult.put("mostCohesiveValue", clusterValue);

            result.put(baseEmotion, emotionResult);
        }

        return result;
    }

    // 가장 응집도가 높은 10 단위 구간의 중심값 찾기
    private int findMostCohesiveCluster(List<Double> values) {
        Map<Integer, Integer> countMap = new HashMap<>();
        for (double value : values) {
            int bin = ((int) value / 10) * 10; // 0~9 -> 0, 10~19 -> 10 ...
            countMap.put(bin, countMap.getOrDefault(bin, 0) + 1);
        }

        int maxBin = -1;
        int maxCount = -1;
        for (Map.Entry<Integer, Integer> entry : countMap.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                maxBin = entry.getKey();
            }
        }

        return maxBin + 5; // 중심값
    }

    // 피어슨 상관계수 계산
    private double calculatePearsonCorrelation(List<Double> x, List<Double> y) {
        if (x.size() != y.size() || x.size() == 0) return 0.0;

        int n = x.size();
        double sumX = 0, sumY = 0, sumXY = 0;
        double sumX2 = 0, sumY2 = 0;

        for (int i = 0; i < n; i++) {
            double xi = x.get(i);
            double yi = y.get(i);
            sumX += xi;
            sumY += yi;
            sumXY += xi * yi;
            sumX2 += xi * xi;
            sumY2 += yi * yi;
        }

        double numerator = n * sumXY - sumX * sumY;
        double denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

        if (denominator == 0) return 0.0;
        return numerator / denominator;
    }
}
