<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>메트로 하우스 - 회원가입</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
	<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
	<link rel="stylesheet" type="text/css" href="/resources/css/joinview.css">
	<script src="/resources/js/join.js"></script>
</head>

<body>
    <div class="container">

        <form id="joinForm">
            <div class="form-step" id="step2">
                <div class="form-group full-width">
                    <label>이메일 <span class="required-mark">*</span></label>
                    <div class="email-group">
                        <input type="email" name="userEmail" id="userEmail" required placeholder="example@email.com"
                            pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                            oninvalid="this.setCustomValidity('올바른 이메일 주소 형식으로 입력해주세요.')"
                            oninput="setCustomValidity('')">
                        <button type="button" class="verify-button" id="checkEmail">인증번호 발송</button>
                    </div>
<!--                    <span class="input-hint">이메일 주소를 입력해주세요.</span>-->
<!--                    <span class="error-message">올바른 이메일 주소 형식으로 입력해주세요.</span>-->

                    <!-- 인증번호 입력 필드 -->
                    <div id="verificationCodeGroup" class="email-group" style="margin-top: 10px; display: none;">
                        <input type="text" id="verificationCode" placeholder="인증번호 입력" required>
                        <button type="button" class="verify-button" id="verifyEmailBtn">인증 확인</button>
                    </div>
                    <div id="memailconfirmTxt" style="margin-top: 5px;"></div>
                </div>


            </div>

            <!-- 단계 3: 정보 입력 -->
            <div class="form-step" id="step3">
                <div class="form-group">
                    <label>아이디 <span class="required-mark">*</span></label>
                    <input type="text" name="userId" required placeholder="영문, 숫자로 4~12자 입력"
                        pattern="^[a-zA-Z0-9]{4,12}$" oninvalid="this.setCustomValidity('아이디는 영문, 숫자로 4~12자로 입력해주세요.')"
                        oninput="setCustomValidity('')">
<!--                    <span class="input-hint">영문, 숫자를 조합하여 4~12자로 입력해주세요.</span>-->
<!--                    <span class="error-message">아이디는 영문, 숫자로 4~12자로 입력해주세요.</span>-->
                </div>

                <div class="form-group">
                    <label>이름 <span class="required-mark">*</span></label>
                    <input type="text" name="userName" required placeholder="한글 2~4자 입력" pattern="^[가-힣]{2,4}$"
                        oninvalid="this.setCustomValidity('이름은 한글 2~4자로 입력해주세요.')" oninput="setCustomValidity('')">
<!--                    <span class="input-hint">한글 2~4자로 입력해주세요.</span>-->
<!--                    <span class="error-message">이름은 한글 2~4자로 입력해주세요.</span>-->
                </div>

				<div class="form-group">
				    <label>비밀번호 <span class="required-mark">*</span></label>
				    <div class="password-input-container">
				        <input type="password" name="userPw" id="userPw" required 
				               placeholder="영문, 숫자, 특수문자 포함 8~16자" 
				               oninput="checkPasswordStrength(this); setCustomValidity('')">
				        <i class="toggle-password fas fa-eye-slash" onclick="togglePasswordVisibility('userPw', this)"></i>
				    </div>
				    <div class="password-strength">
				        <div class="password-strength-bar" id="passwordStrengthBar"></div>
				    </div>
<!--				    <span class="input-hint">영문, 숫자, 특수문자를 포함하여 6~16자로 입력해주세요.</span>-->
<!--				    <span class="error-message">비밀번호는 영문, 숫자, 특수문자를 포함하여 6~16자로 입력해주세요.</span>-->
				</div>

				<div class="form-group">
				    <label>비밀번호 확인 <span class="required-mark">*</span></label>
				    <div class="password-input-container">
				        <input type="password" name="pwdConfirm" id="pwdConfirm" required placeholder="비밀번호를 다시 입력"
				            oninput="checkPasswordMatch(this)">
				        <i class="toggle-password fas fa-eye-slash" onclick="togglePasswordVisibility('pwdConfirm', this)"></i>
				    </div>
<!--				    <span class="input-hint">비밀번호를 한번 더 입력해주세요.</span>-->
<!--				    <span class="error-message" id="pwMatchError">비밀번호가 일치하지 않습니다.</span>-->
				</div>

                <div class="form-row">
                    <div class="form-group">
                        <label>전화번호 <span class="required-mark">*</span></label>
                        <input type="tel" name="userTel" required placeholder="010-0000-0000" id="userTel"
                            pattern="^010-\d{4}-\d{4}$"
                            oninvalid="this.setCustomValidity('올바른 전화번호 형식(010-0000-0000)으로 입력해주세요.')"
                            oninput="setCustomValidity('')">
<!--                        <span class="input-hint">010-0000-0000 형식으로 입력해주세요.</span>-->
<!--                        <span class="error-message">올바른 전화번호 형식(010-0000-0000)으로 입력해주세요.</span>-->
                    </div>

                    <div class="form-group">
                        <label>생년월일 <span class="required-mark">*</span></label>
                        <input type="date" name="userBirth" required oninvalid="this.setCustomValidity('생년월일을 선택해주세요.')"
                            oninput="setCustomValidity('')">
<!--                        <span class="input-hint">생년월일을 선택해주세요.</span>-->
<!--                        <span class="error-message">생년월일을 선택해주세요.</span>-->
                    </div>
                </div>

                <div class="form-group full-width">
                    <label>주소 <span class="required-mark">*</span></label>

                    <input type="text" name="userZipCode" id="zipCode" required placeholder="우편번호 입력"
                        oninvalid="this.setCustomValidity('우편번호를 선택해주세요.')" oninput="setCustomValidity('')" readonly>


<!--                    <span class="input-hint">우편번호를 입력해주세요.</span>-->
<!--                    <span class="error-message">우편번호를 입력해주세요.</span>-->
                    <div class="address-search">
                        <input type="text" name="userAddress" id="userAddress" required placeholder="도로명 또는 지번 주소 입력"
                            oninvalid="this.setCustomValidity('주소를 입력해주세요.')" oninput="setCustomValidity('')" readonly>
                        <button type="button" onclick="searchAddress()">주소 검색</button>
                    </div>
<!--                    <span class="input-hint">도로명 또는 지번 주소를 입력해주세요.</span>-->
<!--                    <span class="error-message">주소를 입력해주세요.</span>-->
                </div>

                <div class="form-group full-width">
                    <label>상세 주소</label>
                    <input type="text" name="userDetailAddress" placeholder="상세 주소 입력 (선택사항)">
<!--                    <span class="input-hint">아파트/호수 등 상세 주소를 입력해주세요.</span>-->
                </div>


            </div>

                <div class="button-group">
                    <button type="button" class="btn btn-primary" onclick="fn_submit()">회원가입</button>
                </div>
        </form>
    </div>
</body>

</html>