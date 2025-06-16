package com.boot.analize.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.boot.analize.dto.UserClusteringDTO;

@Mapper
public interface UserClusteringDAO {
    List<UserClusteringDTO> findRecentEmotionData();
    List<UserClusteringDTO> findEmotionDataByDate(String created_at);
}
