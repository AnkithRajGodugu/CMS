package com.example.cms.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username:noreply@cms.com}")
    private String fromEmail;

    /**
     * Send an asynchronous email.
     * @param to recipient email address
     * @param subject email subject
     * @param text email body
     */
    @Async
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            emailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}", to, e);
        }
    }

    @Value("${app.frontend.url:http://localhost:3001}")
    private String frontendUrl;

    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your CMS Account";
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String text = "Welcome to CMS!\n\n" +
                "Please click the link below to verify your email address:\n" +
                verificationUrl + "\n\n" +
                "If you did not register for an account, please ignore this email.";
        
        sendEmail(to, subject, text);
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "CMS Password Reset Request";
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String text = "You have requested to reset your password.\n\n" +
                "Please click the link below to set a new password:\n" +
                resetUrl + "\n\n" +
                "If you did not request a password reset, please ignore this email.";
        
        sendEmail(to, subject, text);
    }
}
