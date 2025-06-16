package com.boot.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
public class CollectionDTO {
    private int collectionId;
    private int userId;
    private String name;
    private String description;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    //컬렉션에 포함된 아이템 리스트,갯수
    private List<CollectionItemDTO> items;
    private int itemCount; 
    
    // userId에 해당하는 유저의 이름
    private String userName;
    
}