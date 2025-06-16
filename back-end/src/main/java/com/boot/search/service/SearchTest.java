package com.boot.search.service;

public class SearchTest {
	private static TypoCheck typoCheck;

	private static KeyboardMapper keyboardMapper;

	public static void main(String[] args) {
		String text = "셤ㄴ우";

		String key_result = keyboardMapper.convertEngToKor(text);

		String typo_result = typoCheck.combine(key_result);

		System.out.println("@# typo_result =>" + typo_result);

	}
}
