package com.turfbook.controller;

import com.turfbook.dto.*;
import com.turfbook.dto.ApiDtos.*;
import com.turfbook.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
  private final AuthService auth;
  @PostMapping("/register") public ApiResponse<TokenResponse> register(@Valid @RequestBody RegisterRequest request) { return ApiResponse.ok("Account created", auth.register(request)); }
  @PostMapping("/login") public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request) { return ApiResponse.ok("Login successful", auth.login(request)); }
  @PostMapping("/google") public ApiResponse<TokenResponse> google(@Valid @RequestBody GoogleLoginRequest request) { return ApiResponse.ok("Google sign-in successful", auth.loginWithGoogle(request)); }
  @PostMapping("/refresh") public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) { return ApiResponse.ok("Token refreshed", auth.refresh(request)); }
  @PostMapping("/forgot-password") public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) { auth.forgotPassword(request); return ApiResponse.ok("If an account exists, a reset link has been sent", null); }
  @PostMapping("/reset-password") public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) { auth.resetPassword(request); return ApiResponse.ok("Password reset successful", null); }
  @PostMapping("/verify-email") public ApiResponse<Void> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) { auth.verifyEmail(request); return ApiResponse.ok("Email verified", null); }
  @PostMapping("/logout") public ApiResponse<Void> logout(@Valid @RequestBody RefreshRequest request) { auth.logout(request); return ApiResponse.ok("Logged out", null); }
  @GetMapping("/me") @PreAuthorize("isAuthenticated()") public ApiResponse<UserResponse> me() { return ApiResponse.ok("Account retrieved", auth.me()); }
}
