package com.turfbook.service;

import com.turfbook.dto.ApiDtos.*;
import com.turfbook.entity.*;
import com.turfbook.enums.RoleName;
import com.turfbook.exception.ApiException;
import com.turfbook.repository.*;
import com.turfbook.security.*;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import io.jsonwebtoken.JwtException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.*;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class AuthService {
  private static final Logger log = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository users;
  private final RoleRepository roles;
  private final RefreshTokenRepository refreshTokens;
  private final PasswordResetTokenRepository passwordResetTokens;
  private final EmailVerificationTokenRepository emailVerificationTokens;
  private final PasswordEncoder passwords;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwt;
  private final ResponseMapper mapper;
  private final CurrentUserService currentUser;
  @Value("${app.google.client-id:}") private String googleClientId;

  @Transactional
  public TokenResponse register(RegisterRequest request) {
    String email = request.email().trim().toLowerCase(Locale.ROOT);
    if (users.existsByEmailIgnoreCase(email)) throw ApiException.conflict("An account already exists for this email");
    Role userRole = roles.findByName(RoleName.USER).orElseThrow(() -> new IllegalStateException("USER role is not seeded"));
    UserAccount user = new UserAccount();
    user.setFullName(request.fullName().trim()); user.setEmail(email); user.setPhone(request.phone().trim());
    user.setPasswordHash(passwords.encode(request.password())); user.setRoles(new HashSet<>(Set.of(userRole)));
    users.save(user);
    createEmailVerification(user);
    return issueTokens(user);
  }
  @Transactional
  public TokenResponse login(LoginRequest request) {
    try {
      Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(Locale.ROOT), request.password()));
      return issueTokens(users.findByEmailIgnoreCase(authentication.getName()).orElseThrow());
    } catch (AuthenticationException ex) { throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid email or password"); }
  }
  @Transactional
  public TokenResponse loginWithGoogle(GoogleLoginRequest request) {
    if (googleClientId == null || googleClientId.isBlank()) throw new ApiException(org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE, "Google sign-in has not been configured yet");
    try {
      GoogleIdToken token = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
          .setAudience(List.of(googleClientId)).build().verify(request.credential());
      if (token == null) throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Google could not verify this account");
      GoogleIdToken.Payload profile = token.getPayload();
      String email = Optional.ofNullable(profile.getEmail()).map(value -> value.trim().toLowerCase(Locale.ROOT))
          .filter(value -> !value.isBlank()).orElseThrow(() -> ApiException.badRequest("Google did not provide an email address"));
      if ("admin@gmail.com".equals(email)) throw ApiException.forbidden("Use the private administrator sign-in for this account");
      if (!Boolean.TRUE.equals(profile.getEmailVerified())) throw ApiException.forbidden("Your Google email address must be verified before it can be used here");
      UserAccount user = users.findByEmailIgnoreCase(email).orElseGet(() -> createGoogleUser(email, profile));
      if (!user.isActive()) throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "This account is inactive");
      if (user.getRoles().stream().anyMatch(role -> role.getName() == RoleName.ADMIN)) throw ApiException.forbidden("Use the private administrator sign-in for this account");
      String name = Optional.ofNullable((String) profile.get("name")).filter(value -> !value.isBlank()).orElse(user.getFullName());
      user.setFullName(name.length() > 80 ? name.substring(0, 80) : name);
      user.setAvatarUrl((String) profile.get("picture"));
      user.setEmailVerified(true);
      return issueTokens(user);
    } catch (IOException | java.security.GeneralSecurityException ex) {
      throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Google could not verify this account");
    }
  }
  @Transactional
  public TokenResponse refresh(RefreshRequest request) {
    try {
      if (!jwt.isRefreshToken(request.refreshToken())) throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid refresh token");
      RefreshToken stored = refreshTokens.findByTokenId(jwt.tokenId(request.refreshToken()))
          .filter(token -> !token.isRevoked() && token.getExpiresAt().isAfter(Instant.now()))
          .orElseThrow(() -> new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Refresh token expired or revoked"));
      stored.setRevoked(true);
      return issueTokens(stored.getUser());
    } catch (JwtException | IllegalArgumentException ex) { throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Invalid refresh token"); }
  }
  public UserResponse me() { return mapper.user(currentUser.require()); }
  @Transactional
  public void forgotPassword(ForgotPasswordRequest request) {
    users.findByEmailIgnoreCase(request.email().trim()).ifPresent(user -> {
      String rawToken = UUID.randomUUID().toString();
      PasswordResetToken token = new PasswordResetToken(); token.setUser(user); token.setTokenHash(sha256(rawToken)); token.setExpiresAt(Instant.now().plus(Duration.ofMinutes(30)));
      passwordResetTokens.save(token);
      // Replace this development log with a mail provider implementation in production.
      log.info("Password reset token generated for {}: {}", user.getEmail(), rawToken);
    });
  }
  @Transactional
  public void resetPassword(ResetPasswordRequest request) {
    PasswordResetToken token = passwordResetTokens.findByTokenHash(sha256(request.token()))
        .filter(t -> t.getUsedAt() == null && t.getExpiresAt().isAfter(Instant.now()))
        .orElseThrow(() -> ApiException.badRequest("The reset link is invalid or expired"));
    token.getUser().setPasswordHash(passwords.encode(request.password())); token.setUsedAt(Instant.now());
    refreshTokens.revokeActiveTokens(token.getUser().getId());
  }
  @Transactional
  public void verifyEmail(VerifyEmailRequest request) {
    EmailVerificationToken token = emailVerificationTokens.findByTokenHash(sha256(request.token()))
        .filter(t -> t.getUsedAt() == null && t.getExpiresAt().isAfter(Instant.now()))
        .orElseThrow(() -> ApiException.badRequest("The verification link is invalid or expired"));
    token.getUser().setEmailVerified(true); token.setUsedAt(Instant.now());
  }
  @Transactional
  public void logout(RefreshRequest request) {
    try { refreshTokens.findByTokenId(jwt.tokenId(request.refreshToken())).ifPresent(token -> token.setRevoked(true)); }
    catch (JwtException | IllegalArgumentException ignored) { }
  }
  private TokenResponse issueTokens(UserAccount user) {
    UserPrincipal principal = UserPrincipal.from(user);
    refreshTokens.revokeActiveTokens(user.getId());
    String refreshId = UUID.randomUUID().toString();
    RefreshToken stored = new RefreshToken(); stored.setUser(user); stored.setTokenId(refreshId); stored.setExpiresAt(jwt.refreshExpiry()); refreshTokens.save(stored);
    return new TokenResponse(jwt.issueAccessToken(principal), jwt.issueRefreshToken(principal, refreshId), mapper.user(user));
  }
  private UserAccount createGoogleUser(String email, GoogleIdToken.Payload profile) {
    Role userRole = roles.findByName(RoleName.USER).orElseThrow(() -> new IllegalStateException("USER role is not seeded"));
    String name = Optional.ofNullable((String) profile.get("name")).filter(value -> !value.isBlank()).orElse("TurfBook Player");
    UserAccount user = new UserAccount();
    user.setEmail(email); user.setFullName(name.length() > 80 ? name.substring(0, 80) : name); user.setEmailVerified(true);
    user.setAvatarUrl((String) profile.get("picture")); user.setPasswordHash(passwords.encode(UUID.randomUUID().toString()));
    user.setRoles(new HashSet<>(Set.of(userRole)));
    return users.save(user);
  }
  private void createEmailVerification(UserAccount user) {
    String rawToken = UUID.randomUUID().toString();
    EmailVerificationToken token = new EmailVerificationToken(); token.setUser(user); token.setTokenHash(sha256(rawToken)); token.setExpiresAt(Instant.now().plus(Duration.ofHours(24)));
    emailVerificationTokens.save(token);
    // Development email adapter: replace this log with SMTP/transactional email delivery in production.
    log.info("Email verification token generated for {}: {}", user.getEmail(), rawToken);
  }
  private String sha256(String value) {
    try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8))); }
    catch (Exception ex) { throw new IllegalStateException("SHA-256 is unavailable", ex); }
  }
}
