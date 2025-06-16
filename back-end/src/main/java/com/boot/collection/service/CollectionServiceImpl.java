package com.boot.collection.service;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- 이 라인으로 변경합니다.

import com.boot.collection.dao.CollectionDAO;
import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;
import com.boot.collection.dto.ItemIdsInOrderRequest;

import lombok.extern.slf4j.Slf4j;

@Service("CollectionService")
@Slf4j
public class CollectionServiceImpl implements CollectionService {
	@Autowired
	private SqlSession sqlSession;

    @Override
    @Transactional // ★ 컬렉션 생성: DB 변경 (INSERT)
    public int createCollection(CollectionDTO collection) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        log.info("서비스: 컬렉션 생성 시도 - 이름: {}", collection.getName());
        int result = dao.insertCollection(collection);
        log.info("서비스: 컬렉션 생성 결과: {} rows", result);
        return result;
    }

    @Override
    @Transactional // ★ 컬렉션 수정: DB 변경 (UPDATE)
    public int updateCollection(CollectionDTO collection) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        log.info("서비스: 컬렉션 업데이트 시도 - ID: {}", collection.getCollectionId());
        int result = dao.updateCollection(collection);
        log.info("서비스: 컬렉션 업데이트 결과: {} rows", result);
        return result;
    }

    @Override
    @Transactional // ★ 컬렉션 삭제: DB 변경 (DELETE)
    public int deleteCollection(int id) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);

    	return dao.deleteCollection(id);
    }

    // --- 조회 메서드들은 일반적으로 @Transactional이 필수는 아니지만, 일관성을 위해 @Transactional(readOnly = true)를 사용할 수 있습니다. ---

    @Override
    @Transactional(readOnly = true) // ★ 컬렉션 조회: 읽기 전용
    public CollectionDTO getCollection(int id) {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.selectCollection(id);
    }

    @Override
    @Transactional(readOnly = true) // ★ 컬렉션 및 아이템 조회: 읽기 전용
    public CollectionDTO getCollectionWithItemsById(int collectionId) {
        CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        CollectionDTO collection = dao.selectCollection(collectionId);
        if (collection != null) {
            List<CollectionItemDTO> items = dao.findByCollectionId(collectionId);
            collection.setItems(items);
        }
        return collection;
    }

    @Override
    @Transactional(readOnly = true) // ★ 모든 컬렉션 조회: 읽기 전용
    public List<CollectionDTO> getAllCollections() {
    	CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        return dao.selectAllCollections();
    }

	@Override
	@Transactional(readOnly = true) // ★ 사용자 컬렉션 조회: 읽기 전용
	public List<CollectionDTO> getCollectionsByUserId(int userId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		List<CollectionDTO> collections=dao.findCollectionsByUserId(userId);
		for (CollectionDTO collection : collections) {
            List<CollectionItemDTO> items = dao.findByCollectionId(collection.getCollectionId());
            collection.setItems(items);
        }
        return collections;
	}

	@Override
	@Transactional // ★ 컬렉션 아이템 추가: DB 변경 (INSERT)
	public int insertCollectionItem(CollectionItemDTO collectionItem) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		log.info("서비스: 컬렉션 아이템 추가 시도 - 컬렉션ID: {}, 제목: {}", collectionItem.getCollectionId(), collectionItem.getContentTitle());
//			collectionItem.setItemOrder(0);
		int result = dao.insertCollectionItem(collectionItem);
		log.info("서비스: 컬렉션 아이템 추가 결과: {} rows", result);
		return result;
	}
	
	@Override
	@Transactional // ★ 컬렉션 아이템 추가: DB 변경 (INSERT)
	public int insertCollectionItemOrderZero(CollectionItemDTO collectionItem) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		log.info("서비스: 컬렉션 아이템 추가 시도 - 컬렉션ID: {}, 제목: {}", collectionItem.getCollectionId(), collectionItem.getContentTitle());
//		collectionItem.setItemOrder(0);
		int result = dao.insertCollectionItem(collectionItem);
		log.info("서비스: 컬렉션 아이템 추가 결과: {} rows", result);
		return result;
	}

	@Override
	@Transactional // ★ 컬렉션 아이템 삭제: DB 변경 (DELETE)
	public int deleteCollectionItem(int collectionItemId) { // 파라미터 이름 수정 (id -> collectionItemId)
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		log.info("서비스: 컬렉션 아이템 삭제 시도 - Item ID: {}", collectionItemId);
		int result = dao.deleteCollectionItem(collectionItemId);
		log.info("서비스: 컬렉션 아이템 삭제 결과: {} rows", result);
		return result;
	}

	@Override
	@Transactional // ★ itemId 기반 삭제: DB 변경 (DELETE)
	public void deleteBycollectionId(int itemId) { // 메서드명과 파라미터가 혼동될 수 있으니 itemId로 변경
//		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		log.info("서비스: 아이템 ID {}를 사용하여 컬렉션 아이템 삭제 시도", itemId);
		// 이 메서드는 CollectionDAO에 실제 삭제 로직을 호출해야 합니다.
		// 예: dao.deleteCollectionItem(itemId); 또는 dao.deleteItemById(itemId);
        // int result = dao.deleteCollectionItem(itemId); // 위 deleteCollectionItem과 중복될 수 있으니 확인
        // log.info("서비스: 아이템 ID {} 삭제 결과: {} rows", itemId, result);
        // TODO: 실제 삭제 로직 추가 (현재 비어있음)
	}

	@Override
	@Transactional(readOnly = true) // ★ 사용자 컬렉션 목록만 조회: 읽기 전용
	public List<CollectionDTO> getCollectionsOnlyByUserId(int userId) {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
//        log.info("컬렉션 목록만 조회 (userId: {})", userId);
		
		//컬렉션 목록 조회
        List<CollectionDTO> collections = dao.findCollectionsByUserId(userId);
        
     // 2. 각 컬렉션에 대해 아이템 개수를 조회하여 DTO에 설정
        for (CollectionDTO collection : collections) {
            int itemCount = dao.countCollectionItemsByCollectionId(collection.getCollectionId());
            collection.setItemCount(itemCount);
//            log.info("컬렉션 '{}' (ID: {})의 아이템 개수: {}", collection.getName(), collection.getCollectionId(), itemCount);
        }
        return collections;

	}

	@Override
    @Transactional // ★ 아이템 순서 업데이트: DB 변경 (UPDATE)
    public void updateItemOrder(Long collectionId, List<Long> itemIdsInOrder) {
        CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        log.info("서비스: 컬렉션 {} 아이템 순서 재정렬 시도. (아이템 수: {})", collectionId, itemIdsInOrder.size());

        for (int i = 0; i < itemIdsInOrder.size(); i++) {
            Long currentItemId = itemIdsInOrder.get(i);
            // 매퍼에 단일 아이템의 순서를 업데이트하는 메서드를 호출해야 합니다.
            int updatedRows = dao.updateCollectionItemOrder(currentItemId, i); // 매퍼 메서드 이름에 맞게 수정
            if (updatedRows == 0) {
                 log.warn("경고: 컬렉션 {}에서 아이템 ID {}의 순서 업데이트 실패 (존재하지 않거나 변경 없음).", collectionId, currentItemId);
            } else {
                 log.debug("서비스: 아이템 {}의 순서를 {}로 업데이트 완료.", currentItemId, i);
            }
        }
        log.info("서비스: 컬렉션 {} 아이템 순서 재정렬 완료.", collectionId);
    }

    @Override
    @Transactional // ★ 모든 아이템 정보 업데이트: DB 변경 (UPDATE)
    public void updateAllItemsOrder(Long collectionId, List<ItemIdsInOrderRequest> updatedItems) {
        CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        log.info("서비스: 컬렉션 {}의 모든 아이템 정보 업데이트 시도. ({}개 아이템)", collectionId, updatedItems.size());

        for (ItemIdsInOrderRequest dto : updatedItems) {
            Long collectionItemId = Long.valueOf(dto.getId()); 
            int updatedRows = dao.updateCollectionItemOrder(collectionItemId, dto.getItemOrder());
            if (updatedRows == 0) {
                log.warn("경고: 컬렉션 {}에서 아이템 ID {}의 전체 정보 업데이트 실패 (존재하지 않거나 변경 없음).", collectionId, collectionItemId);
            } else {
                log.debug("서비스: 아이템 {}의 순서를 {}로 업데이트 완료.", collectionItemId, dto.getItemOrder());
            }
        }
        // updateAllItemsOrder는 이미 모든 아이템의 순서를 명시적으로 업데이트하므로,
        // reindexCollectionItems 호출은 중복될 수 있습니다. 필요에 따라 유지/삭제 결정하세요.
        // 현재는 순서만 업데이트하므로, 이 메서드에서 reindexCollectionItems를 호출하는 것은
        // 이미 프론트에서 받은 `updatedItems`에 순서 정보가 명확히 들어있다면 불필요할 수 있습니다.
        // reindexCollectionItems(collectionId); // 기존 호출 유지 또는 삭제
        log.info("서비스: 컬렉션 {}의 모든 아이템 정보 업데이트 완료.", collectionId);
    }

    /**
     * 아이템 삭제 또는 추가 후 itemOrder를 재정렬하는 유틸리티 메서드 (선택 사항).
     * 이 메서드는 updateItemOrder 또는 updateAllItemsOrder와 로직이 겹치거나,
     * 프론트엔드에서 정확한 순서를 제공한다면 불필요할 수 있습니다.
     * 필요에 따라 사용하거나 삭제하세요.
     */
    private void reindexCollectionItems(Long collectionId) {
        CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
        log.info("서비스: 컬렉션 {} 아이템 순서 재인덱싱 시작.", collectionId);
        List<CollectionItemDTO> items = dao.findCollectionItemsByCollectionIdOrderByItemOrderAsc(collectionId);
        for (int i = 0; i < items.size(); i++) {

        	CollectionItemDTO item = items.get(i);

        	dao.updateCollectionItemOrder(Long.valueOf(item.getCollectionItemId()), i);
                log.debug("서비스: 아이템 {}의 순서를 {}로 재인덱싱.", item.getCollectionItemId(), i);
            
        }
        log.info("서비스: 컬렉션 {} 아이템 순서 재인덱싱 완료.", collectionId);
    }

	@Override
	public List<CollectionDTO> shareCollectionsIsPublic() {
		CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
		List<CollectionDTO> collections= dao.shareCollectionsIsPublic();
		for (CollectionDTO collection : collections) {
            List<CollectionItemDTO> items = dao.findByCollectionId(collection.getCollectionId());
            collection.setItems(items);
        }
        return collections;
	}

	@Override
    @Transactional 
    public CollectionDTO copyCollection(int originalCollectionId, int userId) {
        CollectionDAO dao = sqlSession.getMapper(CollectionDAO.class);
//        log.info("CollectionService.copyCollection 시작: originalCollectionId={}, userId={}", originalCollectionId, userId);
        // 1. 원본 컬렉션 조회
        CollectionDTO originalCollection = dao.selectCollection(originalCollectionId);
        if (originalCollection == null) {
            throw new IllegalArgumentException("원본 컬렉션을 찾을 수 없습니다: " + originalCollectionId);
        }

//        log.info("원본 컬렉션 조회 성공: originalCollectionName={}", originalCollection.getName());
        // 2. 새 컬렉션 DTO 생성 (복사본)
        CollectionDTO newCollection = new CollectionDTO();
        newCollection.setUserId(userId); // 현재 로그인된 사용자 ID로 설정
        newCollection.setName("Copied - " + originalCollection.getName());
        newCollection.setDescription(originalCollection.getDescription());
        newCollection.setIsPublic(false); // 복사본은 기본적으로 비공개로 설정

        dao.insertCollection(newCollection);
        int newCollectionId = newCollection.getCollectionId(); // 새로 생성된 컬렉션 ID
//        log.info("새 컬렉션 삽입 성공. 새로 생성된 collectionId={}", newCollection.getCollectionId());

        // 4. 원본 컬렉션 아이템 조회
        List<CollectionItemDTO> originalItems = dao.findByCollectionId(originalCollectionId);

        // 5. 새 컬렉션에 아이템 복사
        if (originalItems != null && !originalItems.isEmpty()) {
            int newItemOrder = 0; 
            for (CollectionItemDTO originalItem : originalItems) {
                CollectionItemDTO newItem = new CollectionItemDTO();
                newItem.setCollectionId(newCollectionId); 
                newItem.setContentTitle(originalItem.getContentTitle());
                newItem.setContentType(originalItem.getContentType());
//                newItem.setContentId(originalItem.getContentId());
                newItem.setItemOrder(newItemOrder++); // 새 순서 부여
                
                dao.insertCollectionItem(newItem);
            }
        }

        // 6. 복사된 컬렉션의 전체 정보 (아이템 포함)를 다시 조회하여 반환
        // 새로 생성된 컬렉션을 다시 조회하여 아이템 리스트까지 포함된 완전한 DTO 반환
        return dao.selectCollection(newCollectionId);
    }
}