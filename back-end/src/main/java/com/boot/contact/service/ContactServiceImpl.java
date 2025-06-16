package com.boot.contact.service;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.contact.dao.ContactDAO;
import com.boot.contact.dto.ContactDTO;
import com.boot.z_page.criteria.CriteriaDTO;

@Service("/ContactService")
public class ContactServiceImpl implements ContactService {

	@Autowired
	private SqlSession sqlsession;

	@Override
	public int createContact(int userNumber, String contactTitle, String contactContent) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.createContact(userNumber, contactTitle, contactContent);
	}

	@Override
	public int readContact(int userNumber, String contactTitle, String contactContent) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.readContact(userNumber, contactTitle, contactContent);
	}

	@Override
	public int updateContact(int userNumber, int contactId, String contactTitle, String contactContent) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.updateContact(userNumber, contactId, contactTitle, contactContent);
	}

	@Override
	public int deleteContact(int userNumber, int contactId) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.deleteContact(userNumber, contactId);
	}

	@Override
	public ArrayList<ContactDTO> allReadContact(CriteriaDTO criteriaDTO) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		ArrayList<ContactDTO> list = dao.allReadContact(criteriaDTO);
		return list;
	}

	@Override
	public int getTotalCount(CriteriaDTO criteriaDTO) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.getTotalCount(criteriaDTO);
	}

	@Override
	public ArrayList<ContactDTO> onlyUserContact(CriteriaDTO criteriaDTO) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		ArrayList<ContactDTO> list = dao.onlyUserContact(criteriaDTO);
		return list;
	}

	@Override
	public int getUserContactCount(CriteriaDTO criteriaDTO) {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.getUserContactCount(criteriaDTO);
	}

	@Override
	public int getNotyetAnswer() {
		ContactDAO dao = sqlsession.getMapper(ContactDAO.class);
		return dao.getNotyetAnswer();
	}

}
