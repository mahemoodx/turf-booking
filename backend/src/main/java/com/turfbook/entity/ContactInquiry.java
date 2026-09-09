package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contact_messages")
@Getter @Setter @NoArgsConstructor
public class ContactInquiry {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @Column(nullable = false, length = 100) private String name;
  @Column(nullable = false, length = 255) private String email;
  @Column(length = 20) private String phone;
  @Column(nullable = false, length = 150) private String subject;
  @Column(nullable = false, columnDefinition = "text") private String message;
  @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
  @PrePersist void onCreate() { createdAt = Instant.now(); }
}
