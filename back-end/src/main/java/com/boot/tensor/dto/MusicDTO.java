package com.boot.tensor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MusicDTO {
	private int musicNumber;
	private int emotionNumber;
	private String musicName;
	private String musicAuthor;
	private int happy;
	private int sad;
	private int stress;
	private int calm;
	private int excited;
	private int tired;
}
