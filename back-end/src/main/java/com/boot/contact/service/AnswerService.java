package com.boot.contact.service;

import com.boot.contact.dto.AnswerDTO;

public interface AnswerService {
	public int saveAnswer(AnswerDTO answerDTO);

	// 답변달리면 상태변경
	public void changeContactStatus(int contactId);

	// 답변가져오기(사용자 보기용)
	public AnswerDTO getAnswer(int contactId);
}
