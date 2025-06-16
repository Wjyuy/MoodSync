package com.boot.crawling.service;

public interface BigDataBookService {
	public String searchBooks(String srchTarget, String query, int pageSize, int pageNum, String sort, String category);
}
