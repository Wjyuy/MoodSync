package com.boot.tensor.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.boot.tensor.dto.ActingDTO;

public interface ActingDAO {
	public ArrayList<ActingDTO> getActingDTO();

	public ArrayList<ActingDTO> getRandomActing(@Param("actingSubNumber") int actingSubNumber);
}
