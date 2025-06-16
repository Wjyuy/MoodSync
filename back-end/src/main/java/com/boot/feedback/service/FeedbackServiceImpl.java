package com.boot.feedback.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.feedback.dao.FeedbackDAO;
import com.boot.feedback.dto.FeedbackDTO;
import com.boot.z_page.criteria.CriteriaDTO;

@Service
public class FeedbackServiceImpl implements FeedbackService {
	@Autowired
	private SqlSession sqlsession;

	@Override
	public int createFeedback(int userNumber, String feedbackCategory, int feedbackScore, String feedbackContent) {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);

		Map<String, Object> params = new HashMap<>();
		params.put("userNumber", userNumber);
		params.put("feedbackCategory", feedbackCategory);
		params.put("feedbackScore", feedbackScore);
		params.put("feedbackContent", feedbackContent);

		int result = dao.createFeedback(params);
		if (result > 0) {
			return (Integer) params.get("feedbackId");
		}
		return 0;
	}

	@Override
	public int readFeedback(int userNumber, String feedbackCategory, int feedbackScore, String feedbackContent) {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);

		Map<String, Object> params = new HashMap<>();
		params.put("userNumber", userNumber);
		params.put("feedbackCategory", feedbackCategory);
		params.put("feedbackScore", feedbackScore);
		params.put("feedbackContent", feedbackContent);

		return dao.readFeedback(params);
	}

	@Override
	public int deleteFeedbackAdmin(int feedbackId) {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);

		Map<String, Object> params = new HashMap<>();
		params.put("feedbackId", feedbackId);

		return dao.deleteFeedbackAdmin(params);
	}

	@Override
	public ArrayList<FeedbackDTO> allReadFeedback(CriteriaDTO criteriaDTO) {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);
		ArrayList<FeedbackDTO> list = dao.allReadFeedback(criteriaDTO);
		return list;
	}

	@Override
	public int getTotalCount(CriteriaDTO criteriaDTO) {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);
		return dao.getTotalCount(criteriaDTO);
	}

	@Override
	public int getTotalFeedbacks() {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);
		return dao.getTotalFeedbacks();
	}

	@Override
	public Double getAverageScore() {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);
		return dao.getAverageScore();
	}

	@Override
	public ArrayList<Map<String, Object>> getFeedbackByCategory() {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);
		return dao.getFeedbackByCategory();
	}

	@Override
	public ArrayList<Map<String, Object>> getFeedbackByScore() {
		FeedbackDAO dao = sqlsession.getMapper(FeedbackDAO.class);
		return dao.getFeedbackByScore();
	}
}