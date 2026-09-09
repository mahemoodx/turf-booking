package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter @Setter @NoArgsConstructor
public class RefreshToken {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private UserAccount user;
  @Column(name = "token_id", nullable = false, unique = true, length = 100) private String tokenId;
  @Column(name = "expires_at", nullable = false) private Instant expiresAt;
  @Column(nullable = false) private boolean revoked;
  @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
  @PrePersist void onCreate() { createdAt = Instant.now(); }
}
