<%@page import="com.boot.user.dto.UserDTO" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>test</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/resources/css/main.css">
	<script src="/resources/js/subway_section.js"></script>
	<script src="/resources/js/main.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>
    <div class="container">
	<c:choose>
	    <c:when test="${not empty user}">
            <div class="welcome-banner">
                <div class="welcome-text">
					<h1>안녕하세요, <span>${user.userName}</span>님</h1>
                </div>
                <div class="date-display">
                    <i class="fas fa-calendar-alt"></i> <span id="current-date">
						<jsp:useBean id="now" class="java.util.Date" />
						    <fmt:formatDate value="${now}" pattern="yyyy년 MM월 dd일 EEEE" />
                    </span>
                </div>
            </div>

	</c:when>
	    <c:otherwise>
                <div class="login-section">
                    <a href="loginForm" class="btn"> <i class="fas fa-sign-in-alt"></i> 로그인 하러 가기
                    </a>
                    <p style="margin-top: 20px;">
                        계정이 없으신가요? <a href="joinForm">회원가입</a>
                    </p>
                </div>
</c:otherwise>
</c:choose>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Animate statistics numbers
            const statNumbers = document.querySelectorAll('.number');

            statNumbers.forEach(number => {
                const finalValue = number.textContent.trim();
                let startValue = 0;
                const duration = 1500;
                const increment = parseInt(finalValue.replace(/,/g, '')) / (duration / 20);

                const animateValue = () => {
                    startValue += increment;
                    if (startValue < parseInt(finalValue.replace(/,/g, ''))) {
                        number.textContent = Math.floor(startValue).toLocaleString();
                        requestAnimationFrame(animateValue);
                    } else {
                        number.textContent = finalValue;
                    }
                };

                requestAnimationFrame(animateValue);
            });

            // 슬라이더 인디케이터 기능
            const indicators = document.querySelectorAll('.indicator');
            const slides = document.querySelectorAll('.slide');

            indicators.forEach(indicator => {
                indicator.addEventListener('click', function () {
                    const index = this.getAttribute('data-index');

                    // 모든 슬라이드와 인디케이터에서 active 클래스 제거
                    slides.forEach(slide => slide.classList.remove('active'));
                    indicators.forEach(ind => ind.classList.remove('active'));

                    // 선택한 슬라이드와 인디케이터에 active 클래스 추가
                    slides[index].classList.add('active');
                    this.classList.add('active');
                });
            });

            // 슬라이드 자동 전환 함수
            function nextSlide() {
                var currentSlide = $('.slide.active');
                var nextSlide = currentSlide.next('.slide').length ? currentSlide.next('.slide') : $('.slide:first-child');

                // 인디케이터도 함께 업데이트
                var currentIndex = $('.slide').index(currentSlide);
                var nextIndex = $('.slide').index(nextSlide);

                $('.indicator').removeClass('active');
                $('.indicator[data-index="' + nextIndex + '"]').addClass('active');

                currentSlide.removeClass('active');
                nextSlide.addClass('active');
            }

            // 5초마다 슬라이드 전환
            setInterval(nextSlide, 5000);
        });
    </script>
</body>
</html>