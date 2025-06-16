package com.boot.tensor.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Param;

import com.boot.tensor.dto.BookDTO;

public interface BookDAO {
	public ArrayList<BookDTO> getBookDTO();

	public ArrayList<BookDTO> getRandomBook(@Param("bookSubNumber") int bookSubNumber);
//	public ArrayList<BookDTO> getRandomBook(@Param("emotionNumber") int emotionNumber, @Param("bookSubNumber") int bookSubNumber);
}
