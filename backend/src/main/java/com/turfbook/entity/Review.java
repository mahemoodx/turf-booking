package com.turfbook.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "reviews", uniqueConstraints = @UniqueConstraint(columnNames = {"turf_id", "user_id"}))
@Getter @Setter @NoArgsConstructor
public class Review {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "turf_id", nullable = false) private Turf turf;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id", nullable = false) private UserAccount user;
  @Column(nullable = false) private int rating;
  @Column(columnDefinition = "text") private String comment;
  @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
  @PrePersist void onCreate() { createdAt = Instant.now(); }
}
