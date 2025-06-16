package com.boot.analize.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserClusteringDTO {
	private int userNumber;
    private int happy;
    private int sad;
    private int stress;
    private int calm;
    private int excited;
    private int tired;
    private String created_at;
    
}
