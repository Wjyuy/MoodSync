package com.boot.userRecord.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookExceptEmotionDTO {
	private Long bookNumber;
    private String bookName;
    private String bookAuthor;
}
