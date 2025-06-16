package com.boot.analize.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.analize.dao.AnalizeFeedbackDAO;
import com.boot.analize.dto.AnalizeFeedbackDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FeedbackAnalize {

	@Autowired
	private SqlSession session;

	public List<AnalizeFeedbackDTO> countFeedback(String created_date) {

		AnalizeFeedbackDAO dao = session.getMapper(AnalizeFeedbackDAO.class);
		List<AnalizeFeedbackDTO> dtos = dao.getFeedbackCount(created_date);

		return dtos;
	}
}
