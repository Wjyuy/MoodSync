package com.boot.tensor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserEmotionVector {
	private Long userId;
	private double[] vector;
}
