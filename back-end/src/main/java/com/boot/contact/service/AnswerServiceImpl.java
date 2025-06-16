package com.boot.contact.service;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.contact.dao.AnswerDAO;
import com.boot.contact.dto.AnswerDTO;
import com.boot.contact.service.AnswerService;

@Service
public class AnswerServiceImpl implements AnswerService {

	@Autowired
	private SqlSession session;

	@Override
    public int saveAnswer(AnswerDTO answerDTO) {
    	AnswerDAO dao = session.getMapper(AnswerDAO.class);
        return dao.insertAnswer(answerDTO);
    }

	@Override
	public void changeContactStatus(int contactId) {
		AnswerDAO dao = session.getMapper(AnswerDAO.class);
		dao.changeContactStatus(contactId);
	}

	@Override
	public AnswerDTO getAnswer(int contactId) {
		AnswerDAO dao = session.getMapper(AnswerDAO.class);
		return dao.getAnswer(contactId);
	}
}
