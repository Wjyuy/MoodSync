package com.boot.analize.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.boot.analize.dto.AnalizeContactDTO;

public interface AnalizeContactDAO {
	// 데이터 분석 =================
	public List<AnalizeContactDTO> getTimeContactCount(@Param("createdTime") String createdTime);
}
