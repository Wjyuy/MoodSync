package com.boot.analize.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.boot.analize.dao.UserClusteringDAO;
import com.boot.analize.dto.UserClusteringDTO;
import com.boot.analize.util.CustomPair;


@Service
public class UserClusteringServiceOld {

	private final UserClusteringDAO userClusteringDAO;

	public UserClusteringServiceOld(UserClusteringDAO userClusteringDAO) {
		this.userClusteringDAO = userClusteringDAO;
	}

	// 1. 데이터 수집 (최근 데이터)
	public List<UserClusteringDTO> collectEmotionData() {
		return userClusteringDAO.findRecentEmotionData();
	}

	// 1-1. 날짜별 감정 데이터 조회
	public List<UserClusteringDTO> collectEmotionDataByDate(String created_at) {
		return userClusteringDAO.findEmotionDataByDate(created_at);
	}

	// 2. 데이터 전처리 (List<UserClusteringDTO> -> double[][] 형태로 변환)
	public double[][] preprocessData(List<UserClusteringDTO> rawData) {
		double[][] data = new double[rawData.size()][6]; // 6개 감정

		for (int i = 0; i < rawData.size(); i++) {
			UserClusteringDTO dto = rawData.get(i);
			data[i][0] = dto.getHappy();
			data[i][1] = dto.getSad();
			data[i][2] = dto.getStress();
			data[i][3] = dto.getCalm();
			data[i][4] = dto.getExcited();
			data[i][5] = dto.getTired();
		}
		return data;
	}

	// 3. 최적 클러스터 수 계산 (엘보우 방법)
	public int determineOptimalClusters(double[][] data) {
		int maxK = Math.min(10, data.length);
		int maxIterations = 100;
		int n = data.length;
		int dim = data[0].length;

		double[] distortions = new double[maxK];
		Random random = new Random();

		for (int k = 1; k <= maxK; k++) {
			// 초기 중심점 랜덤 선택
			double[][] centroids = new double[k][dim];
			Set<Integer> chosen = new HashSet<>();
			for (int i = 0; i < k; i++) {
				int index;
				do {
					index = random.nextInt(n);
				} while (!chosen.add(index));
				centroids[i] = Arrays.copyOf(data[index], dim);
			}

			int[] labels = new int[n];

			// KMeans 반복
			for (int iter = 0; iter < maxIterations; iter++) {
				boolean changed = false;

				// 할당
				for (int i = 0; i < n; i++) {
					int bestCluster = -1;
					double bestDist = Double.MAX_VALUE;
					for (int j = 0; j < k; j++) {
						double dist = 0.0;
						for (int d = 0; d < dim; d++) {
							double diff = data[i][d] - centroids[j][d];
							dist += diff * diff;
						}
						if (dist < bestDist) {
							bestDist = dist;
							bestCluster = j;
						}
					}
					if (labels[i] != bestCluster) {
						changed = true;
						labels[i] = bestCluster;
					}
				}

				if (!changed)
					break;

				// 중심점 업데이트
				double[][] newCentroids = new double[k][dim];
				int[] counts = new int[k];
				for (int i = 0; i < n; i++) {
					int cluster = labels[i];
					for (int d = 0; d < dim; d++) {
						newCentroids[cluster][d] += data[i][d];
					}
					counts[cluster]++;
				}
				for (int j = 0; j < k; j++) {
					if (counts[j] == 0) {
						// 중심 재초기화 (무작위로 다시 지정)
						newCentroids[j] = Arrays.copyOf(data[random.nextInt(n)], dim);
						continue;
					}
					for (int d = 0; d < dim; d++) {
						newCentroids[j][d] /= counts[j];
					}
				}
				centroids = newCentroids;
			}

			// Distortion 계산
			double distortion = 0.0;
			for (int i = 0; i < n; i++) {
				int cluster = labels[i];
				double dist = 0.0;
				for (int d = 0; d < dim; d++) {
					double diff = data[i][d] - centroids[cluster][d];
					dist += diff * diff;
				}
				distortion += dist;
			}

			distortions[k - 1] = distortion;
		}

		// 엘보우 포인트 탐색
		int optimalK = 2;
		double maxDrop = 0.0;
		for (int i = 1; i < maxK - 1; i++) {
			double drop = distortions[i - 1] - distortions[i];
			if (drop > maxDrop) {
				maxDrop = drop;
				optimalK = i + 1;
			}
		}

		return optimalK;
	}

	// 4. K-Means 클러스터링 실행
	public Map<String, List<UserClusteringDTO>> performKMeansClustering(List<UserClusteringDTO> rawData,
			double[][] data, int k) {

		int maxIterations = 100;
		int n = data.length;
		int dim = data[0].length;

		// 1. 초기 중심점 무작위 선택
		double[][] centroids = new double[k][dim];
		Random rand = new Random();
		Set<Integer> chosenIndexes = new HashSet<>();
		for (int i = 0; i < k; i++) {
			int index;
			do {
				index = rand.nextInt(n);
			} while (chosenIndexes.contains(index));
			chosenIndexes.add(index);
			centroids[i] = Arrays.copyOf(data[index], dim);
		}

		// 2. 클러스터 라벨 배열
		int[] labels = new int[n];

		for (int iter = 0; iter < maxIterations; iter++) {
			boolean changed = false;

			// 3. 각 데이터 포인트에 가장 가까운 중심점 할당
			for (int i = 0; i < n; i++) {
				int nearest = 0;
				double minDist = euclideanDistance(data[i], centroids[0]);

				for (int j = 1; j < k; j++) {
					double dist = euclideanDistance(data[i], centroids[j]);
					if (dist < minDist) {
						minDist = dist;
						nearest = j;
					}
				}

				if (labels[i] != nearest) {
					changed = true;
					labels[i] = nearest;
				}
			}

			// 4. 수렴하면 중지
			if (!changed)
				break;

			// 5. 각 클러스터 중심 재계산
			double[][] newCentroids = new double[k][dim];
			int[] count = new int[k];

			for (int i = 0; i < n; i++) {
				int cluster = labels[i];
				for (int d = 0; d < dim; d++) {
					newCentroids[cluster][d] += data[i][d];
				}
				count[cluster]++;
			}

			for (int j = 0; j < k; j++) {
				if (count[j] == 0)
					continue;
				for (int d = 0; d < dim; d++) {
					newCentroids[j][d] /= count[j];
				}
			}

			centroids = newCentroids;
		}

		// 6. 결과 매핑
		Map<String, List<UserClusteringDTO>> result = new HashMap<>();
		for (int i = 0; i < n; i++) {
			String clusterName = "Cluster " + labels[i];
			result.computeIfAbsent(clusterName, key -> new ArrayList<>()).add(rawData.get(i));
		}

		return result;
	}

	private double euclideanDistance(double[] a, double[] b) {
		double sum = 0.0;
		for (int i = 0; i < a.length; i++) {
			double diff = a[i] - b[i];
			sum += diff * diff;
		}
		return Math.sqrt(sum);
	}

	public Map<String, CustomPair<String, Double>> analyzeEmotionCohesionByDate(String created_at) {
		List<UserClusteringDTO> rawData = collectEmotionDataByDate(created_at);
		if (rawData == null || rawData.isEmpty()) {
			return Collections.emptyMap();
		}

		double[][] data = preprocessData(rawData);
		double[][] corrMatrix = calculateCorrelationMatrix(data);
		return findHighestCohesionPerEmotion(corrMatrix);
	}

	// 감정별 피어슨 상관계수 행렬 계산
	private double[][] calculateCorrelationMatrix(double[][] data) {
		int n = data.length; // 샘플 수 (사람 수)
		int dim = data[0].length; // 감정 개수 (6)

		// 감정별 데이터 벡터로 분리
		double[][] emotionVectors = new double[dim][n];
		for (int i = 0; i < n; i++) {
			for (int j = 0; j < dim; j++) {
				emotionVectors[j][i] = data[i][j];
			}
		}

		double[][] corrMatrix = new double[dim][dim];

		for (int i = 0; i < dim; i++) {
			for (int j = 0; j < dim; j++) {
				corrMatrix[i][j] = pearsonCorrelation(emotionVectors[i], emotionVectors[j]);
			}
		}
		return corrMatrix;
	}

	// 피어슨 상관계수 계산 함수
	private double pearsonCorrelation(double[] x, double[] y) {
		int n = x.length;
		double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

		for (int i = 0; i < n; i++) {
			sumX += x[i];
			sumY += y[i];
			sumXY += x[i] * y[i];
			sumX2 += x[i] * x[i];
			sumY2 += y[i] * y[i];
		}

		double numerator = n * sumXY - sumX * sumY;
		double denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

		if (denominator == 0)
			return 0;

		return numerator / denominator;
	}

	private Map<String, CustomPair<String, Double>> findHighestCohesionPerEmotion(double[][] corrMatrix) {
		Map<String, CustomPair<String, Double>> result = new LinkedHashMap<>();
		String[] emotions = { "happy", "sad", "stress", "calm", "excited", "tired" };

		for (int i = 0; i < corrMatrix.length; i++) {
			double maxVal = -2.0; // -1 ~ 1 범위 밖으로 초기화
			int maxIndex = -1;

			for (int j = 0; j < corrMatrix[i].length; j++) {
				if (i != j && corrMatrix[i][j] > maxVal) {
					maxVal = corrMatrix[i][j];
					maxIndex = j;
				}
			}

			result.put(emotions[i], new CustomPair<>(emotions[maxIndex], maxVal));
		}

		return result;
	}
}
