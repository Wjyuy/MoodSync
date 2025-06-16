package com.boot.contact.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
	private int contactId;
	private int userNumber;
	private String userName;
	private String contactTitle;
	private String contactContent;
    private String createdDate;
    private String updatedDate; 
    private String deletedDate;
    private String status;
}
