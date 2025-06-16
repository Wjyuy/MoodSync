package com.boot.collection.controller;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;
import com.boot.collection.dto.ItemIdsInOrderRequest;
import com.boot.collection.service.CollectionService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import java.util.HashMap; // HashMap 임포트 추가

import com.boot.z_config.security.PrincipalDetails;
import com.boot.user.dto.BasicUserDTO;
import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService; // UserService 임포트 추가

@RestController
@RequestMapping("/api/collections")
@Slf4j
public class CollectionController {
    @Autowired
    private CollectionService collectionService;
    @Autowired
    private UserService userService; // UserService 주입

    @PostMapping
    public ResponseEntity<?> createCollection(@RequestBody CollectionDTO collection,@AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {
        if (principalDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 인증되지 않은 경우
        }
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        collection.setUserId(user.getUserNumber()); 
        try {
            int result = collectionService.createCollection(collection);
            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body("Collection created successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create collection.");
            }
        } catch (Exception e) {
            log.error("컬렉션 생성 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating collection: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public int updateCollection(@PathVariable int id, @RequestBody CollectionDTO collection) {
//    	log.info("컬렉션 수정 - 사용자 ID (UserNumber): {}", collection.getUserId());
        collection.setCollectionId(id);
        return collectionService.updateCollection(collection);
    }

    @DeleteMapping("/{id}")
    public int deleteCollection(@PathVariable int id) {
        return collectionService.deleteCollection(id);
    }

    @GetMapping("/user-collections") 
    public ResponseEntity<List<CollectionDTO>> getCollections(@AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {
        if (principalDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 인증되지 않은 경우
        }
        
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        
        List<CollectionDTO> collections = collectionService.getCollectionsByUserId(user.getUserNumber()); // 파라미터 타입을 String으로 변경
        return ResponseEntity.ok(collections);
    }
    @GetMapping
    public List<CollectionDTO> getAllCollections() {
        return collectionService.getAllCollections();
    }
    
    @PostMapping("/add-to-collection") 
    public ResponseEntity<?> getCollectionsForAddItem(@RequestBody(required = false) Map<String, Object> payload, @AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {

        if (principalDetails == null) {
//            log.warn("인증되지 않은 사용자의 컬렉션 목록 조회 시도.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // PrincipalDetails에서 userId 가져오기
        // PrincipalDetails 내부에 BasicUserDTO 객체가 있다고 가정합니다.
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        int userId = user.getUserNumber();
//        log.info("사용자 (ID: {}) 의 컬렉션 목록 조회 요청 (아이템 추가 전 선택용)", userId);

        try {
            // 컬렉션 목록만 가져오는 새로운 서비스 메소드 호출
            List<CollectionDTO> collections = collectionService.getCollectionsOnlyByUserId(userId);
            return ResponseEntity.ok(collections); 
        } catch (Exception e) {
            log.error("사용자 (ID: {}) 의 컬렉션 목록 조회 중 오류 발생: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("컬렉션 목록 조회 중 오류가 발생했습니다.");
        }
    }
    
    @PostMapping("/add-item")
    public ResponseEntity<?> addCollectionItem(@RequestBody CollectionItemDTO itemPayload, @AuthenticationPrincipal PrincipalDetails principalDetails, HttpServletRequest request) {
        if (principalDetails == null) {
//            log.warn("인증되지 않은 사용자의 컬렉션 아이템 추가 시도.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        int userId = user.getUserNumber();
//        log.info("사용자 (ID: {}) 가 컬렉션 (ID: {}) 에 아이템 추가 요청.", userId, itemPayload.getCollectionId());

        try {
            // 컬렉션 서비스 호출하여 아이템 추가(순서는0으로)
            int result = collectionService.insertCollectionItemOrderZero(itemPayload);

            if (result > 0) {
                return ResponseEntity.status(HttpStatus.CREATED).body("아이템이 컬렉션에 성공적으로 추가되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아이템 추가에 실패했습니다.");
            }
        } catch (IllegalArgumentException e) {
            // 권한 없음 또는 유효하지 않은 컬렉션 ID 등의 경우
            log.error("컬렉션 아이템 추가 중 권한/유효성 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("컬렉션 아이템 추가 중 서버 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("컬렉션 아이템 추가 중 오류가 발생했습니다.");
        }
    }
    // 새롭게 추가할 DELETE 엔드포인트
    @DeleteMapping("/{collectionId}/items/{itemId}")
    public ResponseEntity<?> deleteCollectionItem(
            @PathVariable int collectionId,
            @PathVariable String itemId,
            @AuthenticationPrincipal PrincipalDetails principalDetails,
            HttpServletRequest request) {
        
        if (principalDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        
        // 컬렉션 소유자 확인을 위해 userId 가져오기 (선택 사항이지만 보안상 권장,구현은안되어있어요)
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        int userId = user.getUserNumber();

        try {
            // 서비스 계층 호출
            // 서비스 계층에서 collectionId와 userId를 비교하여 해당 컬렉션이 현재 사용자의 것인지 확인하는 로직을 추가할 수 있습니다.
            int result = collectionService.deleteCollectionItem(Integer.parseInt(itemId));
            
            if (result > 0) {
                return ResponseEntity.ok("컬렉션 아이템이 성공적으로 삭제되었습니다.");
            } else {
                // 삭제 대상이 없었거나, 권한 문제로 삭제되지 않은 경우
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("삭제할 컬렉션 아이템을 찾을 수 없거나 권한이 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            // 서비스에서 던진 권한 오류 또는 유효성 검사 오류
            log.error("컬렉션 아이템 삭제 중 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); // 권한 없음 -> 403 Forbidden
        } catch (Exception e) {
            log.error("컬렉션 아이템 삭제 중 서버 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("컬렉션 아이템 삭제 중 오류가 발생했습니다.");
        }
    }
    
 // 공유했을때 그 유저의 컬렉션과 리스트 뽑아옴
    @GetMapping("/{id}") 
    public ResponseEntity<CollectionDTO> getCollectionById(@PathVariable int id) {
//        log.info("컬렉션 ID {} 조회 요청"+ id);
        try {
        	CollectionDTO collection = collectionService.getCollectionWithItemsById(id);
            if (collection != null && collection.getIsPublic()) {
//            	log.info("조회한 컬렉션 주인 이름 :> "+ collection.getUserName());
                return ResponseEntity.ok(collection);
            } else if (collection != null && !collection.getIsPublic()) {
//                log.warn("컬렉션 ID {}는 존재하지만 공개 상태가 아닙니다.", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build(); // 또는 HttpStatus.FORBIDDEN
            } else {
                log.warn("컬렉션 ID {}를 찾을 수 없습니다.", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            log.error("공유 컬렉션 ID {} 조회 중 서버 오류 발생: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // 드래그 앤 드롭 순서 변경 엔드포인트: updateCollectionItemsOrder
    // 프론트엔드에서 itemIdsInOrder를 string[]으로 보내지만, 백엔드는 Long[]으로 처리할 수 있습니다.
    @PutMapping("/{collectionId}/items/reorder")
    public ResponseEntity<Void> reorderCollectionItems(@PathVariable Long collectionId,
                                                       @RequestBody List<String> itemIdsInOrder) {
        List<Long> longItemIdsInOrder = itemIdsInOrder.stream()
                                                    .map(Long::valueOf)
                                                    .collect(Collectors.toList());
        collectionService.updateItemOrder(collectionId, longItemIdsInOrder);
        return ResponseEntity.ok().build();
    }

    // 전체 아이템 정보 업데이트 엔드포인트: updateCollectionItemsFull
    @PutMapping("/{collectionId}/items/full-update")
    public ResponseEntity<Void> updateCollectionItems(@PathVariable Long collectionId,
                                                      @RequestBody List<ItemIdsInOrderRequest> updatedItems) {
//    	log.info("collectionId 는 옴=>"+collectionId);
//    	log.info("updatedItems 가 안 옴=>"+updatedItems);
        collectionService.updateAllItemsOrder(collectionId, updatedItems); // 서비스 메서드 이름 변경 고려
        return ResponseEntity.ok().build();
    }
    
    //isPublic =1 인(공개상태인) 컬렉션 가져옴
    @GetMapping("/public") 
    public List<CollectionDTO> shareCollectionsIsPublic() {
        return collectionService.shareCollectionsIsPublic();
    }
        
    @PostMapping("/copy/{originalCollectionId}")
    public ResponseEntity<CollectionDTO> copyCollectionAndItems(
    		@PathVariable("originalCollectionId") int originalCollectionId,
            @AuthenticationPrincipal PrincipalDetails principalDetails// 경로 변수로 originalCollectionId 받음
            , HttpServletRequest request) { // 로그인 정보
    	
//    	log.info("컬렉션 복사 요청 수신: originalCollectionId={}, 사용자={}", originalCollectionId, principalDetails != null ? principalDetails.getUsername() : "비인증");
        if (principalDetails == null) {
//        	log.info("로그인노노");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 인증되지 않은 사용자
        }
        BasicUserDTO user = (BasicUserDTO) request.getAttribute("user");
        
        int currentUserId = user.getUserNumber();

        try {
            // 서비스 호출: 기존 컬렉션을 복사하여 새 컬렉션 생성
            CollectionDTO newCollection = collectionService.copyCollection(originalCollectionId, currentUserId);
            log.info("컬렉션 복사 성공: originalCollectionId={} -> newCollectionId={}", originalCollectionId, newCollection.getCollectionId());
            return ResponseEntity.ok(newCollection); // 성공 시 200 OK와 함께 새 컬렉션 반환
        } catch (IllegalArgumentException e) {
            // 컬렉션을 찾을 수 없거나 다른 유효성 검사 오류
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            // 기타 서버 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    
}