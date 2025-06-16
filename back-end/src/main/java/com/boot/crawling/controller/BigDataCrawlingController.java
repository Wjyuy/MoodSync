package com.boot.crawling.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.crawling.service.BigDataBookService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class BigDataCrawlingController {
	// 여기서 부터는 국립 중앙 도서관 및 공공데이터 관련 빅데이터 처리 부분입니다.(elastic / docker / mongoDB /
	// monstash)

	@Autowired
	private BigDataBookService bigDataBookService;

	@GetMapping("/book-crawl")
	public ResponseEntity<?> bookCrawling(@RequestParam(defaultValue = "total") String srchTarget,
			@RequestParam(defaultValue = "") String query, @RequestParam(defaultValue = "10") int pageSize,
			@RequestParam(defaultValue = "1") int pageNum, @RequestParam(defaultValue = "") String sort,
			@RequestParam(defaultValue = "도서") String category) {

		log.info("book-crawl");

		String url = bigDataBookService.searchBooks(srchTarget, query, pageSize, pageNum, sort, category);

		return ResponseEntity.ok(url);
	}
}
