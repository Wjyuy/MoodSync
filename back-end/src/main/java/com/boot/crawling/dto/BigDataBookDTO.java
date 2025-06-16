package com.boot.crawling.dto;

import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import lombok.Data;

@Data
public class BigDataBookDTO {

	@JacksonXmlProperty(localName = "result")
	private Result result;

	@Data
	public static class Result {
		@JacksonXmlElementWrapper(useWrapping = false)
		@JacksonXmlProperty(localName = "item")
		private List<BookItem> items;
	}

	@Data
	public static class BookItem {
		@JacksonXmlProperty(localName = "title_info")
		private String title;

		@JacksonXmlProperty(localName = "author_info")
		private String author;

		@JacksonXmlProperty(localName = "pub_info")
		private String publisher;

		@JacksonXmlProperty(localName = "pub_year_info")
		private String pubYear;

		@JacksonXmlProperty(localName = "isbn")
		private String isbn;

		// XML에 description 태그는 없지만, 나중에 사용할 수 있도록 정의해둠
		private String description;
	}
}
