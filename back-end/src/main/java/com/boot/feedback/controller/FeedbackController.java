package com.boot.feedback.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.feedback.dto.FeedbackDTO;
import com.boot.feedback.service.FeedbackService;
import com.boot.user.dto.BasicUserDTO;
import com.boot.z_page.criteria.CriteriaDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/create_feedback")
    public ResponseEntity<?> createFeedback(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
        try {
            BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

            if (userDTO == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            int userNumber = userDTO.getUserNumber();
            String feedbackCategory = param.get("feedback_category");
            int feedbackScore = Integer.parseInt(param.get("feedback_score"));
            String feedbackContent = param.get("feedback_content");

            log.info("피드백 생성 요청: userNumber={}, category={}, score={}", userNumber, feedbackCategory, feedbackScore);

            // 입력값 검증
            if (feedbackCategory == null || feedbackCategory.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "피드백 카테고리를 선택해주세요.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            if (feedbackScore < 1 || feedbackScore > 5) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "평점은 1~5점 사이여야 합니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            if (feedbackContent == null || feedbackContent.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "피드백 내용을 입력해주세요.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            int result = feedbackService.createFeedback(userNumber, feedbackCategory, feedbackScore, feedbackContent);

            Map<String, Object> response = new HashMap<>();
            if (result > 0) {
                response.put("status", "success");
                response.put("message", "피드백이 성공적으로 등록되었습니다.");
                response.put("feedbackId", result);
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                response.put("status", "error");
                response.put("message", "피드백 등록에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (NumberFormatException e) {
            log.error("피드백 점수 파싱 오류: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "올바른 점수를 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("피드백 생성 중 오류 발생: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/read_feedback")
    public ResponseEntity<?> readFeedback(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
        try {
            BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

            if (userDTO == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            int userNumber = userDTO.getUserNumber();
            String feedbackCategory = param.get("feedback_category");
            int feedbackScore = Integer.parseInt(param.get("feedback_score"));
            String feedbackContent = param.get("feedback_content");

            log.info("피드백 조회 요청: userNumber={}, category={}", userNumber, feedbackCategory);

            int result = feedbackService.readFeedback(userNumber, feedbackCategory, feedbackScore, feedbackContent);

            Map<String, Object> response = new HashMap<>();
            if (result > 0) {
                response.put("status", "success");
                response.put("message", "피드백 조회 성공");
                response.put("feedbackId", result);
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "해당 피드백을 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

        } catch (NumberFormatException e) {
            log.error("피드백 점수 파싱 오류: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "올바른 점수를 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("피드백 조회 중 오류 발생: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/delete_feedback_admin")
    public ResponseEntity<?> deleteFeedbackAdmin(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
        try {
            BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

            if (userDTO == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // 관리자 권한 체크 (필요시 추가)
            // if (!userDTO.isAdmin()) { ... }

            int feedbackId = Integer.parseInt(param.get("feedbackId"));

            log.info("피드백 삭제 요청 (관리자): feedbackId={}", feedbackId);

            int result = feedbackService.deleteFeedbackAdmin(feedbackId);

            Map<String, Object> response = new HashMap<>();
            if (result > 0) {
                response.put("status", "success");
                response.put("message", "피드백이 성공적으로 삭제되었습니다.");
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "피드백 삭제에 실패했습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

        } catch (NumberFormatException e) {
            log.error("피드백 ID 파싱 오류: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "올바른 피드백 ID를 입력해주세요.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            log.error("피드백 삭제 중 오류 발생: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/all_feedbacks")
    public ResponseEntity<?> getAllFeedbacks(@RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int amount, HttpServletRequest request) {
        try {
            BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

            if (userDTO == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            log.info("전체 피드백 조회 요청: pageNum={}, amount={}", pageNum, amount);

            // CriteriaDTO 생성
            CriteriaDTO criteriaDTO = new CriteriaDTO(pageNum, amount);

            // 피드백 목록 조회
            ArrayList<FeedbackDTO> feedbackList = feedbackService.allReadFeedback(criteriaDTO);

            // 총 개수 조회
            int totalCount = feedbackService.getTotalCount(criteriaDTO);

            // 페이징 정보 계산
            int totalPages = (int) Math.ceil((double) totalCount / amount);
            boolean hasNext = pageNum < totalPages;
            boolean hasPrevious = pageNum > 1;

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("data", feedbackList);
            response.put("pagination", Map.of("currentPage", pageNum, "pageSize", amount, "totalCount", totalCount,
                    "totalPages", totalPages, "hasNext", hasNext, "hasPrevious", hasPrevious));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("전체 피드백 조회 중 오류 발생: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/feedback_stats")
    public ResponseEntity<?> getFeedbackStats(HttpServletRequest request) {
        try {
            BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

            if (userDTO == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // 관리자 권한 확인 (필요한 경우)
            if (userDTO.getUserAdmin() != 1) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "관리자 권한이 필요합니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
            }

            log.info("피드백 통계 조회 요청");

            // 기본 통계
            int totalFeedbacks = feedbackService.getTotalFeedbacks();
            Double averageScore = feedbackService.getAverageScore();
            
            // 상세 통계
            ArrayList<Map<String, Object>> categoryStats = feedbackService.getFeedbackByCategory();
            ArrayList<Map<String, Object>> scoreStats = feedbackService.getFeedbackByScore();

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("totalFeedbacks", totalFeedbacks);
            response.put("averageScore", averageScore != null ? Math.round(averageScore * 100.0) / 100.0 : 0.0);
            response.put("categoryStats", categoryStats);
            response.put("scoreStats", scoreStats);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("피드백 통계 조회 중 오류 발생: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}