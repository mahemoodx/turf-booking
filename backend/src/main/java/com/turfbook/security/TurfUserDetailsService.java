package com.turfbook.security;

import com.turfbook.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TurfUserDetailsService implements UserDetailsService {
  private final UserRepository users;
  @Override public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    return users.findByEmailIgnoreCase(email)
        .map(UserPrincipal::from)
        .orElseThrow(() -> new UsernameNotFoundException("Account not found"));
  }
}
