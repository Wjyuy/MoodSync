package com.boot.tensor.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.boot.tensor.dto.MusicDTO;

public interface MusicDAO {
	public ArrayList<MusicDTO> getMusicDTO();

	public ArrayList<MusicDTO> getRandomMusic(@Param("musicSubNumber") int musicSubNumber);
}
