package com.turfbook.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
  private final JwtService jwt;
  private final UserDetailsService users;
  @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String authorization = request.getHeader("Authorization");
    if (authorization == null || !authorization.startsWith("Bearer ")) { chain.doFilter(request, response); return; }
    String token = authorization.substring(7);
    try {
      if (jwt.isAccessToken(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
        var principal = users.loadUserByUsername(jwt.email(token));
        var auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);
      }
    } catch (JwtException | IllegalArgumentException ignored) {
      // Leave the context anonymous; protected endpoints return 401 through Spring Security.
    }
    chain.doFilter(request, response);
  }
}
