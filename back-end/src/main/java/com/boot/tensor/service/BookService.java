package com.boot.tensor.service;

import java.util.ArrayList;

import com.boot.tensor.dto.BookDTO;

public interface BookService {
	public ArrayList<BookDTO> getBookDTO();

	public ArrayList<BookDTO> getRandomBook(int emotionNumber, Object userEmotionData);
}
