package com.boot.contact.service;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.boot.contact.dto.ContactDTO;
import com.boot.z_page.criteria.CriteriaDTO;

public interface ContactService {

	// 문의하기 C
	public int createContact(@Param("userNumber") int userNumber, @Param("contactTitle") String contactTitle,
			@Param("contactContent") String contactContent);

	// 문의하기 R
	public int readContact(@Param("userNumber") int userNumber, @Param("contactTitle") String contactTitle,
			@Param("contactContent") String contactContent);

	// 문의하기 U
	public int updateContact(@Param("userNumber") int userNumber, @Param("contactId") int contactId,
			@Param("contactTitle") String contactTitle, @Param("contactContent") String contactContent);

	// 문의하기 D
	public int deleteContact(@Param("userNumber") int userNumber, @Param("contactId") int contactId);

	// 문의하기 R(전체 / 페이징필요)
	public ArrayList<ContactDTO> allReadContact(CriteriaDTO criteriaDTO);

	// 전체 불러오기 (페이징용)
	public int getTotalCount(CriteriaDTO criteriaDTO);

	// 사용자 본인꺼만 불러오기(일단 페이징 처리)
	public ArrayList<ContactDTO> onlyUserContact(CriteriaDTO criteriaDTO);

	// 사용자 본인꺼 전체 갯수
	public int getUserContactCount(CriteriaDTO criteriaDTO);

	// 답변 안한거 가져오기
	public int getNotyetAnswer();
}
