package com.boot.z_config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.boot.z_config.security.jwt.JwtAuthenticationEntryPoint;
import com.boot.z_config.security.jwt.JwtAuthenticationFilter;
import com.boot.z_config.security.jwt.JwtAuthenticationSuccessHandler;
import com.boot.z_config.socialLogin.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

	@Autowired
	private CustomUserDetailsService userDetailsService;

	@Autowired
	private CustomAuthenticationFailureHandler failureHandler;

	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Autowired
	private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

	@Autowired
	private JwtAuthenticationSuccessHandler jwtAuthenticationSuccessHandler;

	@Autowired
	private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http, CustomOAuth2UserService customOAuth2UserService)
			throws Exception {
		return http.csrf().disable()
				// CORS 설정 제거 (WebConfig에서 처리)
				.cors().and()
				// JWT 필터 추가
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
				// 세션 관리
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED).and()
				// 인증 예외 처리
				.exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and()
				// 요청 권한 설정
				.authorizeRequests().antMatchers("/user/login", "/user/register", // 프론트단 JWT 로그인/회원가입
						"/", "/auth/**", "/resources/**", "/js/**", "/css/**", "/images/**", "/checkExistingSession",
						"/loginForm", "/joinForm", "/joinProc", "/mailConfirm", "/oauth2/**", "/login/oauth2/**",
						"/oauth/naver", "/oauth/kakao", "/test/**", "/api/**")
				.permitAll().antMatchers("/user/me").authenticated() // 프론트 JWT 기반 사용자 정보 반환
				.anyRequest().authenticated().and()
				// 폼 로그인 설정
				.formLogin().loginPage("/loginForm").loginProcessingUrl("/login").usernameParameter("userId")
				.passwordParameter("userPw").successHandler(jwtAuthenticationSuccessHandler)
				.failureHandler(failureHandler).and()
				// OAuth2 로그인 설정
				.oauth2Login().loginPage("/loginForm").userInfoEndpoint().userService(customOAuth2UserService).and()
				.successHandler(oAuth2AuthenticationSuccessHandler).and()
				// 로그아웃 설정
				.logout().logoutRequestMatcher(new AntPathRequestMatcher("/logout")).logoutSuccessUrl("/loginForm")
				.deleteCookies("jwt_token").invalidateHttpSession(true).clearAuthentication(true).and()
				// 인증 관리자 설정
				.userDetailsService(userDetailsService).build();
	}

	// corsConfigurationSource 메서드 제거

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}
}