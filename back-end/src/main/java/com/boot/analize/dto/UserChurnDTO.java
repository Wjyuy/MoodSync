package com.boot.analize.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserChurnDTO {
	private double feedbackScore; // 피드백 평균 점수
	private int recommendCount; // 추천/활동 이용 횟수
	private int recentActivityCount; // 최근 일주일 이내 활동 횟수
	private int churn; // 이탈 여부 (0 = 잔류, 1 = 이탈)
}
