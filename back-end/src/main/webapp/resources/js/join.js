$(document).ready(() => {
  // 단계별 진행 관리
  let currentStep = 1
  updateProgressBar(currentStep)

  // 이메일 인증 관련 변수
  let emailVerificationSent = false // 인증번호 발송 여부
  let emailVerified = false // 이메일 인증 완료 여부
  let serverCode = "" // 서버에서 받은 인증번호
  let isButtonDisabled = false // 버튼 클릭 제한 변수

  // 다음 단계 버튼 클릭 이벤트
  $(".next-step").on("click", function () {
    const nextStep = Number.parseInt($(this).data("next"))

    // 현재 단계 유효성 검사
    if (validateStep(currentStep)) {
      // 현재 단계 완료 표시
      $(".step[data-step='" + currentStep + "']")
        .removeClass("active")
        .addClass("completed")
        .html('<span class="step-label">' + $(".step[data-step='" + currentStep + "'] .step-label").text() + "</span>")

      // 체크 표시 추가
      $(".step[data-step='" + currentStep + "']").append('<i class="fas fa-check"></i>')

      // 다음 단계 활성화
      $(".step[data-step='" + nextStep + "']").addClass("active")

      // 폼 단계 전환
      $(".form-step").removeClass("active")
      $("#step" + nextStep).addClass("active")

      // 현재 단계 업데이트
      currentStep = nextStep

      // 진행 바 업데이트
      updateProgressBar(currentStep)

      // 마지막 단계에서는 입력 정보 요약 표시
      if (currentStep === 4) {
        updateSummary()
      }

      // 페이지 상단으로 스크롤
      scrollToTop()
    }
  })

  // 이전 단계 버튼 클릭 이벤트
  $(".prev-step").on("click", function () {
    const prevStep = Number.parseInt($(this).data("prev"))

    // 현재 단계 비활성화
    $(".step[data-step='" + currentStep + "']").removeClass("active")

    // 이전 단계 활성화 (완료 표시 유지)
    $(".step[data-step='" + prevStep + "']")
      .removeClass("completed")
      .addClass("active")

    // 폼 단계 전환
    $(".form-step").removeClass("active")
    $("#step" + prevStep).addClass("active")

    // 현재 단계 업데이트
    currentStep = prevStep

    // 진행 바 업데이트
    updateProgressBar(currentStep)

    // 페이지 상단으로 스크롤
    scrollToTop()
  })

  // 진행 바 업데이트 함수
  function updateProgressBar(step) {
    const totalSteps = 4
    const progressPercentage = ((step - 1) / (totalSteps - 1)) * 100
    document.documentElement.style.setProperty("--progress-width", progressPercentage + "%")
  }

  // 단계별 유효성 검사 함수
  function validateStep(step) {
//    console.log("현재 검증 단계:", step) // 디버깅용 로그
    
    switch (step) {
      case 1:
        // 약관 동의 확인
        if (!$("#termsAgree").is(":checked")) {
          alert("이용약관에 동의해주세요.")
          return false
        }
        if (!$("#privacyAgree").is(":checked")) {
          alert("개인정보 수집 및 이용에 동의해주세요.")
          return false
        }
        return true

      case 2:
        // 이메일 인증 확인
        if (!emailVerified) {
          alert("이메일 인증을 완료해주세요.")
          return false
        }
        return true

      case 3:
//        console.log("3단계 검증 시작") // 디버깅용 로그
        
        // 아이디 검증
        const userId = $("input[name='userId']").val()
        if (!userId) {
          alert("아이디를 입력해주세요.")
          $("input[name='userId']").focus()
          return false
        }
        
        const userIdPattern = /^[a-zA-Z0-9]{4,12}$/
        if (!userIdPattern.test(userId)) {
          alert("아이디는 영문, 숫자로 4~12자로 입력해주세요.")
          $("input[name='userId']").focus()
          return false
        }
        
        // 이름 검증
        const userName = $("input[name='userName']").val()
        if (!userName) {
          alert("이름을 입력해주세요.")
          $("input[name='userName']").focus()
          return false
        }
        
        const userNamePattern = /^[가-힣]{2,4}$/
        if (!userNamePattern.test(userName)) {
          alert("이름은 한글 2~4자로 입력해주세요.")
          $("input[name='userName']").focus()
          return false
        }
        
        // 비밀번호 검증
        const password = $("#userPw").val()
        if (!password) {
          alert("비밀번호를 입력해주세요.")
          $("#userPw").focus()
          return false
        }
        
        // 비밀번호 패턴 검증 - 정규식에서 공백 제거
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,16}$/
//        console.log("비밀번호 패턴 검증:", passwordPattern.test(password)) // 디버깅용 로그
        
        if (!passwordPattern.test(password)) {
          alert("비밀번호는 영문, 숫자, 특수문자를 포함하여 6~16자로 입력해주세요.")
          $("#userPw").focus()
          return false
        }
        
        // 비밀번호 확인 검증
        const confirmPassword = $("#pwdConfirm").val()
        if (!confirmPassword) {
          alert("비밀번호 확인을 입력해주세요.")
          $("#pwdConfirm").focus()
          return false
        }
        
        if (password !== confirmPassword) {
          alert("비밀번호가 일치하지 않습니다.")
          $("#pwdConfirm").focus()
          return false
        }
        
        // 전화번호 검증
        const userTel = $("input[name='userTel']").val()
        if (!userTel) {
          alert("전화번호를 입력해주세요.")
          $("input[name='userTel']").focus()
          return false
        }
        
        const telPattern = /^010-\d{4}-\d{4}$/
        if (!telPattern.test(userTel)) {
          alert("올바른 전화번호 형식(010-0000-0000)으로 입력해주세요.")
          $("input[name='userTel']").focus()
          return false
        }
        
        // 생년월일 검증
        const userBirth = $("input[name='userBirth']").val()
        if (!userBirth) {
          alert("생년월일을 선택해주세요.")
          return false
        }
        
        // 주소 검증
        const userZipCode = $("input[name='userZipCode']").val()
        if (!userZipCode) {
          alert("우편번호를 입력해주세요.")
          $("input[name='userZipCode']").focus()
          return false
        }
        
        const userAddress = $("input[name='userAddress']").val()
        if (!userAddress) {
          alert("주소를 입력해주세요.")
          $("input[name='userAddress']").focus()
          return false
        }
        
//        console.log("3단계 검증 완료 - 통과") // 디버깅용 로그
        return true

      default:
        return true
    }
  }

  // 요약 정보 업데이트 함수
  function updateSummary() {
    $("#summary-userId").text($("input[name='userId']").val())
    $("#summary-userName").text($("input[name='userName']").val())
    $("#summary-userEmail").text($("input[name='userEmail']").val())
    $("#summary-userTel").text($("input[name='userTel']").val())

    // 비밀번호 필드 값 확인 (디버깅용)
//    console.log("비밀번호 필드 값 존재 여부:", $("input[name='userPw']").val() ? "있음" : "없음")
    
    const address = $("input[name='userZipCode']").val() + " " + $("input[name='userAddress']").val()
    const detailAddress = $("input[name='userDetailAddress']").val()

    if (detailAddress) {
      $("#summary-userAddress").text(address + " " + detailAddress)
    } else {
      $("#summary-userAddress").text(address)
    }
  }

  // 페이지 상단으로 스크롤 함수
  function scrollToTop() {
    $("html, body").animate(
      {
        scrollTop: $(".progress-container").offset().top - 20,
      },
      300,
    )
  }

  // 인증번호 발송 버튼 클릭 이벤트
  $("#checkEmail").click(function () {
    if (isButtonDisabled) {
      return
    }
    const email = $("#userEmail").val()

    if (!email) {
      alert("이메일을 입력해주세요.")
      return
    }
    


    // 이메일 형식 검증
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(email)) {
      alert("올바른 이메일 형식이 아닙니다.")
      return
    }

	// 서버에 이메일 인증 요청
	$.ajax({
	  type: "POST",
	  url: "/mailConfirm",
	  dataType: "json", // 응답 형식을 JSON으로 변경
	  data: {
	    email: email,
	  },
	  success: (response) => {
	    if (response.success) {
	      alert("해당 이메일로 인증번호 발송이 완료되었습니다.");
	      console.log("받은 인증코드: " + response.code);
		  
		  // 인증번호 발송 버튼 완전히 비활성화 (클릭 이벤트 제거)
		  $("#checkEmail").off("click")
		  $("#userEmail").off("input")
		  $("#userEmail").prop("readonly", true).css("opacity", "0.7")
		  $("#checkEmail").off("click").css("opacity", "0.7")
		  
	      // 인증번호 입력 필드 표시
	      $("#verificationCodeGroup").show();
	      emailVerificationSent = true;

	      // 서버에서 받은 인증번호 저장
	      serverCode = response.code;
	    } else {
	      alert(response.message); // 서버에서 보낸 오류 메시지 표시
	      $("#email").focus(); // 이메일 입력 필드에 포커스
	    }
	  },
	  error: (xhr, status, error) => {
	    if (xhr.status === 409) { // 409 Conflict - 이메일 중복
	      const response = JSON.parse(xhr.responseText);
	      alert(response.message);
	    } else {
	      alert("이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.");
	      console.error("이메일 발송 오류:", xhr.status, error);
	      console.log("응답 텍스트:", xhr.responseText);
	    }
	  },
	});
  })

  // 인증 확인 버튼 클릭 이벤트
  $("#verifyEmailBtn").click(() => {
    const inputCode = $("#verificationCode").val()

    if (!inputCode) {
      alert("인증번호를 입력해주세요.")
      return
    }

    const isValid = serverCode === inputCode

    updateVerificationStatus(isValid)

    if (isValid) {
      alert("이메일 인증이 완료되었습니다.")
    } else {
      alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.")
    }
  })

  // 인증 상태 메시지 표시 함수
  function updateVerificationStatus(isValid) {
    const message = isValid ? "인증번호 확인 완료" : "인증번호가 잘못되었습니다"
    const color = isValid ? "#0D6EFD" : "#FA3E3E"

    $("#memailconfirmTxt").html(`<span id='emconfirmchk'>${message}</span>`)
    $("#emconfirmchk").css({
      color: color,
      "font-weight": "bold",
      "font-size": "12px",
    })

    // 인증 상태 업데이트
    emailVerified = isValid

    // 인증 완료 시 입력 필드와 버튼 비활성화
    if (isValid) {
      $("#verificationCode").prop("disabled", true)
      $("#userEmail").prop("readonly", true)
      $("#checkEmail").prop("disabled", true).css("opacity", "0.5")
      $("#verifyEmailBtn").prop("disabled", true).css("opacity", "0.5")


    }
  }

  // 전화번호 입력 시 하이픈 자동 추가
  $("#userTel").on("input", function () {
    // 숫자만 추출
    let value = $(this)
      .val()
      .replace(/[^0-9]/g, "")

    // 길이에 따라 하이픈 추가
    if (value.length > 3 && value.length <= 7) {
      // 010-XXXX 형식
      value = value.substring(0, 3) + "-" + value.substring(3)
    } else if (value.length > 7) {
      // 010-XXXX-XXXX 형식
      value = value.substring(0, 3) + "-" + value.substring(3, 7) + "-" + value.substring(7, 11)
    }

    // 최대 13자리로 제한 (010-XXXX-XXXX)
    if (value.length > 13) {
      value = value.substring(0, 13)
    }

    // 값 설정
    $(this).val(value)
  })

  // 생년월일 선택 제한 (만 19세 이상)

  // 생년월일 선택 개선 코드
    // 기존 생년월일 입력 필드를 숨김
    const birthInput = $("input[name='userBirth']")
    birthInput.hide()

    // 생년월일 입력 필드 컨테이너 생성
    const birthContainer = $("<div>").addClass("birth-date-container")
    birthInput.after(birthContainer)

    // 년, 월, 일 선택 드롭다운 생성
    const yearSelect = $("<select>").attr("id", "birth-year").addClass("birth-select")
    const monthSelect = $("<select>").attr("id", "birth-month").addClass("birth-select")
    const daySelect = $("<select>").attr("id", "birth-day").addClass("birth-select")

    // 레이블 추가
    const yearLabel = $("<span>").addClass("birth-label").text("년")
    const monthLabel = $("<span>").addClass("birth-label").text("월")
    const dayLabel = $("<span>").addClass("birth-label").text("일")

    // 컨테이너에 요소 추가
    birthContainer.append(yearSelect, yearLabel, monthSelect, monthLabel, daySelect, dayLabel)

    // 현재 날짜 가져오기
    const today = new Date()
    const currentYear = today.getFullYear()

    // 만 19세 계산
    const minAge = 19
    const maxYear = currentYear - minAge

    // 년도 옵션 추가 (만 19세 이상만 선택 가능)
    // 2006년 전체가 선택 가능하도록 설정
    for (let year = maxYear; year >= 1900; year--) {
      const option = $("<option>").val(year).text(year)
      yearSelect.append(option)
    }

    // 월 옵션 추가
    for (let month = 1; month <= 12; month++) {
      const option = $("<option>").val(month).text(month)
      monthSelect.append(option)
    }

    // 일 옵션 업데이트 함수
    function updateDays() {
      daySelect.empty()

      const year = Number.parseInt(yearSelect.val())
      const month = Number.parseInt(monthSelect.val())

      // 해당 월의 마지막 날짜 계산
      const lastDay = new Date(year, month, 0).getDate()

      for (let day = 1; day <= lastDay; day++) {
        const option = $("<option>").val(day).text(day)
        daySelect.append(option)
      }
    }

    // 년, 월 변경 시 일 옵션 업데이트
    yearSelect.on("change", updateDays)
    monthSelect.on("change", updateDays)

    // 초기 일 옵션 설정
    updateDays()

    // 드롭다운 값이 변경될 때 원래 input 필드 업데이트
    function updateBirthInput() {
      const year = yearSelect.val()
      const month = Number.parseInt(monthSelect.val())
      const day = Number.parseInt(daySelect.val())

      // YYYY-MM-DD 형식으로 변환
      const formattedMonth = month < 10 ? "0" + month : month
      const formattedDay = day < 10 ? "0" + day : day
      const dateString = `${year}-${formattedMonth}-${formattedDay}`

      // 원래 input 필드 업데이트
      birthInput.val(dateString)
    }

    // 드롭다운 값 변경 시 이벤트 핸들러
    yearSelect.on("change", updateBirthInput)
    monthSelect.on("change", updateBirthInput)
    daySelect.on("change", updateBirthInput)

    // 힌트 텍스트 업데이트
    birthInput.siblings(".input-hint").text("생년월일을 선택해주세요. (만 19세 이상)")

    // 스타일 추가
    $("<style>")
      .text(`
      .birth-date-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .birth-select {
        padding: 8px 12px;
        border: 1px solid var(--gray-200);
        border-radius: var(--border-radius);
        font-size: 16px;
        flex: 1;
      }
      .birth-label {
        font-size: 16px;
        color: var(--gray-500);
      }
      #birth-year {
        flex: 1.2;
      }
      #birth-month, #birth-day {
        flex: 0.8;
      }
    `)
      .appendTo("head")

    // 초기값 설정 (2006년 1월 1일)
    yearSelect.val(2006)
    monthSelect.val(1)
    updateDays() // 일 옵션 업데이트
    daySelect.val(1)
    updateBirthInput() // 원래 input 필드 업데이트
})

// 주소 검색 함수
function searchAddress() {
  new daum.Postcode({
    oncomplete: (data) => {
      // 우편번호와 도로명 주소 설정
      const zipCode = document.getElementById("zipCode")
      const userAddress = document.getElementById("userAddress")

      zipCode.value = data.zonecode
      userAddress.value = data.roadAddress

      zipCode.readOnly = true
      userAddress.readOnly = true
    },
  }).open()
}

// 비밀번호 일치 확인 함수
function checkPasswordMatch(input) {
  var password = document.getElementById("userPw").value
  var confirmError = document.getElementById("pwMatchError")

  if (input.value !== password) {
    input.setCustomValidity("비밀번호가 일치하지 않습니다.")
    confirmError.style.display = "block"
  } else {
    input.setCustomValidity("")
    confirmError.style.display = "none"
  }
}

// 비밀번호 강도 확인 함수
function checkPasswordStrength(input) {
  var password = input.value
  var strengthBar = document.getElementById("passwordStrengthBar")
  var strength = 0

  if (password.length >= 6) strength += 1
  if (password.length >= 10) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1

  // Update the strength bar
  switch (strength) {
    case 0:
      strengthBar.style.width = "0%"
      strengthBar.style.backgroundColor = "#e11d48"
      break
    case 1:
      strengthBar.style.width = "20%"
      strengthBar.style.backgroundColor = "#e11d48"
      break
    case 2:
      strengthBar.style.width = "40%"
      strengthBar.style.backgroundColor = "#f59e0b"
      break
    case 3:
      strengthBar.style.width = "60%"
      strengthBar.style.backgroundColor = "#f59e0b"
      break
    case 4:
      strengthBar.style.width = "80%"
      strengthBar.style.backgroundColor = "#10b981"
      break
    case 5:
      strengthBar.style.width = "100%"
      strengthBar.style.backgroundColor = "#10b981"
      break
  }
  
  // HTML5 유효성 검사 메시지 초기화
  input.setCustomValidity("")
}

// 폼 제출 함수
function fn_submit() {
  // 비밀번호 유효성 검사를 JavaScript로 직접 수행
  const password = $("#userPw").val();
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,16}$/;
  
  if (!passwordPattern.test(password)) {
    alert("비밀번호는 영문, 숫자, 특수문자를 포함하여 6~16자로 입력해주세요.");
    $("#userPw").focus();
    return;
  }
  
  // 비밀번호 일치 확인
  const confirmPassword = $("#pwdConfirm").val();
  if (password !== confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    $("#pwdConfirm").focus();
    return;
  }
  
  // HTML 폼 유효성 검사 우회
  // 비밀번호 필드의 pattern 속성 제거
  $("#userPw").removeAttr("pattern");
  
  // 폼 데이터 수집
  var formData = $("#joinForm").serialize();
  
  // 디버깅용 로그
//  console.log("전송할 데이터:", formData);
  
  // 서버로 데이터 전송
  $.ajax({
    type: "post",
    data: formData,
    url: "joinProc",
    success: (data) => {
      alert("회원가입이 정상적으로 처리되었습니다.");
      location.href = "loginForm";
    },
    error: (xhr, status, error) => {
      console.error("서버 오류 상세 정보:", xhr.status, error);
      console.error("응답 텍스트:", xhr.responseText);
      
      if (xhr.status === 409) {
        alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.");
      } else {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    },
  });
}
// 비밀번호 보기/숨기기 토글 함수
function togglePasswordVisibility(inputId, icon) {
  const passwordInput = document.getElementById(inputId);
  
  // 입력 필드 타입 변경
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    passwordInput.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
}