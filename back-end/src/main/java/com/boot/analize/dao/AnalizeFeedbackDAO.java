package com.boot.analize.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.boot.analize.dto.AnalizeFeedbackDTO;

public interface AnalizeFeedbackDAO {

	public List<AnalizeFeedbackDTO> getFeedbackCount(@Param("created_date") String created_date);
}
