package com.boot.front.security.controller;

import com.boot.user.dto.UserDTO;
import com.boot.user.service.UserService;
import com.boot.z_config.security.PrincipalDetails;
import com.boot.z_config.security.jwt.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import java.util.ArrayList;
import java.util.HashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/user")
public class FrontSecurityController {

    private static final Logger log = LoggerFactory.getLogger(FrontSecurityController.class);

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    @Autowired
    private UserService userService;

    // 로그인 (JWT 토큰 발급)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, String> loginRequest, HttpServletResponse response) {
        String userId = loginRequest.get("userId");
        String userPw = loginRequest.get("userPw");

        if (userId == null || userPw == null) {
            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 누락되었습니다.");
        }

        try {
            // 1. Spring Security 인증 수행
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userId, userPw)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 2. 인증된 사용자 정보 추출 (추가 조회 없이 PrincipalDetails 사용)
            PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
            UserDTO authenticatedUser = principal.getUser(); // DB에서 조회된 정확한 데이터
            
            // 3. JWT 토큰 생성
            String token = jwtTokenUtil.generateToken(authentication);

            // 4. 디버깅 로그 추가
            log.debug("[로그인 성공] 사용자 번호: {}, 관리자 여부: {}", 
                authenticatedUser.getUserNumber(), 
                authenticatedUser.getUserAdmin()
            );

            // 5. 응답 데이터 구성
            HashMap<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("jwt_token", authenticatedUser); // 인증된 사용자 정보 직접 사용

            // 6. 쿠키 설정
            String cookieValue = String.format(
                "jwt_token=%s; Path=/; HttpOnly; Max-Age=1800; SameSite=None; Secure", 
                token
            );
            response.addHeader("Set-Cookie", cookieValue);

            return ResponseEntity.ok(responseData);

        } catch (AuthenticationException e) {
            log.warn("로그인 실패: {}", e.getMessage());
            return ResponseEntity.status(401).body("로그인 실패: 아이디 또는 비밀번호를 확인해주세요.");
        } catch (Exception e) {
            log.error("로그인 오류: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("서버 오류");
        }
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody HashMap<String, String> loginRequest, HttpServletResponse response) {
//        String userId = loginRequest.get("userId"); // 사용자 로그인 아이디 (String)
//        String userPw = loginRequest.get("userPw"); // 사용자 비밀번호 (String)
//
//        if (userId == null || userPw == null) {
//            return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 누락되었습니다.");
//        }
//
//        try {
//            // UsernamePasswordAuthenticationToken은 사용자 로그인 아이디와 비밀번호를 받습니다.
//            // AuthenticationManager는 내부적으로 PrincipalDetailsService를 호출하여
//            // 이 userId로 DB에서 사용자 정보를 조회하고, 비밀번호를 검증한 후,
//            // 인증된 PrincipalDetails 객체를 포함하는 Authentication 객체를 반환합니다.
//        	UserDTO authenticatedUser = userService.getUserInfo(loginRequest);
//            Authentication authentication = authenticationManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(userId, userPw)
//            );
//
//            // 인증 성공 시, SecurityContextHolder에 인증 객체를 설정합니다.
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            // JWT 토큰을 생성합니다. generateToken 메서드는 Authentication 객체로부터
//            // UserDetails(PrincipalDetails)를 가져와 토큰에 필요한 정보를 담습니다.
//            String token = jwtTokenUtil.generateToken(authentication);
//
//            // 크로스도메인 쿠키 저장을 위해 SameSite=None; Secure 명시적으로 추가
//            String cookieValue = "jwt_token=" + token + "; Path=/; HttpOnly; Max-Age=1800; SameSite=None; Secure";
//            response.addHeader("Set-Cookie", cookieValue);
//
////            PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
////            UserDTO authenticatedUser = userService.getUserInfo(loginRequest);
//            
////            log.info("2authenticatedUser=>"+authenticatedUser);
//            return ResponseEntity.ok().body(new HashMap<String, Object>() {{
//                put("token", token);
//                put("jwt_token", authenticatedUser); // 인증된 UserDTO 정보 포함
//            }});
//
//        } catch (org.springframework.security.core.AuthenticationException e) {
//            log.warn("로그인 실패: {}", e.getMessage());
//            // 인증 실패 (아이디/비밀번호 불일치 등)
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: 아이디 또는 비밀번호를 확인해주세요.");
//        } catch (Exception e) {
//            log.error("로그인 중 서버 오류 발생: {}", e.getMessage(), e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
//        }
//    
//    }

    // 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody HashMap<String, String> joinRequest) {
        int result = userService.userJoin(joinRequest);
        if (result > 0) {
            return ResponseEntity.ok().body("회원가입 성공");
        } else {
            return ResponseEntity.badRequest().body("회원가입 실패");
        }
    }

    // JWT 기반 사용자 정보 반환
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        // 인증이 없거나, 인증이 anonymousUser이거나, PrincipalDetails가 아니면 401 반환
        if (authentication == null || !authentication.isAuthenticated() ||
            authentication.getPrincipal() == null ||
            "anonymousUser".equals(authentication.getPrincipal()) ||
            !(authentication.getPrincipal() instanceof PrincipalDetails)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        UserDTO user = principal.getUser();
        // DB에서 최신 사용자 정보 조회
//        log.info("UserDTO user = principal.getUser();"+principal.getUser());
        HashMap<String, String> param = new HashMap<>();
        param.put("userId", user.getUserId());
        UserDTO fullUser = userService.getUserInfo(param);
        return ResponseEntity.ok(fullUser);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // JWT 쿠키 만료
        String cookieValue = "jwt_token=; Path=/; HttpOnly; Max-Age=0; SameSite=None; Secure";
        response.addHeader("Set-Cookie", cookieValue);
        return ResponseEntity.ok().body("로그아웃 성공");
    }
}
