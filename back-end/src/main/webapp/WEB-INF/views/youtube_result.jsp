<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
</head>

<body>
	<h2>"${keyword}" 관련 유튜브 영상</h2>
	<c:forEach var="video" items="${videos}">
	    <div style="margin-bottom: 20px;">
	        <img src="${video.thumbnail}" width="200"><br>
	        <strong>${video.title}</strong><br>
	        <span>채널: ${video.channel}</span><br>
	        <a href="${video.videoUrl}" target="_blank">▶ 영상 보기</a>
	    </div>
	</c:forEach>
</body>
</html>