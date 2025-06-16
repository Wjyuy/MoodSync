package com.boot.collection.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CollectionItemDTO {
    private int collectionItemId;
    private int collectionId; 
    private String contentTitle; 
    private String contentType;
    private LocalDateTime addedAt;
    private int itemOrder; 
}
