package com.boot.z_config.security;

import com.boot.z_config.security.jwt.JwtTokenUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler
{
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException
    {
        // 토큰생성
        String token = jwtTokenUtil.generateToken(authentication);
        
        Cookie jwtCookie = new Cookie("jwt_token", token);
        jwtCookie.setPath("/"); // 리다이렉트 경로
        jwtCookie.setHttpOnly(true); // js에서 접근 못 하도록
        jwtCookie.setMaxAge(1 * 24 * 60 * 60); // 유효 1일
        
        // HTTPS 환경에서는 Secure 플래그 추가
        if (request.isSecure()) {
            jwtCookie.setSecure(true);
        }
        
        response.addCookie(jwtCookie);
        
        // 홈으로 이동
        response.sendRedirect("/");
    }
}
