package com.boot.analize.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.analize.dao.UserChurnDAO;
import com.boot.analize.dto.UserChurnDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ChurnDetectionService {
	@Autowired
	private SqlSession session;

	public List<UserChurnDTO> getChurnDTO() {
		UserChurnDAO dao = session.getMapper(UserChurnDAO.class);
		List<UserChurnDTO> dtos = dao.getUserChurnDTO();
		return dtos;
	}
}
