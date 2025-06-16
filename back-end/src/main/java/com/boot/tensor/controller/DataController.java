package com.boot.tensor.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.tensor.dto.ActingDTO;
import com.boot.tensor.dto.BookDTO;
import com.boot.tensor.dto.MusicDTO;
import com.boot.tensor.service.ActingService;
import com.boot.tensor.service.BookService;
import com.boot.tensor.service.MusicService;
import com.boot.userRecord.dao.YoutubeVideoDAO;
import com.boot.userRecord.dto.YoutubeVideoDTO;
import com.boot.userRecord.service.YoutubeService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api")
public class DataController {

	@Autowired
	private ActingService actingService;

	@Autowired
	private MusicService musicService;

	@Autowired
	private BookService bookService;

	@Autowired
	private YoutubeVideoDAO youtubeVideoDAO;
	@Autowired
	private YoutubeService youtubeService;
	
	@PostMapping("/emotion-result")
	public ResponseEntity<?> executePredict(@RequestBody Map<String, Object> payload) {
//	    log.info("@# 실행 emotion-result");
//	    log.info("@# payload =>" + payload);
	    
	    // tfResult에서 데이터 추출
	    Map<String, Object> tfResult = (Map<String, Object>) payload.get("tfResult");
	    Object userEmotionData = payload.get("userEmotionData");
	    
//	    log.info("@# userEmotionData =>" + userEmotionData);
	    
	    // null 체크
	    if (tfResult == null) {
	        return ResponseEntity.badRequest().body("tfResult 데이터가 없습니다.");
	    }
	    
	    // tfResult에서 각 데이터 추출
	    Map<String, Object> actMap = (Map<String, Object>) tfResult.get("act");
	    Map<String, Object> musicMap = (Map<String, Object>) tfResult.get("music");
	    Map<String, Object> bookMap = (Map<String, Object>) tfResult.get("book");
	    
	    // null 체크
	    if (actMap == null || musicMap == null || bookMap == null) {
	        return ResponseEntity.badRequest().body("필요한 데이터가 누락되었습니다.");
	    }
	    
	    int actPredictedClass = (int) actMap.get("predictedClass");
	    int musicPredictedClass = (int) musicMap.get("predictedClass");
	    int bookPredictedClass = (int) bookMap.get("predictedClass");
	    
//	    log.info("@# actPredictedClass =>" + actPredictedClass);
//	    log.info("@# musicPredictedClass =>" + musicPredictedClass);
//	    log.info("@# bookPredictedClass =>" + bookPredictedClass);

	    ArrayList<ActingDTO> act_dtos = actingService.getRandomActing(actPredictedClass + 1, userEmotionData);
	    ArrayList<MusicDTO> music_dtos = musicService.getRandomMusic(musicPredictedClass + 1, userEmotionData);
	    ArrayList<BookDTO> book_dtos = bookService.getRandomBook(bookPredictedClass + 1, userEmotionData);

	    
	    // youtube 정보 추가
	    List<YoutubeVideoDTO> youtubeVideoDTOs = new ArrayList<>();
	    
	    for (MusicDTO music : music_dtos) {
	        Long musicNumber = (long) (music.getMusicNumber()%600); // musicNumber 필드 필요
	        String videoId = youtubeVideoDAO.findVideoIdByMusicNumber(musicNumber);

	        Map<String, String> videoData = new HashMap<>();
	        if (videoId != null && !videoId.isEmpty()) {
	            try {
	                videoData = youtubeService.getVideoDetailsById(videoId);
	            } catch (IOException e) {
	                e.printStackTrace();
	                videoData.put("title", "API 실패");
	                videoData.put("channel", "API 실패");
	                videoData.put("thumbnail", "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg");
	                videoData.put("videoUrl", "https://www.youtube.com/watch?v=" + videoId);
	            }
	        } else {
	            videoData.put("title", "영상 없음");
	            videoData.put("channel", "미등록");
	            videoData.put("thumbnail", "https://dummyimage.com/480x360/cccccc/000000?text=No+Video");
	            videoData.put("videoUrl", "#");
	        }

	        YoutubeVideoDTO videoDTO = new YoutubeVideoDTO(
	            videoData.get("title"),
	            videoData.get("channel"),
	            videoData.get("thumbnail"),
	            videoData.get("videoUrl")
	        );

	        youtubeVideoDTOs.add(videoDTO);
	    }
	    
	    Map<String, Object> result = new HashMap<>();
	    result.put("act_dtos", act_dtos);
	    result.put("music_dtos", music_dtos);
	    result.put("book_dtos", book_dtos);
	    result.put("youtube_videos", youtubeVideoDTOs);
	    
	    log.info("@# result =>" + result);

	    return ResponseEntity.ok(result);
	}

	// 해당 감정 통해서 랜덤 3개의 음악, 행동, 도서 추출
	// 행동
//	public ArrayList<ActingDTO> getListActing(int emotionNumber) {
//		ArrayList<ActingDTO> acting_dtos = actingService.getRandomActing(emotionNumber);
//		return acting_dtos;
//	}

	// 음악
//	public ArrayList<MusicDTO> getListMusic(int emotionNumber) {
//		ArrayList<MusicDTO> music_dtos = musicService.getRandomMusic(emotionNumber);
//		return music_dtos;
//	}

//	// 도서
//	public ArrayList<BookDTO> getListBook(int emotionNumber) {
//
//		ArrayList<BookDTO> book_dtos = bookService.getRandomBook(emotionNumber);
//		return book_dtos;
//	}
}