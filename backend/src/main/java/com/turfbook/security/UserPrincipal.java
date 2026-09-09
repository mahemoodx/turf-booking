package com.turfbook.security;

import com.turfbook.entity.UserAccount;
import java.util.*;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public record UserPrincipal(UUID id, String email, String password, boolean active,
                            Collection<? extends GrantedAuthority> authorities) implements UserDetails {
  public static UserPrincipal from(UserAccount user) {
    var authorities = user.getRoles().stream()
        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName().name())).toList();
    return new UserPrincipal(user.getId(), user.getEmail(), user.getPasswordHash(), user.isActive(), authorities);
  }
  @Override public String getUsername() { return email; }
  @Override public String getPassword() { return password; }
  @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
  @Override public boolean isAccountNonExpired() { return active; }
  @Override public boolean isAccountNonLocked() { return active; }
  @Override public boolean isCredentialsNonExpired() { return active; }
  @Override public boolean isEnabled() { return active; }
}
