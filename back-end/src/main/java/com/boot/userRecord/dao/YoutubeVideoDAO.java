package com.boot.userRecord.dao;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface YoutubeVideoDAO {
	String findVideoIdByMusicNumber(Long musicNumber);
}