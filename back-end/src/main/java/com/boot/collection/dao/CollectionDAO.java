package com.boot.collection.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper; 
import org.apache.ibatis.annotations.Param;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;

public interface CollectionDAO {
	// 컬렉션
    int insertCollection(CollectionDTO collection);
    int updateCollection(CollectionDTO collection);
    int deleteCollection(int id);
    CollectionDTO selectCollection(int id);
    List<CollectionDTO> selectAllCollections();
    List<CollectionDTO> findCollectionsByUserId(int userId);
    
    int countCollectionItemsByCollectionId(int collectionId);
    // 아이템 넣는 부분
    List<CollectionItemDTO> findByCollectionId(int collectionId);
    int insertCollectionItem(CollectionItemDTO collectionItem);
    
//    void updateCollectionItem(CollectionItemDTO collectionItem);
    int deleteCollectionItem(Integer collectionItemId);
    void deleteByCollectionId(Long collectionId);
    
    // 특정 collectionId와 itemId를 가진 CollectionItem을 조회
    CollectionItemDTO selectCollectionItemById(@Param("collectionId") Long collectionId, @Param("collectionItemId") Long collectionItemId);

    // 컬렉션의 모든 아이템을 순서대로 조회 (item_order 기준)
    List<CollectionItemDTO> findCollectionItemsByCollectionIdOrderByItemOrderAsc(Long collectionId);

    // CollectionItem의 itemOrder를 업데이트 (개별 업데이트)
    int updateCollectionItemOrder(@Param("collectionItemId") Long collectionItemId, @Param("itemOrder") Integer itemOrder);
    
    List<CollectionDTO> shareCollectionsIsPublic();
}
