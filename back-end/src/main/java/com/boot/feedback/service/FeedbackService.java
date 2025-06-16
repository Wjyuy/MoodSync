package com.boot.feedback.service;

import java.util.ArrayList;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

import com.boot.feedback.dto.FeedbackDTO;
import com.boot.z_page.criteria.CriteriaDTO;

public interface FeedbackService {
	// 피드백 C
	public int createFeedback(@Param("userNumber") int userNumber, @Param("feedbackCategory") String feedbackCategory,
			@Param("feedbackScore") int feedbackScore, @Param("feedbackContent") String feedbackContent);

	// 피드백 R (디테일)
	public int readFeedback(@Param("userNumber") int userNumber, @Param("feedbackCategory") String feedbackCategory,
			@Param("feedbackScore") int feedbackScore, @Param("feedbackContent") String feedbackContent);

	// 피드백 D (관리자용)
	public int deleteFeedbackAdmin(@Param("contactId") int contactId);

	// 피드백 R(전체 / 페이징필요)
	public ArrayList<FeedbackDTO> allReadFeedback(CriteriaDTO criteriaDTO);

	// 전체 불러오기 (페이징용)
	public int getTotalCount(CriteriaDTO criteriaDTO);

	// 통계 관련 메서드 추가
	public int getTotalFeedbacks();

	public Double getAverageScore();

	public ArrayList<Map<String, Object>> getFeedbackByCategory();

	public ArrayList<Map<String, Object>> getFeedbackByScore();
	/**
	 * 만약 사용자가 직접 보게 하려면 아래꺼까지 추가 구현 문의처럼 똑같이
	 */
	// 피드백 D
//	public int deleteFeedback();

	// 피드백 U
//	public int updateFeedback();

	// 사용자 본인꺼만 불러오기(일단 페이징 처리)
//	public ArrayList<FeedbackDTO> onlyUserFeedback(CriteriaDTO criteriaDTO);

	// 사용자 본인꺼 전체 갯수
//	public int getUserFeedbackCount(CriteriaDTO criteriaDTO);
}
