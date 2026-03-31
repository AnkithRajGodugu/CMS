package com.example.cms.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {

    private final JavaMailSender emailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.frontend.url:http://localhost:3001}")
    private String frontendUrl;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    // ─── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Returns true when real SMTP credentials have been configured.
     */
    private boolean isSmtpConfigured() {
        return mailEnabled
                && fromEmail != null && !fromEmail.isBlank()
                && mailPassword != null && !mailPassword.isBlank();
    }

    /**
     * Send an HTML email asynchronously.
     * Falls back to console logging when SMTP is not configured (dev mode).
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        if (!isSmtpConfigured()) {
            log.warn("╔══════════════════════════════════════════════════════════════╗");
            log.warn("║  [DEV MODE] SMTP not configured — email NOT sent             ║");
            log.warn("║  To: {}",  to);
            log.warn("║  Subject: {}", subject);
            log.warn("║  (configure MAIL_USERNAME + MAIL_PASSWORD in .env for real mail)");
            log.warn("╚══════════════════════════════════════════════════════════════╝");
            // Log the actual link embedded in the HTML so devs can copy-paste it
            String linkStart = htmlBody.indexOf("href=\"") >= 0
                    ? htmlBody.substring(htmlBody.indexOf("href=\"") + 6) : "";
            String link = linkStart.contains("\"") ? linkStart.substring(0, linkStart.indexOf("\"")) : "";
            if (!link.isBlank()) {
                log.warn("  ACTION LINK → {}", link);
            }
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = isHtml
            emailSender.send(message);
            log.info("Email '{}' sent successfully to {}", subject, to);
        } catch (MessagingException e) {
            log.error("Failed to send email '{}' to {}: {}", subject, to, e.getMessage(), e);
        } catch (Exception e) {
            log.error("Unexpected error sending email to {}: {}", to, e.getMessage(), e);
        }
    }

    // ─── Verification Email ───────────────────────────────────────────────────

    @Async
    public void sendVerificationEmail(String to, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String subject = "Verify your CMS Account";
        String html = buildVerificationEmailHtml(verificationUrl);
        sendHtmlEmail(to, subject, html);
    }

    // ─── Password Reset Email ─────────────────────────────────────────────────

    @Async
    public void sendPasswordResetEmail(String to, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "CMS — Password Reset Request";
        String html = buildPasswordResetEmailHtml(resetUrl);
        sendHtmlEmail(to, subject, html);
    }

    // ─── HTML Templates ───────────────────────────────────────────────────────

    private String buildPasswordResetEmailHtml(String resetUrl) {
        return "<!DOCTYPE html>" +
            "<html lang=\"en\">" +
            "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>Password Reset</title></head>" +
            "<body style=\"margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f4f6f9;\">" +
            "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f4f6f9;padding:40px 0;\">" +
            "    <tr><td align=\"center\">" +
            "      <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">" +
            // Header
            "        <tr><td style=\"background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:40px 48px;text-align:center;\">" +
            "          <div style=\"font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;\">🔐 CMS Platform</div>" +
            "          <div style=\"font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px;\">Content Management System</div>" +
            "        </td></tr>" +
            // Body
            "        <tr><td style=\"padding:48px;\">" +
            "          <h2 style=\"margin:0 0 16px;font-size:22px;font-weight:700;color:#1e293b;\">Password Reset Request</h2>" +
            "          <p style=\"margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;\">We received a request to reset the password for your CMS account. Click the button below to choose a new password. This link will expire in <strong>1 hour</strong>.</p>" +
            "          <div style=\"text-align:center;margin:32px 0;\">" +
            "            <a href=\"" + resetUrl + "\" style=\"display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#1e40af,#3b82f6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;\">Reset My Password</a>" +
            "          </div>" +
            "          <p style=\"margin:0 0 8px;font-size:13px;color:#94a3b8;\">Or copy and paste this URL into your browser:</p>" +
            "          <p style=\"margin:0 0 24px;font-size:12px;color:#3b82f6;word-break:break-all;\">" + resetUrl + "</p>" +
            "          <hr style=\"border:none;border-top:1px solid #e2e8f0;margin:24px 0;\">" +
            "          <p style=\"margin:0;font-size:13px;color:#94a3b8;line-height:1.6;\">If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>" +
            "        </td></tr>" +
            // Footer
            "        <tr><td style=\"background:#f8fafc;padding:24px 48px;text-align:center;border-top:1px solid #e2e8f0;\">" +
            "          <p style=\"margin:0;font-size:12px;color:#94a3b8;\">© 2025 CMS Platform. All rights reserved.</p>" +
            "        </td></tr>" +
            "      </table>" +
            "    </td></tr>" +
            "  </table>" +
            "</body></html>";
    }

    private String buildVerificationEmailHtml(String verificationUrl) {
        return "<!DOCTYPE html>" +
            "<html lang=\"en\">" +
            "<head><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1.0\"><title>Verify Email</title></head>" +
            "<body style=\"margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f4f6f9;\">" +
            "  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#f4f6f9;padding:40px 0;\">" +
            "    <tr><td align=\"center\">" +
            "      <table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);\">" +
            // Header
            "        <tr><td style=\"background:linear-gradient(135deg,#059669 0%,#10b981 100%);padding:40px 48px;text-align:center;\">" +
            "          <div style=\"font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;\">✉️ CMS Platform</div>" +
            "          <div style=\"font-size:14px;color:rgba(255,255,255,0.75);margin-top:6px;\">Account Verification</div>" +
            "        </td></tr>" +
            // Body
            "        <tr><td style=\"padding:48px;\">" +
            "          <h2 style=\"margin:0 0 16px;font-size:22px;font-weight:700;color:#1e293b;\">Welcome to CMS!</h2>" +
            "          <p style=\"margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;\">Thanks for signing up. Please verify your email address by clicking the button below to activate your account.</p>" +
            "          <div style=\"text-align:center;margin:32px 0;\">" +
            "            <a href=\"" + verificationUrl + "\" style=\"display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#059669,#10b981);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.3px;\">Verify My Email</a>" +
            "          </div>" +
            "          <p style=\"margin:0 0 8px;font-size:13px;color:#94a3b8;\">Or copy and paste this URL into your browser:</p>" +
            "          <p style=\"margin:0 0 24px;font-size:12px;color:#10b981;word-break:break-all;\">" + verificationUrl + "</p>" +
            "          <hr style=\"border:none;border-top:1px solid #e2e8f0;margin:24px 0;\">" +
            "          <p style=\"margin:0;font-size:13px;color:#94a3b8;line-height:1.6;\">If you did not create an account, you can safely ignore this email.</p>" +
            "        </td></tr>" +
            // Footer
            "        <tr><td style=\"background:#f8fafc;padding:24px 48px;text-align:center;border-top:1px solid #e2e8f0;\">" +
            "          <p style=\"margin:0;font-size:12px;color:#94a3b8;\">© 2025 CMS Platform. All rights reserved.</p>" +
            "        </td></tr>" +
            "      </table>" +
            "    </td></tr>" +
            "  </table>" +
            "</body></html>";
    }
}

