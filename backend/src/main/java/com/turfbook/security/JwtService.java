package com.turfbook.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.time.*;
import java.util.*;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey signingKey;
  private final Duration accessLifetime;
  private final Duration refreshLifetime;

  public JwtService(@Value("${app.jwt.secret}") String encodedSecret,
                    @Value("${app.jwt.access-minutes}") long accessMinutes,
                    @Value("${app.jwt.refresh-days}") long refreshDays) {
    signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(encodedSecret));
    accessLifetime = Duration.ofMinutes(accessMinutes);
    refreshLifetime = Duration.ofDays(refreshDays);
  }
  public String issueAccessToken(UserPrincipal user) {
    return issue(user, "access", accessLifetime, UUID.randomUUID().toString());
  }
  public String issueRefreshToken(UserPrincipal user, String tokenId) {
    return issue(user, "refresh", refreshLifetime, tokenId);
  }
  private String issue(UserPrincipal user, String type, Duration lifetime, String tokenId) {
    Instant now = Instant.now();
    return Jwts.builder().subject(user.email()).id(tokenId).issuedAt(Date.from(now)).expiration(Date.from(now.plus(lifetime)))
        .claim("type", type).claim("uid", user.id().toString())
        .claim("roles", user.authorities().stream().map(GrantedAuthority::getAuthority).toList())
        .signWith(signingKey).compact();
  }
  public Claims parse(String token) { return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload(); }
  public boolean isAccessToken(String token) { return "access".equals(parse(token).get("type", String.class)); }
  public boolean isRefreshToken(String token) { return "refresh".equals(parse(token).get("type", String.class)); }
  public String email(String token) { return parse(token).getSubject(); }
  public String tokenId(String token) { return parse(token).getId(); }
  public Instant refreshExpiry() { return Instant.now().plus(refreshLifetime); }
}
