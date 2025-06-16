package com.boot.tensor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActingDTO {
	private int actingNumber;
	private int emotionNumber;
	private String actingName;
	private int happy;
	private int sad;
	private int stress;
	private int calm;
	private int excited;
	private int tired;
}
