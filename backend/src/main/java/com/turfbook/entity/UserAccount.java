package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor
public class UserAccount {
  @Id @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;
  @Column(nullable = false, unique = true, length = 255)
  private String email;
  @Column(name = "password_hash", nullable = false, length = 100)
  private String passwordHash;
  @Column(nullable = false, length = 80)
  private String fullName;
  @Column(length = 20)
  private String phone;
  @Column(name = "avatar_url", length = 1000)
  private String avatarUrl;
  @Column(name = "is_email_verified", nullable = false)
  private boolean emailVerified;
  @Column(name = "is_active", nullable = false)
  private boolean active = true;
  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<Role> roles = new HashSet<>();
  @Column(name = "created_at", nullable = false, updatable = false)
  private Instant createdAt;
  @Column(name = "updated_at", nullable = false)
  private Instant updatedAt;

  @PrePersist void onCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
  @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
}
