package com.boot.contact.dao;

import com.boot.contact.dto.AnswerDTO;

public interface AnswerDAO {
	// 문의에 답변
	public int insertAnswer(AnswerDTO answerDTO);
	
	// 답변달리면 상태변경
	public void changeContactStatus(int contactId);
	
	// 답변가져오기(사용자 보기용)
	public AnswerDTO getAnswer(int contactId);
}
