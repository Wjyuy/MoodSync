package com.boot.userRecord.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

@Service("YoutubeService")
public class YoutubeServiceImpl implements YoutubeService {
	@Value("${youtube.api}")
	private String API_KEY;

	private static final String SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

	@Override
	public List<Map<String, String>> searchVideos(String query) throws IOException {
		String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
		String urlStr = SEARCH_URL + "?part=snippet" + "&q=" + encodedQuery + "&type=video" + "&maxResults=1" + "&key="
				+ API_KEY;

		URL url = new URL(urlStr);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");

		try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
			String json = reader.lines().collect(Collectors.joining());
			JSONObject jsonObj = new JSONObject(json);
			JSONArray items = jsonObj.getJSONArray("items");

			List<Map<String, String>> results = new ArrayList<>();
			for (int i = 0; i < items.length(); i++) {
				JSONObject item = items.getJSONObject(i);
				JSONObject snippet = item.getJSONObject("snippet");
				String videoId = item.getJSONObject("id").getString("videoId");

				Map<String, String> data = new HashMap<>();
				data.put("title", snippet.getString("title"));
				data.put("channel", snippet.getString("channelTitle"));
				data.put("thumbnail", snippet.getJSONObject("thumbnails").getJSONObject("high").getString("url"));
				data.put("videoUrl", "https://www.youtube.com/watch?v=" + videoId);
				results.add(data);
			}
			return results;
		}
	}

	@Override
	public Map<String, String> searchVideo(String query) throws IOException {
		String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
		String urlStr = SEARCH_URL + "?part=snippet" + "&q=" + encodedQuery + "&type=video" + "&maxResults=1" + "&key=" + API_KEY;

		URL url = new URL(urlStr);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");

		try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
			String json = reader.lines().collect(Collectors.joining());
			JSONObject jsonObj = new JSONObject(json);
			JSONArray items = jsonObj.getJSONArray("items");

			if (items.length() > 0) {
				JSONObject item = items.getJSONObject(0); // Get the first item
				JSONObject snippet = item.getJSONObject("snippet");
				String videoId = item.getJSONObject("id").getString("videoId");

				Map<String, String> data = new HashMap<>();
				data.put("title", snippet.getString("title"));
				data.put("channel", snippet.getString("channelTitle"));
				data.put("thumbnail", snippet.getJSONObject("thumbnails").getJSONObject("high").getString("url"));
				data.put("videoUrl", "https://www.youtube.com/watch?v=" + videoId);
				return data;
			} else {
				return null; // No videos found
			}
		}
	}
	
	//test videoId로 조회
	public Map<String, String> getVideoDetailsById(String videoId) throws IOException {
	    String apiUrl = "https://www.googleapis.com/youtube/v3/videos"
	        + "?part=snippet"
	        + "&id=" + videoId
	        + "&key=" + API_KEY;

	    URL url = new URL(apiUrl);
	    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	    conn.setRequestMethod("GET");

	    try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
	        String json = reader.lines().collect(Collectors.joining());
	        JSONObject jsonObj = new JSONObject(json);
	        JSONArray items = jsonObj.getJSONArray("items");

	        if (items.length() > 0) {
	            JSONObject item = items.getJSONObject(0);
	            JSONObject snippet = item.getJSONObject("snippet");

	            Map<String, String> data = new HashMap<>();
	            data.put("title", snippet.getString("title"));
	            data.put("channel", snippet.getString("channelTitle"));
	            data.put("thumbnail", snippet.getJSONObject("thumbnails").getJSONObject("high").getString("url"));
	            data.put("videoUrl", "https://www.youtube.com/watch?v=" + videoId);
	            return data;
	        } else {
	            return null;
	        }
	    }
	}

    
    // test YouTube RSS Feed 방식 <- 503 error
//    @Override
//    public Map<String, String> searchVideo(String query) throws IOException {
//        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
//        String urlStr = "https://rsshub.app/youtube/search/" + encodedQuery;
//
//        URL url = new URL(urlStr);
//        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//        conn.setRequestMethod("GET");
//
//        try {
//            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//            DocumentBuilder builder = factory.newDocumentBuilder();
//            Document doc = builder.parse(conn.getInputStream());
//            doc.getDocumentElement().normalize();
//
//            NodeList entries = doc.getElementsByTagName("entry");
//            if (entries.getLength() == 0) {
//                return null;
//            }
//
//            Element entry = (Element) entries.item(0);
//
//            String title = entry.getElementsByTagName("title").item(0).getTextContent();
//            String videoUrl = entry.getElementsByTagName("link").item(0).getAttributes()
//                                   .getNamedItem("href").getTextContent();
//            String channel = entry.getElementsByTagName("author").item(0)
//                                  .getFirstChild().getTextContent();
//            String thumbnail = entry.getElementsByTagName("media:thumbnail").item(0)
//                                    .getAttributes().getNamedItem("url").getTextContent();
//
//            Map<String, String> data = new HashMap<>();
//            data.put("title", title);
//            data.put("channel", channel);
//            data.put("thumbnail", thumbnail);
//            data.put("videoUrl", videoUrl);
//            return data;
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
}
