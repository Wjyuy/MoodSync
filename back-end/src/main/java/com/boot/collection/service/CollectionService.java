package com.boot.collection.service;

import java.util.List;

import com.boot.collection.dto.CollectionDTO;
import com.boot.collection.dto.CollectionItemDTO;
import com.boot.collection.dto.ItemIdsInOrderRequest;

public interface CollectionService {
    int createCollection(CollectionDTO collection);
    int updateCollection(CollectionDTO collection);
    int deleteCollection(int id);
    CollectionDTO getCollection(int id);
    List<CollectionDTO> getAllCollections();
    List<CollectionDTO> getCollectionsByUserId(int userNumber);
    
    //1개 컬렉션 불러오면서 아이템들 몽땅 불러옴 
    public CollectionDTO getCollectionWithItemsById(int collectionId);
    
    //컬렉션에 아이템 추가하기 위해 컬렉션 리스트 가져옴
    public List<CollectionDTO> getCollectionsOnlyByUserId(int userId);
    
    public int insertCollectionItem(CollectionItemDTO collectionItem);
//    public CollectionDTO updateCollectionItem(CollectionItemDTO collectionItem);
    
    public int deleteCollectionItem(int collectionId);
    public void deleteBycollectionId(int collectionId);
    
 // 드래그 드랍 순서변경
    void updateItemOrder(Long collectionId, List<Long> itemIdsInOrder);
    void updateAllItemsOrder(Long collectionId, List<ItemIdsInOrderRequest> updatedItems);
    //공개 컬렉션
    List<CollectionDTO> shareCollectionsIsPublic();
    
    //컬렉션 복사
    CollectionDTO copyCollection(int originalCollectionId, int userId);
    
    //0넣기용
    public int insertCollectionItemOrderZero(CollectionItemDTO collectionItem);
    
}
