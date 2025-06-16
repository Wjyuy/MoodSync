package com.boot.analize.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.analize.dao.AnalizeContactDAO;
import com.boot.analize.dto.AnalizeContactDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ContactAnalize {

	@Autowired
	private SqlSession session;

	public List<AnalizeContactDTO> countContact(String createdTime) {
		log.info("@#!@#$ countContact");
		log.info("@#!@#$ created_date =>" + createdTime);

		AnalizeContactDAO dao = session.getMapper(AnalizeContactDAO.class);
		List<AnalizeContactDTO> dtos = dao.getTimeContactCount(createdTime);

		log.info("@# dtos =>" + dtos);

		return dtos;
	}

}
