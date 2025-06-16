package com.boot.tensor.service;

import java.util.ArrayList;

import com.boot.tensor.dto.ActingDTO;

public interface ActingService {
	public ArrayList<ActingDTO> getActingDTO();

	public ArrayList<ActingDTO> getRandomActing(int emotionNumber, Object userEmotionData);
}
