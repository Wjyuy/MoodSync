package com.boot.search.service;

import org.springframework.stereotype.Service;

@Service("SearchService")
public class SearchServiceImpl implements SearchService {
	private KeyboardMapper keyboardMapper;
	private TypoCheck typoCheck;

	@Override
	public String resultText(String text) {

		String Kor_text = keyboardMapper.convertEngToKor(text);
		String result_text = typoCheck.combine(Kor_text);

		return result_text;
	}

}
