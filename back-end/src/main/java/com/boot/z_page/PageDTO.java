package com.boot.z_page;


import com.boot.z_page.criteria.CriteriaDTO;

import lombok.Data;

@Data
public class PageDTO {
	private int startPage;// 시작페이지:1, 11 . . .
	private int endPage;// 끝페이지:10, 20 . . .
	private boolean prev, next;
	private int total;
	private CriteriaDTO criteriaDTO;


	public PageDTO(int total, CriteriaDTO criteriaDTO) {
		this.total = total;
		this.criteriaDTO = criteriaDTO;

		// ex> 3페이지 = (3 / 10) -> 0.3 -> (1 * 10) = 10(끝페이지)
		// ex> 11페이지 = (11 / 10) -> 1.1 -> (2 * 10) = 20(끝페이지)
		// Math.ceil => 올림
		this.endPage = (int) (Math.ceil(criteriaDTO.getPageNum() / 10.0)) * 10;

		// ex> 10-9=1페이지
		// ex> 20-9=11페이지
		this.startPage = this.endPage - 9;

		// ex> total: 300, 현재 페이지: 3 -> endPage: 10 => 300*1.0 / 10 => 30 페이지
		// ex> total: 70, 현재 페이지: 3 -> endPage: 10 => 70*1.0 / 10 => 7 페이지
		int realEnd = (int) (Math.ceil((total * 1.0) / criteriaDTO.getAmount()));

		// ex> 7페이지 <= 10페이지 : endPage = 7페이지(realEnd)
		if (realEnd <= this.endPage) {
			this.endPage = realEnd;
		}

		// 1페이지보다 크면 존재 -> 참이고 아님 거짓으로 없음
		this.prev = this.startPage > 1;

		// ex> 10페이지 < 30페이지
		this.next = this.endPage < realEnd;
	}

}