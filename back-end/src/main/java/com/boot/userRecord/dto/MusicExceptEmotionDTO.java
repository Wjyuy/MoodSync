package com.boot.userRecord.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MusicExceptEmotionDTO {
	private Long musicNumber;
    private String musicName;
    private String musicAuthor;
}
