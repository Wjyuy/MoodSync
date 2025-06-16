package com.boot.userRecord.service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.userRecord.dao.UserRecordDAO;
import com.boot.userRecord.dao.YoutubeVideoDAO;
import com.boot.userRecord.dto.UserRecordDTO;
import com.boot.userRecord.dto.YoutubeVideoDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("UserRecordService")
public class UserRecordServiceImpl implements UserRecordService {
	@Autowired
	private UserRecordDAO userRecordDAO;
	@Autowired
	private YoutubeVideoDAO youtubeVideoDAO;
	@Autowired
	private YoutubeService youtubeService;

	// Youtube API search 사용 <- 할당량 부족
//	@Override
//	public UserRecordDTO findById(Long id) {
//		UserRecordDTO dto = userRecordDAO.findById(id);
//		if (dto == null) {
//			return null;
//		}
//
//		List<Long> actionIds = parseIds(dto.getAction_ids());
//		List<Long> bookIds = parseIds(dto.getBook_ids());
//		List<Long> musicIds = parseIds(dto.getMusic_ids());
//
//		dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
//		dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
//		dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));
//
//    	List<YoutubeVideoDTO> youtubeVideoDTOs = new ArrayList<>();
//        
//        for (int i = 0; i < dto.getRecommendedMusics().size(); i++) {
//            String videoName = dto.getRecommendedMusics().get(i).getMusicName();
//            List<Map<String, String>> videos = null;
//
//            try {
//                videos = new ArrayList<>();
//                videos.add(youtubeService.searchVideo(videoName));
//            } catch (IOException e) {
//                e.printStackTrace();
//                videos = Collections.emptyList();
//            }
//
//            if (!videos.isEmpty()) {
//                Map<String, String> videoData = videos.get(0);
//                YoutubeVideoDTO videoDTO = new YoutubeVideoDTO(
//                    videoData.get("title"),
//                    videoData.get("channel"),
//                    videoData.get("thumbnail"),
//                    videoData.get("videoUrl")
//                );
//                youtubeVideoDTOs.add(videoDTO);
//            }
//        }
//    	
//        dto.setYoutubeSearchResults(youtubeVideoDTOs);
//
//		log.info("UserRecordServiceImpl : " + dto);
//
//		return dto;
//	}
	
	@Override
	public UserRecordDTO findByIdWithVideoId(Long id) {
		UserRecordDTO dto = userRecordDAO.findById(id);
		if (dto == null) {
			return null;
		}
		
		List<Long> actionIds = parseIds(dto.getAction_ids());
		List<Long> bookIds = parseIds(dto.getBook_ids());
		List<Long> musicIds = parseIds(dto.getMusic_ids());
		
		dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
		dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
		dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));
		
		List<YoutubeVideoDTO> youtubeVideoDTOs = new ArrayList<>();
		
	    for (Long musicNumber : musicIds) {
	        String videoId = youtubeVideoDAO.findVideoIdByMusicNumber(musicNumber); // 새 DAO 메서드

	        Map<String, String> videoData = new HashMap<>();
	        if (videoId != null && !videoId.isEmpty()) {
	            try {
	                videoData = youtubeService.getVideoDetailsById(videoId);
	            } catch (IOException e) {
	                e.printStackTrace();
	                // fallback: videoId 기반 정적 정보 생성
	                videoData.put("title", "API 실패");
	                videoData.put("channel", "API 실패");
	                videoData.put("thumbnail", "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg");
	                videoData.put("videoUrl", "https://www.youtube.com/watch?v=" + videoId);
	            }
	        } else {
	            videoData.put("title", "영상 없음");
	            videoData.put("channel", "미등록");
	            videoData.put("thumbnail", "https://dummyimage.com/480x360/cccccc/000000?text=No+Video"); // 대체 이미지
	            videoData.put("videoUrl", "#"); // 링크 없음 처리
	        }
	            
            YoutubeVideoDTO videoDTO = new YoutubeVideoDTO(
                videoData.get("title"),
                videoData.get("channel"),
                videoData.get("thumbnail"),
                videoData.get("videoUrl")
            );
            youtubeVideoDTOs.add(videoDTO);
	    }
		dto.setYoutubeSearchResults(youtubeVideoDTOs);
		
		log.info("UserRecordServiceImpl : " + dto);
		
		return dto;
	}

	@Override
	public UserRecordDTO findByNumAndDate(int userNumber, LocalDate date) {
		UserRecordDTO dto = userRecordDAO.findByNumAndDate(userNumber, date);
		if (dto == null) {
			return null;
		}
		
		List<Long> actionIds = parseIds(dto.getAction_ids());
		List<Long> bookIds = parseIds(dto.getBook_ids());
		List<Long> musicIds = parseIds(dto.getMusic_ids());
		
		dto.setRecommendedActions(userRecordDAO.findInfoByActingNumbers(actionIds));
		dto.setRecommendedBooks(userRecordDAO.findInfoByBookNumbers(bookIds));
		dto.setRecommendedMusics(userRecordDAO.findInfoByMusicNumbers(musicIds));
		
		List<YoutubeVideoDTO> youtubeVideoDTOs = new ArrayList<>();
		
	    for (Long musicNumber : musicIds) {
	        String videoId = youtubeVideoDAO.findVideoIdByMusicNumber(musicNumber); // 새 DAO 메서드

	        Map<String, String> videoData = new HashMap<>();
	        if (videoId != null && !videoId.isEmpty()) {
	            try {
	                videoData = youtubeService.getVideoDetailsById(videoId);
	            } catch (IOException e) {
	                e.printStackTrace();
	                // fallback: videoId 기반 정적 정보 생성
	                videoData.put("title", "API 실패");
	                videoData.put("channel", "API 실패");
	                videoData.put("thumbnail", "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg");
	                videoData.put("videoUrl", "https://www.youtube.com/watch?v=" + videoId);
	            }
	        } else {
	            videoData.put("title", "영상 없음");
	            videoData.put("channel", "미등록");
	            videoData.put("thumbnail", "https://dummyimage.com/480x360/cccccc/000000?text=No+Video"); // 대체 이미지
	            videoData.put("videoUrl", "#"); // 링크 없음 처리
	        }
	            
            YoutubeVideoDTO videoDTO = new YoutubeVideoDTO(
                videoData.get("title"),
                videoData.get("channel"),
                videoData.get("thumbnail"),
                videoData.get("videoUrl")
            );
            youtubeVideoDTOs.add(videoDTO);
	    }
		dto.setYoutubeSearchResults(youtubeVideoDTOs);
		
		log.info("UserRecordServiceImpl : " + dto);
		
		return dto;
	}
	
	
	@Override
	public List<UserRecordDTO> getLatestRecords(int userNumber) {
		List<UserRecordDTO> list = userRecordDAO.findLatestRecords(userNumber);

		for (int i = 0; i < list.size(); i++) {
			UserRecordDTO record = list.get(i);
			if (record != null) { // findLatestRecords()에서 가져온 레코드가 null일 가능성은 낮지만, 방어적으로 체크
//				UserRecordDTO fullRecord = findById(record.getId());
				UserRecordDTO fullRecord = findByIdWithVideoId(record.getId());
				if (fullRecord != null) {
					list.set(i, fullRecord); // 채워진 DTO로 리스트의 요소를 업데이트
					log.info("list {}: {}", i, list.get(i));
				}
			}
		}
		return list;
	}

	public List<Long> parseIds(String ids) {
		return Arrays.stream(ids.split(",")).map(String::trim).map(Long::parseLong).collect(Collectors.toList());
	}
}
