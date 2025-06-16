package com.boot.collection.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemIdsInOrderRequest {
	private int id;
	private int itemOrder;
}
