<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<!DOCTYPE html>
<html>
<head><title>Bing 검색 결과</title></head>
<body>

	<h2>"${keyword}" 관련 검색 결과</h2>
	<c:forEach var="item" items="${resultList}">
	    <div style="margin-bottom: 20px;">
	        <a href="${item.link}" target="_blank">
	            <strong>${item.title}</strong>
	        </a><br>
	        <p>${item.summary}</p>
	        <small>URL: <a href="${item.link}" target="_blank">${item.link}</a></small>
	    </div>
	</c:forEach>

</body>
</html>