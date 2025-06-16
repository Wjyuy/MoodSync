package com.boot.tensor.service;

import java.util.*;
import java.util.stream.Collectors;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.tensor.dao.BookDAO;
import com.boot.tensor.dto.BookDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private SqlSession session;

    @Override
    public ArrayList<BookDTO> getRandomBook(int bookSubNumber, Object userEmotionData) {
        BookDAO dao = session.getMapper(BookDAO.class);
        
        // 전체 책 풀을 먼저 가져오기
        List<BookDTO> allBooks = getAllBooksFromDatabase(dao);
        
        log.info("@# BookService - bookSubNumber: {}, 전체 책 수: {}, userEmotionData: {}", 
                bookSubNumber, allBooks.size(), userEmotionData);

        if (userEmotionData != null && userEmotionData instanceof Map && allBooks.size() >= 3) {
            // 개선된 추천 알고리즘 적용
            List<BookDTO> smartRecommendations = generateSmartRecommendations(
                    allBooks, (Map<String, Object>) userEmotionData);
            
            log.info("=== 스마트 추천 결과 ===");
            for (int i = 0; i < smartRecommendations.size(); i++) {
                BookDTO book = smartRecommendations.get(i);
                log.info("{}위: 번호={}, 이름={}, 감정점수=[{},{},{},{},{},{}]", 
                        i + 1, book.getBookNumber(), book.getBookName(),
                        book.getHappy(), book.getSad(), book.getStress(),
                        book.getCalm(), book.getExcited(), book.getTired());
            }
            
            return new ArrayList<>(smartRecommendations);
        }

        // 폴백: 기존 방식
        ArrayList<BookDTO> dtos = dao.getRandomBook(bookSubNumber);
        return dtos;
    }

    /**
     * 데이터베이스에서 모든 책을 가져오는 메서드
     */
    private List<BookDTO> getAllBooksFromDatabase(BookDAO dao) {
        List<BookDTO> allBooks = new ArrayList<>();
        
        // 모든 감정 번호에서 더 많은 책 가져오기
        for (int i = 1; i <= 6; i++) {
            try {
                final int emotionNumber = i; // final 변수로 복사
            
                ArrayList<BookDTO> emotionBooks = dao.getBookDTO(); // 전체 책 조회
        
                // 해당 감정 번호의 책만 필터링
                List<BookDTO> filteredBooks = emotionBooks.stream()
                    .filter(book -> book.getEmotionNumber() == emotionNumber)
                    .collect(Collectors.toList());
                
                allBooks.addAll(filteredBooks);
                log.info("감정 번호 {} 책 수: {}", emotionNumber, filteredBooks.size());
            } catch (Exception e) {
                log.warn("감정 번호 {} 조회 중 오류: {}", i, e.getMessage());
            }
        }
        
        log.info("전체 조회된 책 수: {}", allBooks.size());
        return removeDuplicates(allBooks);
    }

    /**
     * 스마트 추천 알고리즘 - 사용자 감정과 책 감정 수치 직접 비교
     */
    private List<BookDTO> generateSmartRecommendations(
            List<BookDTO> books, Map<String, Object> userEmotionData) {
        
        // 1. 사용자 감정 벡터 추출
        double[] userEmotionVector = extractUserEmotionVector(userEmotionData);
        log.info("사용자 감정 벡터: [{}, {}, {}, {}, {}, {}]", 
                userEmotionVector[0], userEmotionVector[1], userEmotionVector[2], 
                userEmotionVector[3], userEmotionVector[4], userEmotionVector[5]);
        
        // 2. 모든 책에 대해 사용자 감정과의 유사도 계산
        List<BookScore> scoredBooks = new ArrayList<>();
        
        for (BookDTO book : books) {
            // 책의 감정 벡터 추출
            double[] bookVector = extractBookEmotionVector(book);
            
            // 사용자 감정과 책 감정 간의 유사도 계산
            double similarity = calculateCosineSimilarity(userEmotionVector, bookVector);
            
            // 약간의 무작위성 추가 (5%)
            double randomFactor = new Random().nextDouble() * 0.05;
            double finalScore = similarity + randomFactor;
            
            scoredBooks.add(new BookScore(book, finalScore));
        }
        
        // 3. 유사도 기준으로 정렬
        scoredBooks.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));
        
        // 4. 상위 10% 중에서 3개 선택
        List<BookDTO> recommendations = selectFromTopPercent(scoredBooks, 0.1, 3);
        
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
     * 책 감정 벡터 추출 (0~1 범위로 정규화)
     */
    private double[] extractBookEmotionVector(BookDTO book) {
        // 0~100 범위를 0~1로 정규화
        double happy = book.getHappy() / 100.0;
        double sad = book.getSad() / 100.0;
        double stressed = book.getStress() / 100.0;
        double calm = book.getCalm() / 100.0;
        double excited = book.getExcited() / 100.0;
        double tired = book.getTired() / 100.0;
        
        return new double[] {happy, sad, stressed, calm, excited, tired};
    }
    
    /**
     * 상위 퍼센트에서 추천 선택
     */
    private List<BookDTO> selectFromTopPercent(List<BookScore> scoredBooks, double percent, int count) {
        if (scoredBooks.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 상위 퍼센트 계산 (최소 count개는 보장)
        int topCount = Math.max(count, (int)(scoredBooks.size() * percent));
        List<BookScore> topCandidates = scoredBooks.subList(0, 
                Math.min(topCount, scoredBooks.size()));
        
        log.info("상위 {}% 후보 수: {} (전체: {})", (int)(percent * 100), topCandidates.size(), scoredBooks.size());
        
        // 상위 후보들 중에서 가장 점수가 높은 count개 선택
        List<BookDTO> selected = new ArrayList<>();
        Set<String> usedNames = new HashSet<>();
        
        for (BookScore score : topCandidates) {
            if (selected.size() >= count) break;
            
            BookDTO book = score.getBook();
            if (!usedNames.contains(book.getBookName())) {
                selected.add(book);
                usedNames.add(book.getBookName());
                
                log.info("선택: {} (유사도: {}, 감정번호: {})", 
                        book.getBookName(), 
                        String.format("%.4f", score.getScore()), 
                        book.getEmotionNumber());
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
     * 책 카테고리 분류
     */
//    private String categorizeBook(BookDTO book) {
//        String name = book.getBookName().toLowerCase();
//        
//        if (name.contains("소설") || name.contains("문학")) {
//            return "소설";
//        } else if (name.contains("자기계발") || name.contains("성공") || name.contains("동기")) {
//            return "자기계발";
//        } else if (name.contains("과학") || name.contains("기술")) {
//            return "과학기술";
//        } else if (name.contains("역사") || name.contains("전기")) {
//            return "역사";
//        } else if (name.contains("철학") || name.contains("사상")) {
//            return "철학";
//        } else if (name.contains("경제") || name.contains("경영")) {
//            return "경제경영";
//        } else if (name.contains("예술") || name.contains("미술")) {
//            return "예술";
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

    private List<BookDTO> removeDuplicates(List<BookDTO> books) {
        Map<String, BookDTO> uniqueMap = new LinkedHashMap<>();
    
        for (BookDTO book : books) {
            // 책 번호만으로 중복 체크 (이름은 유사할 수 있음)
            String key = String.valueOf(book.getBookNumber());
            if (!uniqueMap.containsKey(key)) {
                uniqueMap.put(key, book);
            }
        }
    
        log.info("중복 제거 후 책 수: {} → {}", books.size(), uniqueMap.size());
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
    private static class BookScore {
        private final BookDTO book;
        private final double score;

        public BookScore(BookDTO book, double score) {
            this.book = book;
            this.score = score;
        }

        public BookDTO getBook() { return book; }
        public double getScore() { return score; }
    }

    @Override
    public ArrayList<BookDTO> getBookDTO() {
        BookDAO dao = session.getMapper(BookDAO.class);
        ArrayList<BookDTO> resultList = dao.getBookDTO();
        return resultList;
    }
}
