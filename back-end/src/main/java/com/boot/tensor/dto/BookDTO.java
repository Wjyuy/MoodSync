package com.boot.tensor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookDTO {
	private int bookNumber;
	private int emotionNumber;
	private String bookName;
	private String bookAuthor;
	private int happy;
	private int sad;
	private int stress;
	private int calm;
	private int excited;
	private int tired;
}
