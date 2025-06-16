package com.boot.userRecord.dao;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.boot.userRecord.dto.ActingExceptEmotionDTO;
import com.boot.userRecord.dto.BookExceptEmotionDTO;
import com.boot.userRecord.dto.MusicExceptEmotionDTO;
import com.boot.userRecord.dto.UserRecordDTO;

@Mapper
public interface UserRecordDAO {
	UserRecordDTO findById(Long id); // id로 데이터 가져오기
	UserRecordDTO findByNumAndDate(@Param("userNumber") int userNumber, @Param("recordDate") LocalDate date);
	List<UserRecordDTO> findLatestRecords(int userNumber); // 최신 데이터 7개
	List<ActingExceptEmotionDTO> findInfoByActingNumbers(@Param("actingNumbers") List<Long> actingNumbers);
	List<BookExceptEmotionDTO> findInfoByBookNumbers(@Param("bookNumbers") List<Long> bookNumbers);
	List<MusicExceptEmotionDTO> findInfoByMusicNumbers(@Param("musicNumbers") List<Long> musicNumbers);
}