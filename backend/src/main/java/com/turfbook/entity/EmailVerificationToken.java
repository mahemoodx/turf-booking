package com.turfbook.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import lombok.*;

@Entity @Table(name = "email_verification_tokens") @Getter @Setter @NoArgsConstructor
public class EmailVerificationToken {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private UserAccount user;
  @Column(name = "token_hash", nullable = false, unique = true, length = 100) private String tokenHash;
  @Column(name = "expires_at", nullable = false) private Instant expiresAt;
  @Column(name = "used_at") private Instant usedAt;
  @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
  @PrePersist void onCreate() { createdAt = Instant.now(); }
}
