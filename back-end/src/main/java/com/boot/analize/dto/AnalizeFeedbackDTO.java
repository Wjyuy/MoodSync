package com.boot.analize.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalizeFeedbackDTO {
	private String feedback_category;
	private int count;
	private double avg_score;
}
