package com.boot.contact.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.contact.dto.ContactDTO;
import com.boot.contact.service.AnswerService;
import com.boot.contact.service.ContactService;
import com.boot.user.dto.BasicUserDTO;
import com.boot.z_page.criteria.CriteriaDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class ContactController {

	@Autowired
	private ContactService contactService;
	@Autowired
	private AnswerService answerService;

	@GetMapping("/pending_contacts_count")
	public ResponseEntity<?> getPendingContactsCount(HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

			// 관리자 권한 확인 (필요한 경우)
			if (userDTO.getUserAdmin() != 1) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "관리자 권한이 필요합니다.");
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
			}

			int pendingCount = contactService.getNotyetAnswer();

			Map<String, Object> response = new HashMap<>();
			response.put("status", "success");
			response.put("pendingContacts", pendingCount);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("대기 중인 문의 수 조회 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/create_contact")
	public ResponseEntity<?> createContact(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

//			if (userDTO == null) {
//				Map<String, Object> errorResponse = new HashMap<>();
//				errorResponse.put("status", "error");
//				errorResponse.put("message", "로그인이 필요합니다.");
//				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
//			}

			int userNumber = userDTO.getUserNumber();
			String contactTitle = param.get("contact_title");
			String contactContent = param.get("contact_content");

//            log.info("문의 생성 요청: userNumber={}, title={}", userNumber, contactTitle);

			// 입력값 검증
			if (contactTitle == null || contactTitle.trim().isEmpty()) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "문의 제목을 입력해주세요.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
			}

			if (contactContent == null || contactContent.trim().isEmpty()) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "문의 내용을 입력해주세요.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
			}

			int result = contactService.createContact(userNumber, contactTitle, contactContent);

			Map<String, Object> response = new HashMap<>();
			if (result > 0) {
				response.put("status", "success");
				response.put("message", "문의가 성공적으로 등록되었습니다.");
				response.put("contactId", result);
				return ResponseEntity.status(HttpStatus.CREATED).body(response);
			} else {
				response.put("status", "error");
				response.put("message", "문의 등록에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}

		} catch (Exception e) {
			log.error("문의 생성 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/read_contact")
	public ResponseEntity<?> readContact(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

			int userNumber = userDTO.getUserNumber();
			String contactTitle = param.get("contact_title");
			String contactContent = param.get("contact_content");

//            log.info("문의 조회 요청: userNumber={}, title={}", userNumber, contactTitle);

			int result = contactService.readContact(userNumber, contactTitle, contactContent);

			Map<String, Object> response = new HashMap<>();
			if (result > 0) {
				response.put("status", "success");
				response.put("message", "문의 조회 성공");
				response.put("contactId", result);
				return ResponseEntity.ok(response);
			} else {
				response.put("status", "error");
				response.put("message", "해당 문의를 찾을 수 없습니다.");
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
			}

		} catch (Exception e) {
			log.error("문의 조회 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/update_contact")
	public ResponseEntity<?> updateContact(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

			int userNumber = userDTO.getUserNumber();
			int contactId = Integer.parseInt(param.get("contactId"));
			String contactTitle = param.get("contact_title");
			String contactContent = param.get("contact_content");

			// 입력값 검증
			if (contactTitle == null || contactTitle.trim().isEmpty()) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "문의 제목을 입력해주세요.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
			}

			if (contactContent == null || contactContent.trim().isEmpty()) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "문의 내용을 입력해주세요.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
			}

			log.info("문의 수정 요청: userNumber={}, contactId={}, title={}, COMNENT={}", userNumber, contactId, contactTitle,
					contactContent);
			int result = contactService.updateContact(userNumber, contactId, contactTitle, contactContent);

			Map<String, Object> response = new HashMap<>();
			if (result > 0) {
				response.put("status", "success");
				response.put("message", "문의가 성공적으로 수정되었습니다.");
				return ResponseEntity.ok(response);
			} else {
				response.put("status", "error");
				response.put("message", "문의 수정에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}

		} catch (Exception e) {
			log.error("문의 수정 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/delete_contact")
	public ResponseEntity<?> deleteContact(@RequestParam HashMap<String, String> param, HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

			int userNumber = userDTO.getUserNumber();
			int contactId = Integer.parseInt(param.get("contactId"));
			String contactTitle = param.get("contact_title");
			String contactContent = param.get("contact_content");

//            log.info("문의 삭제 요청: userNumber={}, title={}", userNumber, contactTitle);

			int result = contactService.deleteContact(userNumber, contactId);

			Map<String, Object> response = new HashMap<>();
			if (result > 0) {
				response.put("status", "success");
				response.put("message", "문의가 성공적으로 삭제되었습니다.");
				return ResponseEntity.ok(response);
			} else {
				response.put("status", "error");
				response.put("message", "문의 삭제에 실패했습니다.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
			}

		} catch (Exception e) {
			log.error("문의 삭제 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/all_contacts")
	public ResponseEntity<?> getAllContacts(@RequestParam(defaultValue = "1") int pageNum,
			@RequestParam(defaultValue = "10") int amount, HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

//            log.info("전체 문의 조회 요청: pageNum={}, amount={}", pageNum, amount);

			// CriteriaDTO 생성
			CriteriaDTO criteriaDTO = new CriteriaDTO(pageNum, amount);

			// 문의 목록 조회
			ArrayList<ContactDTO> contactList = contactService.allReadContact(criteriaDTO);

			// 총 개수 조회
			int totalCount = contactService.getTotalCount(criteriaDTO);
//			System.out.println(contactList);

			// 페이징 정보 계산
			int totalPages = (int) Math.ceil((double) totalCount / amount);
			boolean hasNext = pageNum < totalPages;
			boolean hasPrevious = pageNum > 1;

			Map<String, Object> response = new HashMap<>();
			response.put("status", "success");
			response.put("data", contactList);
			response.put("pagination", Map.of("currentPage", pageNum, "pageSize", amount, "totalCount", totalCount,
					"totalPages", totalPages, "hasNext", hasNext, "hasPrevious", hasPrevious));

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("전체 문의 조회 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/contact_stats")
	public ResponseEntity<?> getContactStats(HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

//            log.info("문의 통계 조회 요청");

			CriteriaDTO criteriaDTO = new CriteriaDTO();
			int totalCount = contactService.getTotalCount(criteriaDTO);

			Map<String, Object> response = new HashMap<>();
			response.put("status", "success");
			response.put("totalContacts", totalCount);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("문의 통계 조회 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}

	@GetMapping("/my_contacts")
	public ResponseEntity<?> getMyContacts(@RequestParam(defaultValue = "1") int pageNum,
			@RequestParam(defaultValue = "10") int amount, HttpServletRequest request) {
		try {
			BasicUserDTO userDTO = (BasicUserDTO) request.getAttribute("user");

			if (userDTO == null) {
				Map<String, Object> errorResponse = new HashMap<>();
				errorResponse.put("status", "error");
				errorResponse.put("message", "로그인이 필요합니다.");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
			}

			int userNumber = userDTO.getUserNumber();
//            log.info("사용자 본인 문의 조회 요청: userNumber={}, pageNum={}, amount={}", userNumber, pageNum, amount);

			// CriteriaDTO 생성 및 사용자 번호 설정
			CriteriaDTO criteriaDTO = new CriteriaDTO(pageNum, amount);
			criteriaDTO.setUserNumber(userNumber); // CriteriaDTO에 userNumber 필드 추가 필요

			// 사용자 문의 목록 조회
			ArrayList<ContactDTO> contactList = contactService.onlyUserContact(criteriaDTO);

			// 사용자 문의 총 개수 조회
			int totalCount = contactService.getUserContactCount(criteriaDTO);

			// 페이징 정보 계산
			int totalPages = (int) Math.ceil((double) totalCount / amount);
			boolean hasNext = pageNum < totalPages;
			boolean hasPrevious = pageNum > 1;

			Map<String, Object> response = new HashMap<>();
			response.put("status", "success");
			response.put("data", contactList);
			response.put("pagination", Map.of("currentPage", pageNum, "pageSize", amount, "totalCount", totalCount,
					"totalPages", totalPages, "hasNext", hasNext, "hasPrevious", hasPrevious));

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			log.error("사용자 문의 조회 중 오류 발생: ", e);
			Map<String, Object> errorResponse = new HashMap<>();
			errorResponse.put("status", "error");
			errorResponse.put("message", "서버 오류가 발생했습니다.");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
		}
	}
}
