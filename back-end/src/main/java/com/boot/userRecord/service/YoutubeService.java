package com.boot.userRecord.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface YoutubeService {
	public List<Map<String, String>> searchVideos(String query) throws IOException;
	public Map<String, String> getVideoDetailsById(String videoId) throws IOException;
	public Map<String, String> searchVideo(String query) throws IOException;
}
