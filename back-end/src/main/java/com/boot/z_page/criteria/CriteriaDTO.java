package com.boot.z_page.criteria;

import lombok.Data;

@Data
public class CriteriaDTO {
    private int pageNum; // 게시글 페이지 번호
    private int commentPageNum; // 댓글 페이지 번호
    private int amount; // 페이지당 글 갯수
    private String type;
    private String keyword;
    private int userNumber;

    public CriteriaDTO() {
        this(1, 1, 10);
    }

    public CriteriaDTO(int pageNum, int commentPageNum, int amount) {
        this.pageNum = pageNum;
        this.commentPageNum = commentPageNum;
        this.amount = amount;
    }
    
    public CriteriaDTO(int pageNum, int amount) {
        this.pageNum = pageNum;
        this.commentPageNum = 1; // 기본값 1로 설정
        this.amount = amount;
    }
}