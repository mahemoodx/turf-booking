package com.turfbook.service;

import com.turfbook.entity.UserAccount;
import com.turfbook.exception.ApiException;
import com.turfbook.repository.UserRepository;
import com.turfbook.security.UserPrincipal;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class CurrentUserService {
  private final UserRepository users;
  public UserAccount require() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal principal))
      throw new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Authentication is required");
    return users.findById(principal.id()).orElseThrow(() -> new ApiException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Account no longer exists"));
  }
  public UUID id() { return require().getId(); }
  public boolean hasRole(String role) { return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_" + role)); }
}
