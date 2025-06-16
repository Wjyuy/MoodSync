<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
	<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
		<html>

		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>test login</title>
			<link rel="stylesheet" type="text/css" href="/resources/css/loginview.css">
			<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
			<script src="/resources/js/login.js"></script>
		</head>

		<body>

			<div class="container">
				<div class="login-logo">
					<div class="login-logo-icon">
						<i class="fa-solid fa-train-subway"></i>
					</div>
				</div>
현재 새로고침되면 비번 || 아이디틀림
<!--				<div id="loginErrorAlert" class="session-alert"-->
<!--					style="background-color: #f8d7da; color: #721c24; border-color: #f5c6cb;">-->
<!--					<strong>오류:</strong> <span id="errorMessage">아이디 또는 비밀번호가 일치하지-->
<!--						않습니다.</span>-->
<!--				</div>-->


				<form method="post" action="/login" class="login-form" id="loginForm">
					<div class="form-group">
						<label for="userId">아이디</label>
						<input type="text" id="userId" name="userId" placeholder="아이디를 입력하세요" required>
					</div>

					<div class="form-group">
						<label for="userPw">비밀번호</label>
						<input type="password" id="userPw" name="userPw" placeholder="비밀번호를 입력하세요" required>
					</div>

<!--					<div class="forgot-password">-->
<!--						<a href="/forgotPassword">비밀번호를 잊으셨나요?</a>-->
<!--					</div>-->

					<div class="button-group">
						<input type="submit" value="로그인" class="btn btn-primary">
					</div>
				</form>

<!--				<div class="login-options">-->
<!--					<p>또는 다음 계정으로 로그인</p>-->
<!--					<div class="social-login">-->
<!--					    <a href="/oauth2/authorization/naver" class="social-btn"> <img src="/resources/images/naver-icon.png"-->
<!--					                                                                   alt="네이버 로그인"-->
<!--					                                                                   onerror="this.src='/resources/images/naver-default.png'; this.onerror=null;">-->
<!--					    </a> <a href="/oauth2/authorization/kakao" class="social-btn"> <img src="/resources/images/kakao-icon.png"-->
<!--					                                                                        alt="카카오 로그인"-->
<!--					                                                                        onerror="this.src='/resources/images/kakao-default.png'; this.onerror=null;">-->
<!--					</a>-->
<!--					    <a href="/oauth2/authorization/google" class="social-btn"> <img src="/resources/images/google-icon.png"-->
<!--					                                                                    alt="구글 로그인"-->
<!--					                                                                    onerror="this.src='/resources/images/google-default.png'; this.onerror=null;">-->
<!--					    </a>-->
<!--					</div>-->

					<p>
						메트로하우스 회원이 아니신가요? <a href="/joinForm"
							style="color: #1e3a8a; text-decoration: none;">회원가입</a>
					</p>
				</div>
			</div>

			<script>
				$(document).ready(function () {
					// 전역 변수 선언
					var hasConnectionError = false;
					var hasExistingSession = false; // 중복 로그인 상태를 추적하는 변수 추가

					// URL 파라미터 확인하여 로그인 실패 메시지 표시
					function checkLoginError() {
						var urlParams = new URLSearchParams(window.location.search);
						if (urlParams.has('error')) {
							$('#loginErrorAlert').addClass('show');
						} else {
							$('#loginErrorAlert').removeClass('show');
						}
					}

					// 페이지 로드 시 로그인 오류 확인
					checkLoginError();

					// 아이디 입력 필드에서 포커스가 빠질 때 중복 로그인 확인
					$('#userId').blur(function () {
						var userId = $(this).val();
						if (userId) {
							checkExistingSession(userId);
						}
					});

					// 중복 로그인 확인 함수
					function checkExistingSession(userId) {
						$.ajax({
							url: '/checkExistingSession',
							type: 'POST',
							data: {
								userId: userId
							},
							dataType: 'json',
							headers: {
								"X-Requested-With": "XMLHttpRequest" // AJAX 요청임을 명시
							},
							success: function (response) {
								if (response.exists) {
									// 중복 로그인 상태 설정
									hasExistingSession = true;
									// 로그인 오류 메시지 숨기기
									$('#loginErrorAlert').removeClass('show');
								} else {
									// 중복 로그인 상태 해제
									hasExistingSession = false;
								}
							},
							error: function (xhr, status, error) {
								console.log('세션 확인 중 오류가 발생했습니다:', error);
								// 오류 발생 시 조용히 처리하고 사용자 경험에 영향을 주지 않음
								hasConnectionError = true;
								hasExistingSession = false;

								// 개발 중에만 상세 오류 확인
								if (xhr.responseText) {
									console.log('응답 내용:', xhr.responseText.substring(0, 100) + '...');
								}
							}
						});
					}

					// 로그인 폼 제출 시 처리
					$('#loginForm').submit(function (e) {
						var userId = $('#userId').val();

						// 아이디가 비어있거나 연결 오류가 있으면 기본 제출 동작 수행
						if (!userId || hasConnectionError) {
							return true;
						}

						// 중복 로그인 상태인 경우 확인 팝업 표시
						if (hasExistingSession) {
							e.preventDefault(); // 폼 제출 중단

							alert('다른 기기에서 이미 로그인된 계정입니다.');
							return false; // 폼 제출 중단
						}

						// 중복 로그인이 아닌 경우 폼 제출 진행
						return true;
					});

					// 5분마다 세션 유효성 확인
					var sessionCheckInterval = 300000; // 5분
					var sessionCheckTimer = null;

					function startSessionCheck() {
						sessionCheckTimer = setInterval(function () {
							try {
								checkSessionValidity();
							} catch (e) {
								console.log('세션 체크 중 오류:', e);
							}
						}, sessionCheckInterval);
					}

					// 페이지 로드 시 세션 체크 시작
					startSessionCheck();
				});
			</script>
		</body>

		</html>