package com.boot.crawling.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.converter.xml.MappingJackson2XmlHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("BigDataBookService")
public class BigDataBookServiceImpl implements BigDataBookService {
	private final String BASE_URL = "http://www.nl.go.kr/NL/search/openApi/search.do";

	@Value("${book.api}")
	private String SERVICE_KEY;

	@Override
	public String searchBooks(String srchTarget, String query, int pageSize, int pageNum, String sort,
			String category) {
		log.info("@# searchBooks !!");

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new MappingJackson2XmlHttpMessageConverter());

		log.info("@# searchBooks restTemplate =>" + restTemplate);

		String url = String.format(
				"%s?key=%s&apiType=xml&srchTarget=%s&kwd=%s&pageSize=%d&pageNum=%d&sort=%s&category=%s", BASE_URL,
				SERVICE_KEY, srchTarget, query, pageSize, pageNum, sort, category);

		log.info("@# searchBooks url =>" + url);

		return url;
	}
}
