package com.turfbook.entity;

import com.turfbook.enums.SportType;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "turfs")
@Getter @Setter @NoArgsConstructor
public class Turf {
  @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
  @Column(nullable = false, length = 150) private String name;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "city_id", nullable = false) private City city;
  @Column(nullable = false, length = 120) private String area;
  @Column(nullable = false, length = 500) private String address;
  private Double latitude;
  private Double longitude;
  @ElementCollection(targetClass = SportType.class)
  @CollectionTable(name = "turf_sports", joinColumns = @JoinColumn(name = "turf_id"))
  @Enumerated(EnumType.STRING) @Column(name = "sport_type", nullable = false)
  private Set<SportType> sports = new LinkedHashSet<>();
  @Column(name = "price_per_hour", nullable = false, precision = 10, scale = 2) private BigDecimal pricePerHour;
  @Column(nullable = false, precision = 2, scale = 1) private BigDecimal rating = BigDecimal.ZERO;
  @Column(name = "review_count", nullable = false) private int reviewCount;
  @Column(columnDefinition = "text") private String description;
  @ElementCollection
  @CollectionTable(name = "turf_images", joinColumns = @JoinColumn(name = "turf_id"))
  @OrderColumn(name = "display_order") @Column(name = "image_url", nullable = false, length = 1000)
  private List<String> imageUrls = new ArrayList<>();
  @ManyToMany
  @JoinTable(name = "turf_facilities", joinColumns = @JoinColumn(name = "turf_id"), inverseJoinColumns = @JoinColumn(name = "facility_id"))
  private Set<Facility> facilities = new LinkedHashSet<>();
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "created_by") private UserAccount createdBy;
  @Column(name = "is_active", nullable = false) private boolean active = true;
  @Version private Long version;
  @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
  @Column(name = "updated_at", nullable = false) private Instant updatedAt;
  @PrePersist void onCreate() { createdAt = Instant.now(); updatedAt = createdAt; }
  @PreUpdate void onUpdate() { updatedAt = Instant.now(); }
}
