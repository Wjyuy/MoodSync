

// JWT 토큰 저장 함수
function saveToken(token) {
    localStorage.setItem('jwtToken', token);
}

// JWT 토큰 가져오기 함수
function getToken() {
    return localStorage.getItem('jwtToken');
}

// JWT 토큰 삭제 함수
function removeToken() {
    localStorage.removeItem('jwtToken');
}

// 로그인 처리 함수
function handleLogin(event) {
    event.preventDefault();
    
    var userId = $('#userId').val();
    var userPw = $('#userPw').val();
    
    // AJAX를 사용하여 로그인 요청
    $.ajax({
        url: '/login',
        type: 'POST',
        data: {
            userId: userId,
            userPw: userPw
        },
        dataType: 'json',
        success: function(response) {
            if (response.token) {
                // JWT 토큰 저장
                saveToken(response.token);
                
                // 메인 페이지로 리다이렉트
                window.location.href = '/';
            } else {
                // 로그인 실패 메시지 표시
                $('#errorMessage').text(response.message || '로그인에 실패했습니다.');
                $('#loginErrorAlert').addClass('show');
            }
        },
        error: function(xhr, status, error) {
            // 오류 메시지 표시
            $('#errorMessage').text('로그인 처리 중 오류가 발생했습니다.');
            $('#loginErrorAlert').addClass('show');
            console.log('로그인 오류:', error);
        }
    });
}