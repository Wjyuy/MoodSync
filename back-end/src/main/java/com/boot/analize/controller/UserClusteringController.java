package com.boot.analize.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.boot.analize.dto.UserClusteringDTO;
import com.boot.analize.service.UserClusteringService;
import com.boot.analize.util.CustomPair;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class UserClusteringController {

    private final UserClusteringService userClusteringService;

    @GetMapping("/analize-cohesion")
    public ResponseEntity<?> analyze(@RequestParam String created_at) {
        Map<String, Map<String, Object>> result = userClusteringService.analyzeEmotionCohesion(created_at);
        return ResponseEntity.ok(result);
    }

    
//    @GetMapping("/analize-collection")
//    public ResponseEntity<Map<String, List<UserClusteringDTO>>> clusterByDate(
//            @RequestParam String created_at) {
//
//        log.info("Request received for date: {}", created_at);
//
//        List<UserClusteringDTO> rawData = userClusteringService.collectEmotionDataByDate(created_at);
//        log.info("Data size fetched: {}", rawData.size());
//
//        if (rawData.isEmpty()) {
//            return ResponseEntity.ok(Collections.emptyMap());
//        }
//
//        double[][] data = userClusteringService.preprocessData(rawData);
//
//        // 데이터가 1개 이하일 경우, 클러스터링 없이 바로 반환
//        if (data.length <= 1) {
//            Map<String, List<UserClusteringDTO>> singleCluster = new HashMap<>();
//            singleCluster.put("Cluster 0", rawData);
//            return ResponseEntity.ok(singleCluster);
//        }
//
//        int optimalK = userClusteringService.determineOptimalClusters(data);
//
//        // 클러스터 개수가 데이터 수보다 크면 조정
//        if (optimalK > data.length) {
//            optimalK = data.length;
//        }
//        if (optimalK < 1) {
//            optimalK = 1;
//        }
//        log.info("Optimal clusters determined: {}", optimalK);
//
//        Map<String, List<UserClusteringDTO>> clustered = userClusteringService.performKMeansClustering(rawData, data, optimalK);
//
//        return ResponseEntity.ok(clustered);
//    }
}

