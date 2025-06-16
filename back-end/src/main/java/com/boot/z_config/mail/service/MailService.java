package com.boot.z_config.mail.service;

import java.io.UnsupportedEncodingException;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

public interface MailService {
    // MailService 클래스에서 구현하는 메서드들을 선언
    MimeMessage createMessage(String to) throws MessagingException, UnsupportedEncodingException;
    String createKey();
    String sendSimpleMessage(String to) throws Exception;
}