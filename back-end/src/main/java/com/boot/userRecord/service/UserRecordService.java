package com.boot.userRecord.service;

import java.time.LocalDate;
import java.util.List;

import com.boot.userRecord.dto.UserRecordDTO;

public interface UserRecordService {
//	public UserRecordDTO findById(Long id);
	public UserRecordDTO findByIdWithVideoId(Long id);
	public UserRecordDTO findByNumAndDate(int userNumber, LocalDate date);
	public List<UserRecordDTO> getLatestRecords(int userNumber);
}
