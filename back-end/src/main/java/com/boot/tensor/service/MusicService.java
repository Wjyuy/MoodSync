package com.boot.tensor.service;

import java.util.ArrayList;

import com.boot.tensor.dto.MusicDTO;

public interface MusicService {
	public ArrayList<MusicDTO> getMusicDTO();

	public ArrayList<MusicDTO> getRandomMusic(int emotionNumber, Object userEmotionData);
}
