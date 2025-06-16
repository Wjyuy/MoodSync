package com.boot.contact.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.boot.contact.dto.AnswerDTO;
import com.boot.contact.service.AnswerService;
import com.boot.user.dto.BasicUserDTO;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class AnswerController {

	@Autowired
	private AnswerService answerService;

	@PostMapping("/add_contact_reply")
	public ResponseEntity<?> addContactReply(@RequestBody Map<String, Object> payload, HttpServletRequest request) {
//		System.out.println("제발 좀 돼라");
		System.out.println("제발 좀 돼라2");
		int contactId = Integer.parseInt(payload.get("contactId").toString());
		String answerContent = payload.get("answerContent").toString();
		BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
		int userNumber = user.getUserNumber();
//	        int userNumber = 1;

		System.out.println("제발 좀 돼라1");
		AnswerDTO answerDTO = new AnswerDTO();
		System.out.println("제발 좀 돼라2");
		answerDTO.setContactId(contactId);
		answerDTO.setUserNumber(userNumber);
		answerDTO.setAnswerContent(answerContent);

		System.out.println("test => " + answerDTO);
		int result = answerService.saveAnswer(answerDTO);
		answerService.changeContactStatus(contactId);

		if (result > 0) {
			return ResponseEntity.ok(Map.of("status", "success", "message", "답변이 등록되었습니다."));
		} else {
			return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "답변 등록에 실패했습니다."));
		}

	}

	@GetMapping("/contact_answer")
	public ResponseEntity<?> getContactAnswer(@RequestParam("contactId") int contactId) {
		AnswerDTO answer = answerService.getAnswer(contactId);
		System.out.println("@# => " + answer);
		if (answer != null) {
			return ResponseEntity.ok(Map.of("status", "success", "data", answer));
		} else {
			return ResponseEntity.ok(Map.of("status", "success", "data", null, "message", "아직 답변이 등록되지 않았습니다."));
		}
	}
}
